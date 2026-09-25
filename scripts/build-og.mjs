// One 1200×630 social card per route, drawn from the site's own data and its own
// pictures — so a link to a case study unfurls as that case study rather than as
// the home page. Run after changing a title, a lead plate, or the palette:
//   npm run assets:og
import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas';
import sharp from 'sharp';
import { mkdir, writeFile, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { loadData } from './og.load.mjs';

const OUT = 'public/media/og';
const W = 1200;
const H = 630;

// The cardigan palette, from src/index.css. Kept as literals because a canvas
// has no custom properties to read.
const C = {
  bone: '#EFE9DC',
  butter: '#F5E3AE',
  rose: '#F49CB8',
  pink: '#F0246F',
  oxblood: '#5E0E1C',
  taupe: '#CBBBAE',
  ink: '#2A0A12',
};

// src/components/Stripe.tsx — same five bands, same proportions.
const BANDS = [
  [C.pink, 1.4],
  [C.butter, 0.9],
  [C.oxblood, 1.1],
  [C.rose, 0.8],
  [C.taupe, 1.3],
];

GlobalFonts.registerFromPath('public/fonts/bricolage-grotesque-700-latin.woff2', 'OGDisplay');
GlobalFonts.registerFromPath('public/fonts/instrument-sans-400-latin.woff2', 'OGSans');
GlobalFonts.registerFromPath('public/fonts/dm-mono-500-latin.woff2', 'OGMono');

const { caseStudies } = await loadData('src/data/caseStudies.ts');
const { site } = await loadData('src/data/site.ts');

await mkdir(OUT, { recursive: true });

/** Greedy wrap at `max` px, capped at `lines`; the last line is ellipsed rather
 *  than allowed to run under the image. */
function wrap(ctx, text, max, lines) {
  const words = text.split(/\s+/);
  const out = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= max || !line) {
      line = next;
    } else {
      out.push(line);
      line = word;
      if (out.length === lines) break;
    }
  }
  if (out.length < lines && line) out.push(line);
  if (out.length === lines) {
    let last = out[lines - 1];
    const consumed = out.join(' ').split(/\s+/).length;
    if (consumed < words.length) {
      while (last && ctx.measureText(`${last}…`).width > max) {
        last = last.slice(0, -1).trimEnd();
      }
      out[lines - 1] = `${last}…`;
    }
  }
  return out;
}

/** Fits a headline into the box by stepping the size down before it wraps to a
 *  fourth line — a three-line title at 62px reads; a five-line one at 62px
 *  spills off the card. */
function fitTitle(ctx, text, max, maxLines, from, to) {
  for (let size = from; size >= to; size -= 3) {
    ctx.font = `800 ${size}px OGDisplay`;
    const lines = wrap(ctx, text, max, maxLines + 1);
    if (lines.length <= maxLines) return { size, lines };
  }
  ctx.font = `800 ${to}px OGDisplay`;
  return { size: to, lines: wrap(ctx, text, max, maxLines) };
}

function tracked(ctx, text, x, y, spacing) {
  let cursor = x;
  for (const ch of text) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + spacing;
  }
}

/** Widest derivative the image pipeline wrote for this slug — the card is
 *  1200px across, so the small ones would be visibly soft. */
async function plate(set, slug) {
  const files = await readdir(path.join('public/media', set)).catch(() => []);
  const widths = files
    .map((f) => f.match(new RegExp(`^${slug}-(\\d+)\\.webp$`))?.[1])
    .filter(Boolean)
    .map(Number)
    .sort((a, b) => b - a);
  if (!widths.length) throw new Error(`no derivative found for ${set}/${slug}`);
  return path.join('public/media', set, `${slug}-${widths[0]}.webp`);
}

/**
 * @param {object} o
 * @param {string} o.eyebrow  Mono, uppercase, letterspaced — the index line.
 * @param {string} o.title    The headline.
 * @param {string} o.byline   First line under the rule.
 * @param {string} o.footer   Second line under the rule.
 * @param {string} o.image    Path to the picture on the right.
 * @param {'cover'|'contain'} o.fit
 */
