// Renders selected Impact Report spreads to web derivatives.
import { createRequire } from 'node:module';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { createCanvas, DOMMatrix, Path2D, ImageData } from '@napi-rs/canvas';

globalThis.DOMMatrix ??= DOMMatrix;
globalThis.Path2D ??= Path2D;
globalThis.ImageData ??= ImageData;

const require = createRequire(import.meta.url);
const pdfjsPath = require.resolve('pdfjs-dist/legacy/build/pdf.mjs');
const pdfjs = await import(pdfjsPath);

const SRC = 'raw/Adenike Adedokun - Brand Design/Presentation Decks & Reports/Wetech Impact Report - 2025.pdf';
const OUT = 'public/media/report';
const PAGES = [
  [1,  'report-cover'],
  [5,  'report-founders-letter'],
  [7,  'report-theory-of-change'],
  [9,  'report-reach-data'],
  [14, 'report-scholarships'],
  [16, 'report-impact-signals'],
  [26, 'report-celebrateher'],
];

await mkdir(OUT, { recursive: true });
const data = new Uint8Array(await readFile(SRC));
const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
console.log(`${doc.numPages} pages in source`);

const out = [];
for (const [n, slug] of PAGES) {
  const page = await doc.getPage(n);
  const vp = page.getViewport({ scale: 2.6 });
  const canvas = createCanvas(Math.ceil(vp.width), Math.ceil(vp.height));
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport: vp }).promise;
  const png = canvas.toBuffer('image/png');

  for (const w of [480, 800, 1200]) {
    for (const [fmt, o] of [['avif', { quality: 55, effort: 6 }], ['webp', { quality: 80 }]]) {
      await sharp(png).resize(w, null, { withoutEnlargement: true })[fmt](o)
        .toFile(path.join(OUT, `${slug}-${w}.${fmt}`));
    }
  }
  const lqip = await sharp(png).resize(20).webp({ quality: 30 }).toBuffer();
  out.push({ slug, page: n, width: canvas.width, height: canvas.height,
             ratio: +(canvas.width / canvas.height).toFixed(4), widths: [480, 800, 1200],
             lqip: `data:image/webp;base64,${lqip.toString('base64')}` });
  console.log(`  p${n} → ${slug}  ${canvas.width}x${canvas.height}`);
}
await writeFile('src/media.report.json', JSON.stringify({ report: out }, null, 2));
console.log('src/media.report.json written');
