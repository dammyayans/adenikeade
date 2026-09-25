import { useEffect } from 'react';
import { metaFor, abs } from '../data/meta';
import { site } from '../data/site';

/** Tags this hook owns. Anything else in the head — icons, the manifest, the
 *  font preloads, the stylesheet — is left alone. */
type Tag = { sel: string; attrs: Record<string, string> };

function tagsFor(path: string): Tag[] {
  const meta = metaFor(path);
  const url = abs(meta.path);
  const image = `${abs('/')}${meta.image.replace(/^\//, '')}`;

  const name = (n: string, content: string): Tag => ({
    sel: `meta[name="${n}"]`,
    attrs: { name: n, content },
  });
  const prop = (p: string, content: string): Tag => ({
    sel: `meta[property="${p}"]`,
    attrs: { property: p, content },
  });

  return [
    { sel: 'link[rel="canonical"]', attrs: { rel: 'canonical', href: url } },
    name('description', meta.description),
    ...(meta.noindex ? [name('robots', 'noindex, follow')] : []),
    prop('og:type', meta.type),
    prop('og:site_name', site.name),
    prop('og:locale', 'en_NG'),
    prop('og:url', url),
    prop('og:title', meta.title),
    prop('og:description', meta.description),
    prop('og:image', image),
    prop('og:image:width', '1200'),
    prop('og:image:height', '630'),
    prop('og:image:type', 'image/jpeg'),
    prop('og:image:alt', meta.imageAlt),
    name('twitter:card', 'summary_large_image'),
    name('twitter:title', meta.title),
    name('twitter:description', meta.description),
    name('twitter:image', image),
    name('twitter:image:alt', meta.imageAlt),
  ];
}

/** The URL this document was prerendered for — captured once, before any
 *  navigation, because that is what the markup already in the head describes. */
const LANDED_ON =
  typeof window === 'undefined'
    ? ''
    : window.location.pathname.replace(/\/+$/, '') || '/';

/** Keeps the document head in step with the route on a client-side navigation.
 *
 *  Crawlers and link unfurlers fetch each URL directly and read the prerendered
 *  document — they never reach this code, and what they are served is already
 *  correct. This exists for the reader in the tab: the title in their history,
 *  what a bookmark is called, and what the browser's own share sheet picks up. */
export function useHead(path: string) {
  useEffect(() => {
    const meta = metaFor(path);
    if (document.title !== meta.title) document.title = meta.title;

    const wanted = tagsFor(path);
    const keep = new Set(wanted.map((t) => t.sel));

    for (const { sel, attrs } of wanted) {
      let el = document.head.querySelector(sel);
      if (!el) {
        el = document.createElement(sel.startsWith('link') ? 'link' : 'meta');
        document.head.appendChild(el);
      }
      for (const [k, v] of Object.entries(attrs)) {
        if (el.getAttribute(k) !== v) el.setAttribute(k, v);
      }
    }

    // A route that does not want a tag the previous one wrote — today only
    // `robots` — has to have it taken away, not merely left unwritten.
    // Otherwise one click off the 404 page would leave `noindex` standing on a
    // page that should be indexed.
    const owned = 'meta[name="robots"]';
    if (!keep.has(owned)) document.head.querySelector(owned)?.remove();

    // Structured data is not rebuilt here. The prerenderer writes the right
    // graph into every static document, and nothing that reads a graph arrives
    // any other way. What this has to do is take the landing page's graph away
    // once the reader has navigated off it, so the live DOM never asserts that
    // this page is one it no longer is. Rebuilding it instead would mean
    // carrying every route's graph in the main bundle for nobody to read.
    if (path.replace(/\/+$/, '') !== LANDED_ON) {
      for (const stale of document.head.querySelectorAll(
        'script[type="application/ld+json"][data-route]',
      )) {
        stale.remove();
      }
    }
  }, [path]);
}
