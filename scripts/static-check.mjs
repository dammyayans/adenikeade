// Serves dist the way an ordinary static host does — directory index first,
// 404.html for misses, no SPA catch-all — then asserts each route's own <h1>.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json' };

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

const routes = ['/', '/work/power-shift', '/work/wetech-conference', '/work/impact-report',
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

server.close();
console.log(fail ? `\n${fail} route(s) failed` : '\nall routes serve their own document');
process.exit(fail ? 1 : 0);
