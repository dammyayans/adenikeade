// The hero film is a cut-out scrubbed by scroll, not a video played on a loop — so
// it ships as an alpha frame sequence drawn to a canvas. Two reasons it isn't a
// video: seeking a compressed video per frame needs every frame to be a keyframe,
// and the only alpha video format with real support is VP9/WebM, which Safari does
// not decode. Stills sidestep both.
//
// Pipeline: ffmpeg cuts frames → Vision lifts her off the background (scripts/matte.swift)
// → every frame is cropped to ONE shared box → AVIF + WebP with alpha.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, readdirSync, statSync, existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

const SRC = 'scratch/hero/raw.mp4';
const OUT = 'public/media/hero';
const TMP = 'scratch/frames';
const CUT = 'scratch/cut';
const TRIM = 5.0;   // the whole take: she holds the camera, then turns to profile
const FRAMES = 64;  // scroll is continuous; the canvas cross-fades between these
// A ladder, picked in HeroFilm by the width she is drawn at in DEVICE pixels, so
// nothing is upscaled: she lands ~580 CSS px wide on a laptop and ~430 on a phone,
// which at 2× is 1160 and 860 — both want 'xl'. 'lg' covers 1× laptops, 'sm' 1×
// small screens and the WebP fallback. The largest stops at 1080; the crop is 1246
// and the last 15% is not visible on a figure in motion.
//
// q36, not q28: at q28 the face lost its eyes and skin texture even at full size.
// q36 is within sight of the q58 poster, so the hand-off from poster to film on the
// first scroll does not read as the picture going soft.
const SIZES = [['xl', 1080], ['lg', 760], ['sm', 480]];
const AVIF = { quality: 36, effort: 7, chromaSubsampling: '4:2:0' };
const WEBP = { quality: 48, alphaQuality: 78 };
// WebP only for the small sequence. A browser without AVIF is served 'sm' at any
// viewport (see HeroFilm), so encoding 'lg' in WebP would ship three megabytes
// that nothing ever requests.
const WEBP_SIZES = new Set(['sm']);

// The studio shot is lit brighter than the page. Graded here rather than with a CSS
// filter so it costs nothing at runtime and the poster, the frames and the social
// card can never drift apart.
const GRADE = { saturation: 0.72, brightness: 0.95 };
const PAD = 0.015;  // breathing room around the union box, as a fraction of it

const run = (args) => execFileSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', ...args]);

// ── 1 & 2. Frames, then matte ───────────────────────────────────────────────
// Matting is minutes; encoding is seconds. Cache on the source so tuning the
// encoder doesn't pay for the model again. Delete scratch/cut to force a rematte.
const cached = existsSync(CUT) &&
  readdirSync(CUT).filter((f) => f.endsWith('.png')).length === FRAMES &&
  statSync(CUT).mtimeMs > statSync(SRC).mtimeMs;

if (cached) {
  console.log(`  reusing ${CUT} (delete it to rematte)`);
} else {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
  run(['-i', SRC, '-vf', `trim=0:${TRIM},setpts=PTS-STARTPTS,fps=${FRAMES / TRIM}`,
       path.join(TMP, 'f-%03d.png')]);

  // Rebuilt only when the source changes; swiftc is slow enough to notice.
  mkdirSync('scratch', { recursive: true });
  const bin = 'scratch/matte';
  if (!existsSync(bin) || statSync(bin).mtimeMs < statSync('scripts/matte.swift').mtimeMs) {
    console.log('  building scripts/matte.swift');
    execFileSync('swiftc', ['-O', 'scripts/matte.swift', '-o', bin], { stdio: 'inherit' });
  }
  rmSync(CUT, { recursive: true, force: true });
  console.log('  matting');
  execFileSync(bin, [TMP, CUT], { stdio: 'inherit' });
}

const cuts = readdirSync(CUT).filter((f) => f.endsWith('.png')).sort().slice(0, FRAMES);
if (cuts.length < FRAMES) throw new Error(`only ${cuts.length}/${FRAMES} frames matted`);

