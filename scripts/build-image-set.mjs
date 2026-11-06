// Builds ONE set from the manifest, with exactly the settings build-images.mjs
// uses, and merges the result into src/media.json. A full `assets:img` run
// reproduces the same output — this just avoids rebuilding every set to add one
// image. Usage: node scripts/build-image-set.mjs <setName>
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ROOT, SETS } from './assets.manifest.mjs';

const OUT = 'public/media';
const WIDTHS = [480, 800, 1200, 1600, 1800];

const setName = process.argv[2];
const set = SETS[setName];
if (!set) {
  console.error(`Unknown set "${setName}". Known: ${Object.keys(SETS).join(', ')}`);
  process.exit(1);
}

await mkdir(path.join(OUT, setName), { recursive: true });
const entries = [];
let bytes = 0;

for (const [file, slug] of set.files) {
  const src = path.join(ROOT, set.dir, file);
  const meta = await sharp(src).metadata();
  const widths = WIDTHS.filter((w) => w <= Math.min(set.w, meta.width));
  if (!widths.length) widths.push(Math.min(set.w, meta.width));

  for (const w of widths) {
    for (const [fmt, opts] of [['avif', { quality: 52, effort: 6 }], ['webp', { quality: 78 }]]) {
      const info = await sharp(src).rotate()
        .resize(w, null, { withoutEnlargement: true })
        [fmt](opts)
        .toFile(path.join(OUT, `${setName}/${slug}-${w}.${fmt}`));
      bytes += info.size;
    }
  }

  const lqip = await sharp(src).rotate().resize(20).webp({ quality: 30 }).toBuffer();
  entries.push({
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

const media = JSON.parse(await readFile('src/media.json', 'utf8'));
media[setName] = entries;
await writeFile('src/media.json', JSON.stringify(media, null, 2));
console.log(`\n${(bytes / 1024).toFixed(0)}KB of derivatives · src/media.json updated`);
