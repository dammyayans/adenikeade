// Builds labelled contact sheets so the whole archive can be reviewed at a glance.
// Usage: node scripts/contact-sheets.mjs
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = 'raw/Adenike Adedokun - Brand Design';
const OUT = 'scratch/contact';
const COLS = 4, PER_SHEET = 12, CELL_W = 420, CELL_H = 340, PAD = 14, LABEL_H = 30;
const IMG_RE = /\.(jpe?g|png)$/i;

const FOLDERS = [
  ['flyers', 'Flyers'],
  ['website', 'Website Design'],
  ['conf2023', 'Event Branding/Wetech Conference 2023'],
  ['conf2024', 'Event Branding/Wetech Conference 2024'],
  ['booklaunch', 'Event Branding/Book Launch'],
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function labelSvg(text, w, h) {
  return Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
       <rect width="${w}" height="${h}" fill="#2A0A12"/>
       <text x="8" y="20" font-family="monospace" font-size="14" fill="#F5E3AE">${esc(text)}</text>
     </svg>`
  );
}

const manifest = {};

for (const [key, rel] of FOLDERS) {
  const dir = path.join(ROOT, rel);
  const files = (await readdir(dir)).filter((f) => IMG_RE.test(f)).sort();
  manifest[key] = files;
  await mkdir(OUT, { recursive: true });

  for (let s = 0; s * PER_SHEET < files.length; s++) {
    const slice = files.slice(s * PER_SHEET, (s + 1) * PER_SHEET);
    const rows = Math.ceil(slice.length / COLS);
    const W = COLS * (CELL_W + PAD) + PAD;
    const H = rows * (CELL_H + LABEL_H + PAD) + PAD;

    const composites = [];
    for (let i = 0; i < slice.length; i++) {
      const col = i % COLS, row = Math.floor(i / COLS);
      const left = PAD + col * (CELL_W + PAD);
      const top = PAD + row * (CELL_H + LABEL_H + PAD);
      const idx = s * PER_SHEET + i;

      const thumb = await sharp(path.join(dir, slice[i]))
        .rotate()
        .resize(CELL_W, CELL_H, { fit: 'contain', background: '#16070C' })
        .jpeg({ quality: 82 })
        .toBuffer();

      composites.push({ input: thumb, left, top });
      composites.push({
        input: labelSvg(`${String(idx).padStart(2, '0')}  ${slice[i]}`, CELL_W, LABEL_H),
        left,
        top: top + CELL_H,
      });
    }

    const out = path.join(OUT, `${key}-${s + 1}.jpg`);
    await sharp({ create: { width: W, height: H, channels: 3, background: '#16070C' } })
      .composite(composites)
      .jpeg({ quality: 78 })
      .toFile(out);
    console.log(`${out}  (${slice.length} images)`);
  }
}

await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('\nmanifest written');