// ── 3. One shared crop box ──────────────────────────────────────────────────
// Cropping each frame to its own subject would make her jitter and change size
// between frames. The union of every frame's alpha keeps the geometry fixed, so
// all the motion on screen is motion that was in the take.
let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1, W = 0, H = 0;
for (const f of cuts) {
  const { data, info } = await sharp(path.join(CUT, f))
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  W = info.width; H = info.height;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // 8/255 — anything fainter is matting noise, not hair.
      if (data[(y * W + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
}
const padX = Math.round((x1 - x0) * PAD), padY = Math.round((y1 - y0) * PAD);
x0 = Math.max(0, x0 - padX); y0 = Math.max(0, y0 - padY);
x1 = Math.min(W - 1, x1 + padX); y1 = Math.min(H - 1, y1 + padY);
const box = { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
console.log(`  crop ${box.width}×${box.height} from ${W}×${H}`);

// ── 4. Encode ───────────────────────────────────────────────────────────────
const manifest = {
  frames: cuts.length,
  width: box.width,
  height: box.height,
  sizes: {},
};

for (const [key, w] of SIZES) {
  const dir = path.join(OUT, 'seq', key);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const h = Math.round((box.height / box.width) * w);

  const alsoWebp = WEBP_SIZES.has(key);
  let avif = 0, webp = 0;
  for (let i = 0; i < cuts.length; i++) {
    const src = sharp(path.join(CUT, cuts[i])).extract(box).resize(w, h).modulate(GRADE);
    const n = String(i).padStart(3, '0');
    const a = await src.clone().avif(AVIF).toFile(path.join(dir, `${n}.avif`));
    avif += a.size;
    if (alsoWebp) {
      const b = await src.clone().webp(WEBP).toFile(path.join(dir, `${n}.webp`));
      webp += b.size;
    }
  }
  // The manifest carries the formats so the checker asserts what was written
  // rather than what it assumes.
  manifest.sizes[key] = {
    width: w, height: h, avifBytes: avif,
    formats: alsoWebp ? ['avif', 'webp'] : ['avif'],
    ...(alsoWebp ? { webpBytes: webp } : {}),
  };
  console.log(`  seq/${key} ${w}×${h} · ${cuts.length} frames · avif ${(avif / 1024).toFixed(0)}KB` +
    (alsoWebp ? ` · webp ${(webp / 1024).toFixed(0)}KB` : ''));
}

// Frame 0 doubles as the poster: the LCP element, and the still shown under
// reduced motion, Save-Data or no JS. No JPEG — it cannot carry the cut-out.
const poster = sharp(path.join(CUT, cuts[0])).extract(box)
  .resize(1080, Math.round((box.height / box.width) * 1080)).modulate(GRADE);
// No PNG either: the <img> falls back to the WebP, and a 2MB file nothing needs
// is one a deploy will eventually serve.
for (const [fmt, o] of [['avif', { ...AVIF, quality: 58 }], ['webp', { ...WEBP, quality: 84 }]]) {
  await poster.clone()[fmt](o).toFile(path.join(OUT, `poster.${fmt}`));
}
for (const stale of ['poster.jpg', 'poster.png']) rmSync(path.join(OUT, stale), { force: true });

// The social card cannot be the poster: a cut-out is transparent, and every
// platform flattens it onto white and crops it to landscape. So it gets built —
// her, standing on the site's own ground, at the 1.91:1 they crop to.
const OG = { w: 1200, h: 630 };
const her = await sharp(path.join(CUT, cuts[0])).extract(box)
  .resize({ height: Math.round(OG.h * 0.96) }).modulate(GRADE).png().toBuffer();
const herW = (await sharp(her).metadata()).width;
await sharp({ create: { width: OG.w, height: OG.h, channels: 3, background: '#EFE9DC' } })
  .composite([{ input: her, left: OG.w - herW - 60, top: OG.h - Math.round(OG.h * 0.96) }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(OUT, 'og.jpg'));

const kb = (p) => (statSync(p).size / 1024).toFixed(0);
console.log(`  og.jpg  ${OG.w}×${OG.h} · ${kb(`${OUT}/og.jpg`)}KB`);
console.log(`  poster  avif ${kb(`${OUT}/poster.avif`)}KB · webp ${kb(`${OUT}/poster.webp`)}KB`);

await writeFile('src/hero-seq.json', JSON.stringify(manifest, null, 2));
console.log('  src/hero-seq.json written');