async function card({ eyebrow, title, byline, footer, image, fit }) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = C.bone;
  ctx.fillRect(0, 0, W, H);

  // ── The picture, held in a panel on the right ──
  const PANEL = 468;
  const panelX = W - PANEL;
  // A cut-out shown whole wants the same ground as the copy beside it; a plate
  // cropped to the panel wants a darker one behind it, in case the source has
  // a transparent corner.
  const panelGround = fit === 'contain' ? C.bone : C.taupe;
  ctx.fillStyle = panelGround;
  ctx.fillRect(panelX, 0, PANEL, H);

  // Resized by sharp rather than by the canvas: a downscale of a 1800px plate
  // to 468 is exactly where a canvas's box filter turns detail to mush, and
  // these cards are mostly detail.
  const box = fit === 'cover'
    ? { width: PANEL, height: H, fit: 'cover', position: 'attention' }
    : { width: PANEL - 36, height: H - 36, fit: 'inside', background: panelGround };
  const buf = await sharp(image).resize(box).flatten({ background: panelGround }).png().toBuffer();
  const img = await loadImage(buf);
  ctx.drawImage(img, panelX + (PANEL - img.width) / 2, (H - img.height) / 2);

  // A seam between panel and ground, in the accent — the site's own device for
  // separating two grounds.
  ctx.fillStyle = C.pink;
  ctx.fillRect(panelX - 5, 0, 5, H);

  // ── Copy ──
  const PAD = 66;
  const measure = panelX - 5 - PAD * 2;

  ctx.fillStyle = C.pink;
  ctx.font = '500 21px OGMono';
  ctx.textBaseline = 'alphabetic';
  tracked(ctx, eyebrow.toUpperCase(), PAD, 150, 1.6);

  const { size, lines } = fitTitle(ctx, title, measure, 4, 72, 42);
  const leading = size * 1.02;
  ctx.fillStyle = C.ink;
  let y = 150 + 58 + size;
  for (const line of lines) {
    ctx.fillText(line, PAD, y);
    y += leading;
  }

  ctx.strokeStyle = C.ink;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, H - 118);
  ctx.lineTo(PAD + measure, H - 118);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = C.ink;
  ctx.font = '600 25px OGSans';
  ctx.fillText(byline, PAD, H - 80);

  ctx.globalAlpha = 0.6;
  ctx.font = '500 19px OGMono';
  ctx.fillText(footer, PAD, H - 48);
  ctx.globalAlpha = 1;

  // ── The crochet band, along the foot of the whole card ──
  const BAND = 10;
  const total = BANDS.reduce((s, [, f]) => s + f, 0);
  let x = 0;
  for (const [colour, flex] of BANDS) {
    const w = (flex / total) * W;
    ctx.fillStyle = colour;
    ctx.fillRect(x, H - BAND, Math.ceil(w), BAND);
    x += w;
  }

  // JPEG, not PNG: several unfurlers still cap the card at 1MB, and every one
  // of them reads JPEG.
  return sharp(canvas.toBuffer('image/png')).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
}

for (const stale of await readdir(OUT).catch(() => [])) {
  if (stale.endsWith('.jpg')) await unlink(path.join(OUT, stale));
}

const jobs = [
  {
    name: 'home.jpg',
    eyebrow: site.disciplines.join(' · '),
    title: `${site.name} — ${site.role.toLowerCase()}`,
    // The headline is already her name, so the rule underneath carries what the
    // headline does not: what she does, and where.
    byline: site.role,
    footer: `${site.domain} · ${site.location}`,
    // The cut-out portrait, shown whole rather than cropped into.
    image: 'public/media/hero/poster.webp',
    fit: 'contain',
  },
  ...caseStudies.map((study) => ({
    name: `${study.slug}.jpg`,
    eyebrow: `${study.index} · ${study.client} · ${study.year}`,
    title: study.title,
    byline: site.name,
    footer: `${site.role} · ${site.domain}`,
    set: study.lead.set,
    slug: study.lead.slug,
    fit: 'cover',
  })),
];

let bytes = 0;
for (const job of jobs) {
  const image = job.image ?? (await plate(job.set, job.slug));
  const out = await card({ ...job, image });
  await writeFile(path.join(OUT, job.name), out);
  bytes += out.length;
  console.log(`  ${job.name.padEnd(26)} ${W}×${H}  ${(out.length / 1024).toFixed(0)}KB`);
}
console.log(`\n${jobs.length} cards · ${(bytes / 1024).toFixed(0)}KB → ${OUT}`);
