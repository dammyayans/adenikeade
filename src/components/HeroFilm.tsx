import { useEffect, useRef, useState } from 'react';
import seq from '../hero-seq.json';

const POSTER_ALT =
  'Adenike Adedokun, arms folded, in a hand-crocheted striped cardigan';

/** The travel. One scroll progress drives the scrub AND the move, so she reads as
 *  turning *because* she is going, not as two effects running side by side.
 *  Transform and opacity only — no layout work per frame, which is what keeps the
 *  scroll off the hero smooth. Tune the whole gesture here. */
const TRAVEL = {
  x: 24,          // vw — centred at rest, right by the end
  xNarrow: 13,    // vw — a phone has no room for the full swing
  y: 4,           // vh — a little downward drift as she recedes
  scale: 0.86,    // she pulls back as she goes
  fadeFrom: 0.78, // progress at which she starts to leave
};

/** How much of the gap to the scroll's frame is closed per 60Hz tick. Low enough
 *  that a flick of the wheel arrives as a glide, high enough that the film never
 *  feels detached from the hand. Applied against real elapsed time below, so a
 *  120Hz display glides at the same rate rather than twice as fast. */
const EASE = 0.16;

/** Below this the film is on frame 0 — which the poster already is, at 1080px and
 *  a quality no 64-frame sequence can afford. So at rest the poster is what shows,
 *  and the canvas only takes over once she starts to turn. That is what keeps the
 *  first thing anyone sees sharp. */
const REST = 0.02;

/** On a phone she stands under the copy, not in front of it: she is scaled to the
 *  height left below #hero-copy-end, with this much air above her hair, and never
 *  smaller than FIT_MIN of her full size. */
const FIT_GAP = 12;
const FIT_MIN = 0.6;
const NARROW = '(max-width: 809px)';

/** 0→1 with the ends flattened, so she doesn't start or stop leaving abruptly. */
const smooth = (t: number) => t * t * (3 - 2 * t);

type Mode = 'still' | 'scrub';
type SizeKey = keyof typeof seq.sizes;

/** The smallest sequence in `ext` that covers `need` device pixels across, else the
 *  largest one there is. Read from the manifest, so adding a size to the pipeline
 *  needs no change here. */
function pickSize(need: number, ext: string): SizeKey | null {
  const keys = (Object.keys(seq.sizes) as SizeKey[])
    .filter((k) => (seq.sizes[k].formats as string[]).includes(ext))
    .sort((a, b) => seq.sizes[a].width - seq.sizes[b].width);
  return keys.find((k) => seq.sizes[k].width >= need) ?? keys[keys.length - 1] ?? null;
}

/** Document offset through offsetTop, not getBoundingClientRect: the hero copy is
 *  mid entrance animation on load, and its transform would misplace its bottom. */
function docTop(el: HTMLElement) {
  let y = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
  return y;
}

