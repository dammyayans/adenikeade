// Renders every route to its own static HTML file — crawlable, instantly
// painted, and functional with JavaScript disabled — with that route's own
// <head>, then writes the sitemap and robots.txt from the same list.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const mod = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
const { routes, notFoundMeta, headTags, abs, ORIGIN } = mod;

const template = await readFile('dist/index.html', 'utf8');

// index.html carries the home page's head between these markers so the dev
// server and any un-prerendered build still say something sensible. Every
// static document replaces the block wholesale.
const BLOCK = /<!--\s*head:start[\s\S]*?head:end\s*-->/;
if (!BLOCK.test(template)) {
  throw new Error('index.html is missing its <!-- head:start --> … <!-- head:end --> block');
}

const documentFor = (meta, html) =>
  template
    .replace(BLOCK, headTags(meta))
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

for (const meta of routes) {
  const html = documentFor(meta, mod.render(meta.path));
  const dir = meta.path === '/' ? 'dist' : path.join('dist', meta.path);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), html);
  console.log(`  ${meta.path.padEnd(26)} ${(html.length / 1024).toFixed(1)}KB  ${meta.title.slice(0, 44)}`);
}

// Static hosts serve this for unmatched paths. Note there is deliberately no
// SPA catch-all rewrite: that would shadow the real prerendered route files.
// It carries `noindex` — an unmatched URL that got linked should not become a
// page in the index.
const notFound = documentFor(notFoundMeta, mod.render('/404'));
await writeFile('dist/404.html', notFound);
console.log(`  /404.html${' '.repeat(18)}${(notFound.length / 1024).toFixed(1)}KB  noindex`);

// ── Sitemap ──
// One lastmod for the set, from the last commit that touched what the pages are
// built out of. A per-page date would be more useful, but only if it were true;
// stamping today's date on every URL at every deploy is the thing Google has
// said it learns to ignore.
const exec = promisify(execFile);
const lastmod = await exec('git', ['log', '-1', '--format=%cI', '--', 'src', 'public'])
  .then(({ stdout }) => stdout.trim().slice(0, 10))
  .catch(() => new Date().toISOString().slice(0, 10));

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  ...routes.map((meta) =>
    [
      '  <url>',
      `    <loc>${abs(meta.path)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      // The home page is the entry point and the only one that changes when any
      // case study does; the studies themselves are finished work.
      `    <changefreq>${meta.path === '/' ? 'monthly' : 'yearly'}</changefreq>`,
      `    <priority>${meta.path === '/' ? '1.0' : '0.8'}</priority>`,
      // This is a designer's portfolio: the pictures are the work, and image
      // search is a real way in. The card is named because it is the one image
      // per page that is guaranteed to exist and to represent the whole page.
      '    <image:image>',
      `      <image:loc>${abs('/')}${meta.image.replace(/^\//, '')}</image:loc>`,
      `      <image:title>${meta.imageAlt.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</image:title>`,
      '    </image:image>',
      '  </url>',
    ].join('\n'),
  ),
  '</urlset>',
  '',
].join('\n');
await writeFile('dist/sitemap.xml', sitemap);

// Nothing is disallowed, deliberately. Googlebot renders a page before judging
// it, and a `Disallow: /assets/` would stop it fetching the stylesheet and the
// bundle — which shows up as blocked resources and a layout it cannot assess.
// There is nothing on this origin that should not be crawled; the one page that
// should not be *indexed* says so itself, in a meta tag, which is the mechanism
// that actually works. (A URL disallowed here can still be indexed from an
// inbound link — robots.txt controls crawling, not indexing.)
const robots = [
  `# ${ORIGIN}`,
  'User-agent: *',
  'Allow: /',
  '',
  `Sitemap: ${abs('/')}sitemap.xml`,
  '',
].join('\n');
await writeFile('dist/robots.txt', robots);

console.log(`\n${routes.length + 1} documents · sitemap.xml (${routes.length} URLs, lastmod ${lastmod}) · robots.txt`);
