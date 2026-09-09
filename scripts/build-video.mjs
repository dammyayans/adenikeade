// Trims the hero film to its eye-contact section, ping-pongs it into a seamless
// loop, and encodes the AV1 / VP9 / H.264 ladder plus a poster frame.
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

const SRC = 'scratch/hero/raw.mp4';
const OUT = 'public/media/hero';
const TRIM = 4.0;                       // seconds of held eye contact
const SIZES = [['desktop', 1080], ['mobile', 720]];

mkdirSync(OUT, { recursive: true });
const run = (args) => execFileSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', ...args]);
const kb = (p) => (statSync(p).size / 1024).toFixed(0);

// Forward + reversed = perfect loop: last frame is the first frame.
const pingpong = (w) =>
  `[0:v]trim=0:${TRIM},setpts=PTS-STARTPTS,scale=${w}:${w}:flags=lanczos,format=yuv420p,split[a][b];` +
  `[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]`;

for (const [name, w] of SIZES) {
  run(['-i', SRC, '-filter_complex', pingpong(w), '-map', '[v]', '-an',
       '-c:v', 'libsvtav1', '-crf', '34', '-preset', '6', '-g', '96',
       '-svtav1-params', 'tune=0', `${OUT}/hero-${name}.av1.mp4`]);

  run(['-i', SRC, '-filter_complex', pingpong(w), '-map', '[v]', '-an',
       '-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0', '-row-mt', '1',
       '-deadline', 'good', '-cpu-used', '2', `${OUT}/hero-${name}.vp9.webm`]);

  run(['-i', SRC, '-filter_complex', pingpong(w), '-map', '[v]', '-an',
       '-c:v', 'libx264', '-crf', '25', '-preset', 'slow', '-profile:v', 'high',
       '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${OUT}/hero-${name}.h264.mp4`]);

  console.log(`${name} ${w}x${w}  av1 ${kb(`${OUT}/hero-${name}.av1.mp4`)}KB · ` +
              `vp9 ${kb(`${OUT}/hero-${name}.vp9.webm`)}KB · h264 ${kb(`${OUT}/hero-${name}.h264.mp4`)}KB`);
}

// Poster = frame 0, the LCP element. Must already read as her portrait.
run(['-i', SRC, '-vf', 'select=eq(n\\,0),scale=1080:1080:flags=lanczos', '-frames:v', '1',
     `${OUT}/poster.png`]);
for (const [fmt, o] of [['avif', { quality: 58, effort: 6 }], ['webp', { quality: 82 }], ['jpeg', { quality: 84, mozjpeg: true }]]) {
  await sharp(`${OUT}/poster.png`)[fmt](o).toFile(`${OUT}/poster.${fmt === 'jpeg' ? 'jpg' : fmt}`);
}
const lqip = await sharp(`${OUT}/poster.png`).resize(24).webp({ quality: 32 }).toBuffer();
console.log(`poster  avif ${kb(`${OUT}/poster.avif`)}KB · webp ${kb(`${OUT}/poster.webp`)}KB · jpg ${kb(`${OUT}/poster.jpg`)}KB`);
console.log(`lqip    ${lqip.length}B`);