export function HeroFilm() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>('still');

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // ── Measure ── runs for everyone, still or scrubbing: the phone fit matters
    // just as much to the poster under reduced motion.
    const col = document.getElementById('hero-film-col');
    const sticky = document.getElementById('hero-film-sticky');
    const copyEnd = document.getElementById('hero-copy-end');
    const narrow = window.matchMedia(NARROW);

    // Cached, and refreshed only on resize: reading layout every frame would force
    // a reflow sixty times a second for numbers that rarely change.
    let span = window.innerHeight; // the pinned layer's travel — the scrub's range
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let travelX = TRAVEL.x;
    let fit = 1;       // scale that keeps her under the copy on a phone
    let fitShift = 0;  // px down, so she shrinks toward her feet, not her middle
    let scrubbing = false;

    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      travelX = narrow.matches ? TRAVEL.xNarrow : TRAVEL.x;
      fit = 1;
      fitShift = 0;
      if (col && sticky) {
        const colTop = docTop(col);
        // The last frame lands, and she has finished leaving, exactly as the stage
        // ends — before Selected Work.
        span = Math.max(1, colTop + col.offsetHeight - sticky.offsetHeight);

        if (narrow.matches && copyEnd) {
          const h = wrap.offsetHeight;
          const room = colTop + sticky.offsetHeight - (docTop(copyEnd) + copyEnd.offsetHeight) - FIT_GAP;
          fit = Math.min(1, Math.max(FIT_MIN, room / h));
          // Scale is about her centre; this puts her feet back on the bottom edge.
          fitShift = ((1 - fit) * h) / 2;
        }
      }
      // The scrub loop writes the transform itself, fit included, every frame.
      if (!scrubbing) wrap.style.transform = `translate3d(0, ${fitShift}px, 0) scale(${fit})`;
    };
    measure();

    // Catches the resize, the orientation flip, and the reflow a late webfont causes
    // in the copy — which moves the buttons without resizing the section around them.
    let stopObserving = () => {};
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => measure());
      if (col) ro.observe(col);
      for (const el of Array.from(copyEnd?.parentElement?.children ?? [])) ro.observe(el);
      stopObserving = () => ro.disconnect();
    } else {
      const onResize = () => measure();
      window.addEventListener('resize', onResize, { passive: true });
      stopObserving = () => window.removeEventListener('resize', onResize);
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const conn = (navigator as { connection?: { saveData?: boolean } }).connection;

    // Reduced motion or Save-Data gets the still and downloads nothing further.
    if (reduce.matches || conn?.saveData) return () => stopObserving();

    setMode('scrub');

    let cancelled = false;
    let raf = 0;
    const frames: (HTMLImageElement | undefined)[] = new Array(seq.frames);
    let highestLoaded = -1;

    const url = (k: string, e: string, i: number) =>
      `/media/hero/seq/${k}/${String(i).padStart(3, '0')}.${e}`;

    const load = async (src: string) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      try {
        await img.decode();
        return img;
      } catch {
        return null;
      }
    };

    const start = async () => {
      // Sized by what she is actually drawn at in device pixels, not by the
      // viewport's width class — a 2× phone draws her wider than a 1× laptop, and
      // choosing by breakpoint sent phones a sequence at half the resolution they
      // show. DPR is capped at 2: past that the megabytes buy nothing visible on a
      // figure in motion.
      const need = wrap.offsetWidth * Math.min(2, window.devicePixelRatio || 1);

      // Format support is settled by fetching the first frame we need anyway,
      // rather than by a synthetic probe. A hand-rolled 1×1 AVIF data URI is
      // rejected by Chromium even though these files decode there perfectly —
      // which quietly sent every visitor down the WebP path. Asking for the real
      // file cannot lie, and on success it costs nothing extra.
      //
      // WebP carries alpha far less efficiently, so the pipeline only encodes it
      // for the small sequence; a browser without AVIF (Safari before 16.4, Firefox
      // before 93) gets that at any viewport — the film still runs, at a weight its
      // vintage can afford.
      const attempt = async (ext: string) => {
        const key = pickSize(need, ext);
        const img = key ? await load(url(key, ext, 0)) : null;
        return key && img ? { key, ext, img } : null;
      };
      const got = (await attempt('avif')) ?? (await attempt('webp'));
      if (cancelled || !got) return;
      const { key, ext } = got;

      // Read the refs only now. The canvas does not exist until setMode('scrub')
      // above has re-rendered, which cannot happen before this function yields —
      // so reading it any earlier gets null and the film never starts.
      const canvas = canvasRef.current;
      const poster = posterRef.current;
      // alpha: true — these frames are cut-outs. An opaque context would paint
      // black behind her.
      const ctx = canvas?.getContext('2d', { alpha: true });
      if (!canvas || !ctx) return;

      const { width: cw, height: ch } = seq.sizes[key];
      canvas.width = cw;
      canvas.height = ch;

      // Position is fractional: the frames either side are cross-faded, so 64
      // stills cover the scroll without stepping.
      let cur = 0;
      let drawn = -1;
      let showingPoster = true;
      let last = performance.now();

      const draw = (now: number) => {
        raf = requestAnimationFrame(draw);

        // Against elapsed time, not per tick: the same glide at 60Hz and at 120Hz.
        // Clamped so a backgrounded tab doesn't resume with one enormous jump.
        const dt = Math.min(64, now - last);
        last = now;
        const k = 1 - Math.pow(1 - EASE, dt / 16.667);

        const p = Math.min(1, Math.max(0, window.scrollY / span));
        const target = p * (seq.frames - 1);
        cur += (target - cur) * k;
        if (Math.abs(target - cur) < 0.01) cur = target;

        // The travel is applied EVERY frame, before anything can bail out. Gating
        // it behind the redraw meant she stopped moving whenever the sequence was
        // still loading, then jumped when it caught up.
        const ep = cur / (seq.frames - 1);
        const t = smooth(ep);
        const leaving = ep <= TRAVEL.fadeFrom
          ? 0
          : smooth((ep - TRAVEL.fadeFrom) / (1 - TRAVEL.fadeFrom));
        wrap.style.transform =
          `translate3d(${(t * travelX * vw) / 100}px, ${(t * TRAVEL.y * vh) / 100 + fitShift}px, 0)` +
          ` scale(${fit * (1 - t * (1 - TRAVEL.scale))})`;
        wrap.style.opacity = String(1 - leaving);

        // Never run past what is in hand — a gap in the sequence would flash a
        // hole, so the film waits on the newest frame instead.
        const at = Math.min(cur, highestLoaded);
        const still = at < REST;

        if (!still && Math.abs(at - drawn) >= 0.004) {
          const i = Math.floor(at);
          const blend = at - i;
          const near = frames[i];
          const next = frames[i + 1];
          if (near) {
            // Cut-outs must be cleared, not painted over: the previous silhouette
            // would otherwise stay behind this one.
            ctx.clearRect(0, 0, cw, ch);
            ctx.globalAlpha = 1;
            ctx.drawImage(near, 0, 0, cw, ch);
            if (next && blend > 0.01) {
              ctx.globalAlpha = blend;
              ctx.drawImage(next, 0, 0, cw, ch);
              ctx.globalAlpha = 1;
            }
            drawn = at;
          }
        }

        // A hard swap, in the same frame as the draw above: the two show the same
        // picture, and a cross-fade would stack two cut-outs half-transparent —
        // a doubled, soft edge for as long as it ran.
        const showPoster = still || drawn < 0;
        if (showPoster !== showingPoster) {
          showingPoster = showPoster;
          if (poster) poster.style.opacity = showPoster ? '1' : '0';
          canvas.style.opacity = showPoster ? '0' : '1';
        }
      };

      frames[0] = got.img;
      highestLoaded = 0;
      scrubbing = true;
      raf = requestAnimationFrame(draw);

      // Sequential from there: in order, and never flooding the connection.
      for (let i = 1; i < seq.frames; i++) {
        if (cancelled) return;
        const img = await load(url(key, ext, i));
        if (!img) continue;
        frames[i] = img;
        highestLoaded = i;
      }
    };

    void start();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stopObserving();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative will-change-[transform,opacity]"
      // Sized by height, but capped so she can never be wider than the screen —
      // the cap is derived from the sequence's own aspect rather than hardcoded,
      // so re-shooting at a different crop cannot silently break the phone layout.
      style={{
        aspectRatio: `${seq.width} / ${seq.height}`,
        height: `min(78svh, ${((94 * seq.height) / seq.width).toFixed(1)}vw, 780px)`,
      }}
    >
      {/* Prerendered, and the only thing shown under reduced motion, Save-Data, a
          failed sequence, or no JS at all — and, for everyone, whenever the film is
          at rest on frame 0. */}
      <picture>
        <source type="image/avif" srcSet="/media/hero/poster.avif" />
        <img
          ref={posterRef}
          src="/media/hero/poster.webp"
          alt={POSTER_ALT}
          width={seq.width}
          height={seq.height}
          {...{ fetchpriority: 'high' }}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </picture>

      {mode === 'scrub' && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-contain"
          style={{ opacity: 0 }}
        />
      )}
    </div>
  );
}
