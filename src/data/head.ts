import { site } from "./site";
import { abs, type PageMeta } from "./meta";
import { jsonLdFor } from "./jsonld";

/** Text going into an attribute or a text node. Case-study copy is full of
 *  curly quotes and ampersands, and one unescaped `"` would end the attribute
 *  and swallow the rest of the tag. */
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** JSON-LD sits in a text node, not an attribute, so the one sequence that has
 *  to be broken up is the closing script tag. */
const escJson = (value: object) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

/** The complete head for a route, as markup. The prerenderer writes this into
 *  each static document; `useHead` applies the same values to a live DOM on a
 *  client-side navigation. One source, so a crawler and a reader who clicked
 *  through can never be shown different metadata. */
export function headTags(meta: PageMeta): string {
  const url = abs(meta.path);
  const image = `${abs("/")}${meta.image.replace(/^\//, "")}`;

  const tags = [
    meta.preloadImage
      ? `<link rel="preload" as="image" href="${meta.preloadImage.href}" type="${meta.preloadImage.type}" fetchpriority="high" />`
      : "",
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    meta.noindex ? `<meta name="robots" content="noindex, follow" />` : "",
    "",
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:locale" content="en_NG" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:alt" content="${esc(meta.imageAlt)}" />`,
    "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${esc(meta.imageAlt)}" />`,
    // `data-route` is how useHead finds these again. It does not rebuild the
    // graph on a client-side navigation — it removes this one, so the live DOM
    // stops asserting a page the reader has left.
    ...jsonLdFor(meta).map(
      (node) =>
        `<script type="application/ld+json" data-route>${escJson(node)}</script>`,
    ),
  ];

  // Empty entries are the deliberate blank lines between groups, plus whatever
  // a route declined to emit; either way they collapse to whitespace in the
  // document, which is what the source of a page should look like anyway.
  return tags.join("\n    ").trimEnd();
}
