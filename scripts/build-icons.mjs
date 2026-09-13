// Renders the granny-square mark (public/favicon.svg) to the raster sizes
// browsers and mobile launchers still insist on. Run after editing the SVG.
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const OUT = 'public';
const src = await readFile(`${OUT}/favicon.svg`);

const png = (size, { svg = src, flatten = false } = {}) => {
  const img = sharp(svg, { density: 384 }).resize(size, size);
  // iOS composites any alpha onto black, so the touch icon ships opaque.
  return (flatten ? img.flatten({ background: '#EFE9DC' }) : img)
    .png({ compressionLevel: 9 }).toBuffer();
};

// Launcher icons are masked to a circle; the mark needs a 20% inset to survive it.
const maskable = Buffer.from(
  src.toString().replace('viewBox="0 0 100 100"', 'viewBox="-25 -25 150 150"')
     .replace('<rect width="100" height="100"', '<rect x="-25" y="-25" width="150" height="150"'),
);

// At 16px the three rounds collapse into mud, so that entry drops the inner
// round and reads as a single ring around a solid centre.
const small = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#EFE9DC"/>
  <path d="M50 8 L92 50 L50 92 L8 50 Z" fill="none" stroke="#F0246F" stroke-width="13"/>
  <path d="M50 27 L73 50 L50 73 L27 50 Z" fill="#2A0A12"/>
</svg>`);

/** ICO container wrapping PNG payloads — the format browsers read for /favicon.ico. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e[0] = size === 256 ? 0 : size;
    e[1] = size === 256 ? 0 : size;
    e.writeUInt16LE(1, 4);   // colour planes
    e.writeUInt16LE(32, 6);  // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const targets = [
  ['apple-touch-icon.png', 180, { flatten: true }],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];

for (const [name, size, opts] of targets) {
  await writeFile(`${OUT}/${name}`, await png(size, opts));
  console.log(`  ${name.padEnd(22)} ${size}×${size}`);
}

await writeFile(`${OUT}/icon-maskable-512.png`, await png(512, { svg: maskable }));
console.log(`  icon-maskable-512.png  512×512 (20% inset)`);

await writeFile(
  `${OUT}/favicon.ico`,
  ico(await Promise.all([16, 32, 48].map(async (size) => ({
    size,
    data: await png(size, size === 16 ? { svg: small } : undefined),
  })))),
);
console.log(`  favicon.ico            16/32/48`);
