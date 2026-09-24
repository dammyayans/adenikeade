import { useRef, useState } from 'react';
import { Picture } from './Picture';
import { useReveal } from '../hooks/useReveal';

/** A film someone chooses to play — not the hero.
 *
 *  The hero is a cut-out scrubbed by scroll, decoded from stills because scroll is
 *  continuous and nobody asked for it. This is the opposite case: it has sound,
 *  it runs to an end, and it costs nothing until it is wanted. So `preload="none"`
 *  and a real poster — the network sees one ~19KB AVIF until someone presses play.
 *
 *  Deliberately not autoplaying, and deliberately not muted. A silent loop is
 *  wallpaper; the crowd is half of what an event world actually is.
 *
 *  MEASURE — capped at `--film-measure` rather than run full-bleed. The source is
 *  638px wide (see scripts/build-film.mjs), and at this measure it lands near 1×
 *  instead of being stretched four metres across a page whose every still is
 *  served at up to 1800. When the master arrives, raise the cap. */
type Props = {
  slug: string;
  poster: string;
  caption: string;
  credit?: string;
  ratio?: string;
};

export function Film({ slug, poster, caption, credit, ratio = '16 / 9' }: Props) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.15);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  // The poster lives in the markup until play, rather than as the <video>'s own
  // poster attribute: that way it goes through the same AVIF/WebP/LQIP ladder as
  // every other picture here, instead of being a single un-negotiated JPEG.
  function play() {
    setStarted(true);
    // The element is already mounted, so this is the user gesture — autoplay
    // policy allows sound because the click is what called it.
    void videoRef.current?.play();
  }

  return (
    <div ref={ref} className={shown ? 'reveal-in' : 'reveal-out'}>
      <figure className="m-0 mx-auto max-w-[var(--film-measure)]">
        <div
          className="relative overflow-hidden rounded-[2px] bg-[var(--color-taupe)]"
          style={{ aspectRatio: ratio }}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={`/media/film/${slug}.mp4`}
            preload="none"
            playsInline
            controls={started}
            onEnded={() => setStarted(false)}
          />

          {!started && (
            <button
              type="button"
              onClick={play}
              className="group absolute inset-0 grid cursor-pointer place-items-center border-0 p-0"
              aria-label={`Play film — ${caption}`}
            >
              <Picture
                set="film"
                slug={poster}
                alt=""
                sizes="(min-width: 810px) 46vw, 92vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Scrim: the poster is a bright banner in daylight and the control
                  has to stay legible on it without dimming the whole frame. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(42,10,18,0.45),rgba(42,10,18,0.05)_45%)]"
              />
              <span
                aria-hidden="true"
                className="relative grid h-16 w-16 place-items-center rounded-full bg-[var(--color-paper)]/92 text-[var(--color-oxblood)] shadow-[0_6px_24px_rgba(42,10,18,0.28)] transition-transform duration-300 ease-out group-hover:scale-110 desktop:h-20 desktop:w-20"
              >
                {/* A triangle, optically centred — a glyph would be vertically off. */}
                <svg viewBox="0 0 24 24" className="ml-[3px] h-6 w-6 desktop:h-7 desktop:w-7" fill="currentColor">
                  <path d="M6 3.5v17l15-8.5z" />
                </svg>
              </span>
            </button>
          )}
        </div>

        <figcaption className="caption mt-3 max-w-[64ch] opacity-60">
          {caption}
          {credit && <span className="block opacity-80">{credit}</span>}
        </figcaption>
      </figure>
    </div>
  );
}
