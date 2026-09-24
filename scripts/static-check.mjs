// Serves dist the way an ordinary static host does — directory index first,
// 404.html for misses, no SPA catch-all — then asserts each route's own <h1>.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };

const server = createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = path.join('dist', url);
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
  } catch {
    file = path.join('dist', '404.html');
    res.statusCode = 404;
  }
  try {
    const body = await readFile(file);
    res.setHeader('content-type', TYPES[path.extname(file)] ?? 'application/octet-stream');
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.end('not found');
  }
});

await new Promise((r) => server.listen(5177, r));

const routes = ['/', '/work/power-shift', '/work/wetech-2023-2024', '/work/impact-report',
                '/work/wetech-africa', '/work/interswitch', '/work/does-not-exist'];

let fail = 0;
for (const route of routes) {
  const res = await fetch(`http://localhost:5177${route}`);
  const html = await res.text();
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '')
    .replace(/<[^>]*>/g, '').trim().slice(0, 38);
  const ok = route === '/' ? h1.startsWith('Adenike')
    : route.includes('does-not-exist') ? res.status === 404
    : !h1.startsWith('Adenike') && h1.length > 0;
  if (!ok) fail++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${String(res.status).padEnd(4)} ${route.padEnd(26)} h1="${h1}"`);
}

const home = await fetch('http://localhost:5177/').then((r) => r.text());

// Every asset the document points at must actually be on disk — icons, poster,
// social card, preloads. This is the break that hand-written tags in index.html
// invite: an asset script renames its output and the tag still names the old file,
// which nothing notices until a link preview comes back blank.
const SITE = 'https://adenikeade.com';
const refs = new Set();
for (const [, attr, value] of home.matchAll(/(src|srcset|href|content)="([^"]+)"/gi)) {
  for (const entry of value.split(',')) {
    let u = entry.trim().split(/\s+/)[0];
    if (u.startsWith(SITE)) u = u.slice(SITE.length);
    // Same-origin, and a file rather than a route or an anchor.
    if (!u.startsWith('/') || u.startsWith('//') || u.startsWith('/#')) continue;
    if (!/\.[a-z0-9]{2,12}$/i.test(u)) continue;
    if (attr.toLowerCase() === 'content' && !u.includes('/')) continue;
    refs.add(u);
  }
}
for (const asset of [...refs].sort()) {
  const res = await fetch(`http://localhost:5177${asset}`);
  const ok = res.status === 200;
  if (!ok) fail++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${String(res.status).padEnd(4)} ${asset}`);
}

// The film's frames are fetched by script, so nothing above would catch a manifest
// that has drifted from what the pipeline actually wrote. Check both ends of each
// sequence in both formats.
const seq = JSON.parse(await readFile('src/hero-seq.json', 'utf8'));
for (const key of Object.keys(seq.sizes)) {
  for (const i of [0, seq.frames - 1]) {
    for (const ext of seq.sizes[key].formats) {
      const f = `/media/hero/seq/${key}/${String(i).padStart(3, '0')}.${ext}`;
      const res = await fetch(`http://localhost:5177${f}`);
      const ok = res.status === 200;
      if (!ok) fail++;
      console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${String(res.status).padEnd(4)} ${f}`);
    }
  }
}

// The résumé link is a stub until Adenike supplies the real file — refuse to ship it.
if (home.includes('PLACEHOLDER_RESUME_ID')) {
  fail++;
  console.log('  FAIL      résumé link is still PLACEHOLDER_RESUME_ID (src/data/site.ts)');
}

server.close();
console.log(fail ? `\n${fail} check(s) failed` : '\nall routes serve their own document');
process.exit(fail ? 1 : 0);
