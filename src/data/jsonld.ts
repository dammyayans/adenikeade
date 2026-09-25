import { site, about, contactLinks, archive } from "./site";
import { caseStudies } from "./caseStudies";
import { ORIGIN, type PageMeta } from "./meta";

/** Structured data lives here, apart from `meta.ts`, because only the
 *  prerenderer needs it. A crawler reads the static document; the browser that
 *  navigates client-side has already been served the graph for the page it
 *  landed on, and shipping every route's graph to it would put roughly 4KB
 *  gzipped of markup nobody reads into the main bundle. */

const person = {
  "@type": "Person",
  "@id": `${ORIGIN}/#person`,
  name: site.name,
  jobTitle: site.role,
  description: about.lead,
  url: `${ORIGIN}/`,
  image: `${ORIGIN}/media/og/home.jpg`,
  email: `mailto:${contactLinks[0].value}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
  knowsAbout: [...about.services, ...site.disciplines],
  worksFor: { "@type": "Organization", name: archive[0].org },
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Ilorin" },
  sameAs: contactLinks
    .filter((l) => l.href.startsWith("http"))
    .map((l) => l.href),
};

const website = {
  "@type": "WebSite",
  "@id": `${ORIGIN}/#website`,
  url: `${ORIGIN}/`,
  name: `${site.name} — ${site.role}`,
  inLanguage: "en",
  publisher: { "@id": `${ORIGIN}/#person` },
};

/** The graph for a route. Every node points back at the one `#person` and
 *  `#website` rather than restating them, which is what lets a crawler treat
 *  six documents as one site with one author. */
export function jsonLdFor(meta: PageMeta): object[] {
  if (meta.noindex) return [];

  if (meta.path === "/") {
    return [
      { "@context": "https://schema.org", "@graph": [person, { ...website, description: meta.description }] },
      {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": `${ORIGIN}/#profilepage`,
        url: `${ORIGIN}/`,
        name: meta.title,
        mainEntity: { "@id": `${ORIGIN}/#person` },
        // No `about`: it is meant to say what the page is about, and the
        // outcomes on the page are not that. A list of figures there is not
        // something a result will ever show, and promotional copy in
        // structured data is what spam looks like. `mainEntity` already
        // answers the question.
        hasPart: caseStudies.map((c) => ({
          "@type": "CreativeWork",
          "@id": `${ORIGIN}/work/${c.slug}#work`,
          name: c.title,
          url: `${ORIGIN}/work/${c.slug}`,
        })),
      },
    ];
  }

  // The full Person node lives on the home page. A case study repeats only
  // enough of it to stand on its own — a crawler that reaches a deep link first
  // should not have to have fetched another page to know who made the work.
  const author = {
    "@type": "Person",
    "@id": `${ORIGIN}/#person`,
    name: site.name,
    jobTitle: site.role,
    url: `${ORIGIN}/`,
  };

  const study = caseStudies.find((c) => `/work/${c.slug}` === meta.path);
  if (!study) return [];
  const url = `${ORIGIN}${meta.path}`;
  const role = study.meta.find((m) => m.k === "Role")?.v ?? site.role;

  return [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${url}#work`,
      name: study.title,
      headline: study.title,
      url,
      abstract: study.proposition,
      image: `${ORIGIN}${meta.image}`,
      inLanguage: "en",
      creator: author,
      author: { "@id": `${ORIGIN}/#person` },
      about: role,
      // The first year in the range — "2023–2024" is when it ran, not a date.
      dateCreated: study.year.split(/[\u2013-]/)[0].trim(),
      isPartOf: { "@id": `${ORIGIN}/#website` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Work", item: `${ORIGIN}/#work` },
        { "@type": "ListItem", position: 2, name: study.title, item: url },
      ],
    },
  ];
}
