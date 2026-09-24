// Case-study films: a trimmed cut plus a poster frame that goes through the same
// AVIF/WebP/LQIP treatment as every still on the site, so the box is reserved and
// the first paint is never blank.
//
// This is NOT the hero pipeline. The hero is an alpha frame sequence scrubbed by
// scroll (scripts/build-video.mjs); this is an ordinary video someone chooses to
// play, with sound, so it ships as one MP4 and nothing is decoded until asked for.
//
// ⚠ SOURCE QUALITY — scratch/film/raw.mp4 is currently a 638×360 social rip at
// 330 kb/s, not the master. Every still on this site is served up to 1800px, so
// the poster ladder below stops at the source's own width and the player is capped
// to a text-column measure in Film.tsx: at that size a 638px source lands near 1×
// and stays honest. When Wetech supplies the master, drop it in at the same path
// and re-run — POSTER_W will widen on its own and the cap in Film.tsx can go.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

const OUT = 'public/media/film';
const TMP = 'scratch/film';

const FILMS = [
  {
    slug: 'conf24-aftermovie',
    src: 'scratch/film/raw.mp4',
    // The route through the venue, and nothing else. The full cut runs 1:22 and
    // tails into a sponsor end card — which is Wetech's marketing, not her work.
    // 0→31s is the arc that matches the chapter: the archway, the queue wrapping
    // the building, registration, the lanyard and QR, the doodle wall, back up the
    // archway, and out onto the main stage with the hall full behind it.
    in: 0,
    out: 31,
    // The straight-on banner at 2s. It is the film announcing itself, and it reads
    // at thumbnail size — which is the only job a poster has.
    posterAt: 2.0,
  },
];

// crf 25 lands around 520 kb/s — comfortably above the source's own 330 kb/s, so
// the re-encode is not the thing you see, without spending megabytes preserving
// the rip's existing artifacts (crf 21 cost 2.7× this for no visible gain). Audio
// likewise: 96k AAC over a 63k HE-AAC source. The fades are a half-second in and
// out of black, with an audio fade at the tail so the music resolves instead of
// being guillotined.
const CRF = 25;
const FADE = 0.5;

const run = (args) => execFileSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', ...args]);
mkdirSync(OUT, { recursive: true });

const out = { film: [] };

for (const film of FILMS) {
  const dur = +(film.out - film.in).toFixed(3);
  const mp4 = path.join(OUT, `${film.slug}.mp4`);

  // ── 1. The cut ────────────────────────────────────────────────────────────
  // -ss before -i seeks on keyframes and is fast; with in=0 it costs nothing and
  // the first frame is exact. faststart moves the index to the front so the
  // browser can begin without fetching the tail.
  run([
    '-ss', String(film.in), '-t', String(dur), '-i', film.src,
    '-vf', `fade=t=in:st=0:d=${FADE},fade=t=out:st=${(dur - FADE).toFixed(3)}:d=${FADE}`,
    '-af', `afade=t=in:st=0:d=${FADE},afade=t=out:st=${(dur - FADE).toFixed(3)}:d=${FADE}`,
    '-c:v', 'libx264', '-crf', String(CRF), '-preset', 'slow',
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.0',
    '-c:a', 'aac', '-b:a', '96k', '-ac', '2',
    '-movflags', '+faststart',
    mp4,
  ]);

  // ── 2. The poster ─────────────────────────────────────────────────────────
  const still = path.join(TMP, `${film.slug}-poster.png`);
  run(['-ss', String(film.in + film.posterAt), '-i', film.src, '-frames:v', '1', still]);

  const meta = await sharp(still).metadata();
  // Never upscale: the ladder stops at the source's own width. When the master
  // lands this picks up the wider rungs on its own.
  const widths = [480, 800, 1200, 1600, 1800].filter((w) => w <= meta.width);
  if (!widths.length) widths.push(meta.width);
  else if (widths[widths.length - 1] !== meta.width) widths.push(meta.width);

  for (const w of widths) {
    for (const [fmt, opts] of [['avif', { quality: 52, effort: 6 }], ['webp', { quality: 78 }]]) {
      await sharp(still)
        .resize(w, null, { withoutEnlargement: true })
        [fmt](opts)
        .toFile(path.join(OUT, `${film.slug}-poster-${w}.${fmt}`));
    }
  }

  const lqip = await sharp(still).resize(20).webp({ quality: 30 }).toBuffer();

  out.film.push({
    slug: `${film.slug}-poster`,
    source: film.src,
    width: meta.width,
    height: meta.height,
    ratio: +(meta.width / meta.height).toFixed(4),
    widths,
    lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
  });

  const size = execFileSync('stat', ['-f%z', mp4]).toString().trim();
  console.log(
    `  film/${film.slug}  ${meta.width}x${meta.height}  ${dur}s  ` +
    `${(size / 1048576).toFixed(2)}MB  poster → ${widths.join(',')}`,
  );
}

await writeFile('src/media.film.json', JSON.stringify(out, null, 2));
console.log('\nsrc/media.film.json written');
