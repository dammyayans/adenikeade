import { site } from "./site";
import { caseStudies } from "./caseStudies";

export const ORIGIN = `https://${site.domain}`;

/** Absolute, no trailing slash except at the root — canonical tags and sitemap
 *  entries have to agree exactly or they cancel each other out. */
export const abs = (path: string) =>
  path === "/" ? `${ORIGIN}/` : `${ORIGIN}${path.replace(/\/$/, "")}`;

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  /** Path under /media/og. Every route has its own card. */
  image: string;
  imageAlt: string;
  type: "website" | "article";
  /** Kept out of the sitemap and told not to index. */
  noindex?: boolean;
  /** The one picture worth a `<link rel=preload>`: whatever this route's
   *  largest contentful paint is going to be. Only the home page has a
   *  candidate the markup does not already name — a case study's lead plate is
   *  a real `<img fetchpriority=high>` in the prerendered HTML, which the
   *  preload scanner finds just as early and without the risk of preloading a
   *  size the responsive `srcset` then declines to use. */
  preloadImage?: { href: string; type: string };
};

const SITE_TITLE = `${site.name} — ${site.role}`;

/** 150–160 characters, ending on a full stop. Longer is truncated in the
 *  result; shorter wastes the only line of copy Google shows. */
const HOME_DESCRIPTION =
  "Brand designer in Lagos building identity, event worlds and campaign systems at volume — for Wetech, Interswitch and FMDQ. Selected work and case studies.";

/** A case study's own description: the proposition is already one written
 *  sentence about the work, so it is used rather than a synthesised summary —
 *  cut back to a clause boundary, or failing that a word boundary, if it runs
 *  past what a result will show. */
function clamp(text: string, max = 158) {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  // A clause boundary reads as a considered stop; a word boundary reads as the
  // sentence having been cut off mid-thought. Only the last quarter of the
  // window is searched, so preferring one never costs much of the line.
  const clause = Math.max(
    cut.lastIndexOf(", "),
    cut.lastIndexOf(" — "),
    cut.lastIndexOf("; "),
  );
  const at = clause > max * 0.72 ? clause : cut.lastIndexOf(" ");
  return `${cut.slice(0, at)}…`;
}

export const homeMeta: PageMeta = {
  path: "/",
  title: SITE_TITLE,
  description: HOME_DESCRIPTION,
  image: "/media/og/home.jpg",
  imageAlt: `${site.name}, brand designer, ${site.location}`,
  type: "website",
  // The hero portrait — the home page's LCP element, and the only thing above
  // the fold that the HTML does not already name. It was preloaded on every
  // route before, which cost each case study 76KB it never painted.
  preloadImage: { href: "/media/hero/poster.avif", type: "image/avif" },
};

export const caseStudyMeta = (slug: string): PageMeta | undefined => {
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) return undefined;

  return {
    path: `/work/${slug}`,
    // Client and year earn their place in the title: the query that finds this
    // page is far more likely to name the client than the project.
    title: `${study.title} — ${study.client}, ${study.year} · ${site.name}`,
    description: clamp(study.proposition),
    image: `/media/og/${slug}.jpg`,
    imageAlt: `${study.title} — ${study.client}`,
    type: "article",
  };
};

export const notFoundMeta: PageMeta = {
  path: "/404",
  title: `Nothing here — ${site.name}`,
  description: "That page does not exist.",
  image: "/media/og/home.jpg",
  imageAlt: `${site.name}, brand designer, ${site.location}`,
  type: "website",
  noindex: true,
};

/** The one place that maps a URL onto its head — read by the prerenderer at
 *  build time and by the router on a client-side navigation, so the two can
 *  never disagree. */
export function metaFor(path: string): PageMeta {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  if (clean === "/") return homeMeta;
  const match = clean.match(/^\/work\/([\w-]+)$/);
  return (match && caseStudyMeta(match[1])) || notFoundMeta;
}

/** Every indexable route, in the order the sitemap should list them. */
export const routes: PageMeta[] = [
  homeMeta,
  ...caseStudies.map((c) => caseStudyMeta(c.slug)!),
];
