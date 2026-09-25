# Hosting

Deployed on Vercel from `dist`. The build is `npm run build` — typecheck, client
bundle, SSR bundle, then `scripts/prerender.mjs`, which writes one static HTML
file per route plus `sitemap.xml` and `robots.txt`.

## No SPA rewrite

There is deliberately no catch-all rewrite to `index.html`. Every route already
exists as its own file (`dist/work/<slug>/index.html`) carrying its own `<head>`;
a catch-all would shadow those files and serve the home page's title, canonical
and social card on every URL. Unmatched paths fall through to `dist/404.html`,
which is prerendered and carries `noindex`.

## Cache headers (`vercel.json`)

| Path | Policy | Why |
| --- | --- | --- |
| `/assets/*` | 1 year, `immutable` | Vite content-hashes these filenames. A changed file is a new URL, so it can never go stale. |
| `/fonts/*` | 1 year, `immutable` | Written by `npm run assets:fonts` and named by family, weight and subset. They change only when the typeface set does, which is a deliberate act. |
| `/media/*` | 1 week, then `stale-while-revalidate` for a month | ~35MB of derivatives, and the hero sequence alone is 64 files. These are *not* content-hashed — a re-exported image keeps its filename — so `immutable` would strand a replacement. A week fresh plus a month of serve-then-revalidate gets repeat visitors the bytes free without that risk. |
| HTML | Vercel's default (revalidated) | Titles, descriptions and the work list have to be able to change on the next deploy. |

If an image is ever replaced in place and has to be picked up immediately,
redeploy and bump the width in `scripts/build-images.mjs` — or accept up to a
week. There is no cache purge in this setup.
