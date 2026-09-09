// Renders every route to its own static HTML file: crawlable, instantly
// painted, and functional with JavaScript disabled.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const mod = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
const template = await readFile('dist/index.html', 'utf8');

const routes = ['/', ...mod.caseStudies.map((c) => `/work/${c.slug}`)];

for (const route of routes) {
  const html = template.replace('<div id="root"></div>', `<div id="root">${mod.render(route)}</div>`);
  const dir = route === '/' ? 'dist' : path.join('dist', route);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), html);
  console.log(`  ${route.padEnd(26)} ${(html.length / 1024).toFixed(1)}KB`);
}
// Static hosts serve this for unmatched paths. Note there is deliberately no
// SPA catch-all rewrite: that would shadow the real prerendered route files.
const notFound = template.replace('<div id="root"></div>', `<div id="root">${mod.render('/404')}</div>`);
await writeFile('dist/404.html', notFound);
console.log(`  /404.html${' '.repeat(18)}${(notFound.length / 1024).toFixed(1)}KB`);

console.log(`${routes.length + 1} documents prerendered`);
