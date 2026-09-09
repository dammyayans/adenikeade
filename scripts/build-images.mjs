// Responsive AVIF + WebP derivatives with an inline LQIP, written to public/media.
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ROOT, SETS } from './assets.manifest.mjs';

const OUT = 'public/media';
const WIDTHS = [480, 800, 1200, 1600, 1800];

const out = {};
let count = 0, bytes = 0;

for (const [setName, set] of Object.entries(SETS)) {
  await mkdir(path.join(OUT, setName), { recursive: true });
  out[setName] = [];

  for (const [file, slug] of set.files) {
    const src = path.join(ROOT, set.dir, file);
    const base = sharp(src).rotate();
    const meta = await base.metadata();
    const widths = WIDTHS.filter((w) => w <= Math.min(set.w, meta.width));
    if (!widths.length) widths.push(Math.min(set.w, meta.width));

    const sources = [];
    for (const w of widths) {
      for (const [fmt, opts] of [['avif', { quality: 52, effort: 6 }], ['webp', { quality: 78 }]]) {
        const rel = `${setName}/${slug}-${w}.${fmt}`;
        const info = await sharp(src).rotate()
          .resize(w, null, { withoutEnlargement: true })
          [fmt](opts)
          .toFile(path.join(OUT, rel));
        sources.push({ w, fmt, rel, size: info.size });
        count++; bytes += info.size;
      }
    }

    // 20px LQIP, inlined as a data URI so nothing extra is requested.
    const lqip = await sharp(src).rotate().resize(20).webp({ quality: 30 }).toBuffer();

    out[setName].push({
      slug,
      source: file,
      width: meta.width,
      height: meta.height,
      ratio: +(meta.width / meta.height).toFixed(4),
      widths,
      lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
    });
    console.log(`  ${setName}/${slug}  ${meta.width}x${meta.height}  →  ${widths.join(',')}`);
  }
}

await writeFile('src/media.json', JSON.stringify(out, null, 2));
console.log(`\n${count} derivatives · ${(bytes / 1048576).toFixed(1)}MB total · src/media.json written`);
