// Serves dist the way an ordinary static host does — directory index first,
// 404.html for misses, no SPA catch-all — then asserts each route's own <h1>.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };

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

// Taken from the build's own route table rather than retyped here: a hand-kept
// copy of this list had already drifted off a renamed slug, and every check
// below it passed against the 404 page without saying so.
const built = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
const routes = [...built.routes.map((m) => m.path), '/work/does-not-exist'];

let fail = 0;
const check = (ok, label) => {
  if (!ok) fail++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}`);
};

const documents = new Map();
for (const route of routes) {
  const res = await fetch(`http://localhost:5177${route}`);
  const html = await res.text();
  documents.set(route, html);
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '')
    .replace(/<[^>]*>/g, '').trim().slice(0, 38);
  const ok = route === '/' ? h1.startsWith('Adenike')
    : route.includes('does-not-exist') ? res.status === 404
    : !h1.startsWith('Adenike') && h1.length > 0;
  check(ok, `${String(res.status).padEnd(4)} ${route.padEnd(26)} h1="${h1}"`);
}

// ── Each document's own head ──
// The break this catches is the one the site shipped with: every prerendered
// route carried the home page's <title> and, worse, its canonical — which tells
// a crawler that all six pages ARE the home page, and takes the case studies out
// of the index altogether. Nothing below is cosmetic.
const tag = (html, re) => html.match(re)?.[1];
const seenTitles = new Set();
const seenCanonicals = new Set();

for (const meta of built.routes) {
  const html = documents.get(meta.path);
  const title = tag(html, /<title>([^<]*)<\/title>/);
  const canonical = tag(html, /<link rel="canonical" href="([^"]+)"/);
  const description = tag(html, /<meta name="description" content="([^"]*)"/);
  const ogImage = tag(html, /<meta property="og:image" content="([^"]+)"/);
  const ogTitle = tag(html, /<meta property="og:title" content="([^"]*)"/);
  const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];

  check(title === meta.title && !seenTitles.has(title), `title    ${meta.path.padEnd(26)} "${(title ?? '').slice(0, 46)}"`);
  check(canonical === built.abs(meta.path) && !seenCanonicals.has(canonical), `canonical${meta.path.padEnd(26)} ${canonical}`);
  // 160 is roughly where a result stops showing the sentence.
  check(!!description && description.length > 60 && description.length <= 165,
    `desc     ${meta.path.padEnd(26)} ${(description ?? '').length} chars`);
  check(ogTitle === meta.title && !!ogImage && ogImage.endsWith(`${meta.image}`),
    `og       ${meta.path.padEnd(26)} ${ogImage?.split('/').pop()}`);
  // Invalid JSON-LD is worse than none: Google drops the whole block silently.
  let ldOk = ld.length > 0;
  for (const [, body] of ld) {
    try { JSON.parse(body); } catch { ldOk = false; }
  }
  check(ldOk, `json-ld  ${meta.path.padEnd(26)} ${ld.length} block(s), parse ${ldOk ? 'ok' : 'FAILED'}`);

  seenTitles.add(title);
  seenCanonicals.add(canonical);
}

// The 404 must ask not to be indexed, and must not claim to be a real page.
const notFound = await fetch('http://localhost:5177/work/does-not-exist').then((r) => r.text());
check(/<meta name="robots" content="noindex/.test(notFound), 'robots   /404                        noindex');

// ── Sitemap and robots ──
const sitemap = await fetch('http://localhost:5177/sitemap.xml').then((r) => r.text());
for (const meta of built.routes) {
  check(sitemap.includes(`<loc>${built.abs(meta.path)}</loc>`), `sitemap  ${meta.path}`);
}
check(!sitemap.includes('/404'), 'sitemap  excludes the 404');
const robotsTxt = await fetch('http://localhost:5177/robots.txt').then((r) => r.text());
check(robotsTxt.includes(`Sitemap: ${built.abs('/')}sitemap.xml`), 'robots.txt names the sitemap');

// ── Fonts are served by this origin ──
// A reintroduced <link> to fonts.googleapis.com costs two connections and a
// blocking round trip before any text can paint, and would silently undo the
// self-hosting.
const home = documents.get('/');
check(!/fonts\.(googleapis|gstatic)\.com/.test(home), 'fonts    no third-party stylesheet');

// Every asset any document points at must actually be on disk — icons, fonts,
// poster, and now a social card per route. This is the break that hand-written
// tags invite: an asset script renames its output and the tag still names the
// old file, which nothing notices until a link preview comes back blank. Every
// route is scanned, not just the home page, because five of the six cards are
// named by exactly one document each.
const SITE = built.ORIGIN;
const refs = new Set();
for (const html of documents.values()) {
  for (const [, attr, value] of html.matchAll(/(src|srcset|href|content)="([^"]+)"/gi)) {
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
}
for (const asset of [...refs].sort()) {
  const res = await fetch(`http://localhost:5177${asset}`);
  check(res.status === 200, `${String(res.status).padEnd(4)} ${asset}`);
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
