export const RESUME_URL =
  "https://docs.google.com/document/d/1i-a2Em0rV2OviYpYrAHzm_yXgXEpjfc0KBuXlv6kEnA/preview";
export const EMAIL = "islamiahadedokun@gmail.com";

export const site = {
  name: "Adenike Adedokun",
  role: "Brand designer",
  tagline:
    "Brand designer creating identities and experiences that make an impact.",
  intro:
    "From brand identities to digital campaigns, websites and live experiences, I bring ideas to life across every touchpoint.",
  /** Also the marquee, and the `knowsAbout` list in the structured data. */
  disciplines: [
    "Brand identity",
    "Campaign systems",
    "Event branding",
    "Digital design",
    "Art direction",
    "Brand communications",
  ],
  location: "Lagos, Nigeria",
  timeZone: "Africa/Lagos",
  domain: "adenikeade.com",
} as const;

export const nav = [
  { index: "01", label: "Work", href: "#work" },
  { index: "02", label: "About", href: "#about" },
  { index: "03", label: "Résumé", href: RESUME_URL, external: true },
  { index: "04", label: "Contact", href: "#contact" },
] as const;

/** Her outcomes. `unit` carries the part of the figure that is words rather
 *  than numerals, so a long one sets smaller instead of wrecking the row. */
export const proof = [
  { figure: "1K → 10K", label: "Instagram growth since I joined the team" },
  {
    figure: "3",
    unit: "flagship conferences",
    label:
      "Visual direction, event branding, digital, print & on-ground design",
  },
  {
    figure: "10+",
    unit: "programs & campaigns",
    label:
      "Across community, learning, founder and innovation initiatives",
  },
  { figure: "500+", label: "Social and campaign assets designed" },
] as const;

export type Project = {
  index: string;
  title: string;
  client: string;
  discipline: string;
  year: string;
  blurb: string;
  set: string;
  slug: string;
  /** 12-column desktop grid. Spans are chosen so every row fills exactly. */
  span: 5 | 7 | 12;
  /** Tile aspect ratio, matched to the source so nothing is badly cropped. */
  ratio: string;
  /** Crop anchor for sources far taller than their tile. */
  anchor?: string;
  /** A system is shown as a system: several pieces, not one hero image. */
  gallery?: string[];
  href?: string;
};

export const projects: Project[] = [
  {
    index: "01",
    title: "The Power Shift",
    client: "Wetech",
    discipline: "Brand Identity · Event Branding · Digital Design",
    year: "2026",
    blurb:
      "Brand identity and event system for Wetech’s 2026 flagship conference.",
    set: "powershift26",
    slug: "ps26-founder-panel",
    span: 12,
    ratio: "16 / 9",
    href: "/work/power-shift",
  },
  {
    index: "02",
    title: "Wetech Impact Report",
    client: "Wetech",
    discipline: "Editorial Design · Information Design",
    year: "2025",
    blurb:
      "Turning a year of impact into a compelling 30-page report through data visualisation, storytelling and editorial design.",
    set: "reportwide",
    slug: "report-cover-wide",
    span: 12,
    ratio: "16 / 9",
    href: "/work/impact-report",
  },
  {
    index: "03",
    title: "Wetech Conferences",
    client: "Wetech",
    discipline: "Brand Identity · Event Branding · Digital Design",
    year: "2023–2024",
    blurb:
      "Event branding for Wetech’s 2023 and 2024 conferences, from the digital designs and the stage to the physical attendee experience.",
    set: "conference",
    slug: "conf24-main-stage",
    span: 12,
    ratio: "16 / 9",
    href: "/work/wetech-2023-2024",
  },
  {
    index: "04",
    title: "Wetech Website Redesign",
    client: "Wetech",
    discipline: "UI/UX Design · Art Direction",
    year: "2024",
    blurb:
      "Redesigning Wetech’s digital home to make its programmes, community and opportunities easier to discover.",
    set: "website",
    slug: "web-landing",
    span: 12,
    ratio: "16 / 9",
    anchor: "top",
    href: "/work/wetech-africa",
  },
];
export const about = {
  lead: "I’m a Brand Designer at Interswitch, where I work across brand communications, campaigns, digital design and events.",
  paragraphs: [
    "I have also led brand design at Wetech, where I’ve spent the last few years shaping the organisation’s visual identity and bringing its work to life across conferences, programs, campaigns and digital platforms.",
    "Working across both organisations has given me the opportunity to take on different kinds of briefs, collaborate with different teams and think about how design works across different touchpoints.",
    "I enjoy making complex things easier to understand, finding the right visual direction for an idea and seeing that idea come together in the real world.",
  ],
  expertise: [
    "Brand Design",
    "UI/UX Design",
    "Event Branding",
    "Campaign Design",
    "Digital Design",
  ],
  tools: ["Figma", "Adobe Illustrator", "Adobe Photoshop", "Canva"],
} as const;

export const experience = [
  {
    year: "2025—",
    role: "Brand Designer",
    org: "Interswitch",
    note: "Working across brand communications, campaigns, event collateral and workplace branding.",
  },
  {
    year: "2022—",
    role: "Lead Brand Designer",
    org: "Wetech",
    note: "Leading brand design across identity, digital platforms, campaigns and flagship events.",
  },
  {
    year: "2023",
    role: "Product Designer & Technical Writer",
    org: "FMDQ Group",
    note: "",
  },
] as const;

export const education = [
  {
    year: "2019",
    role: "BSc Computer Science",
    org: "University of Ilorin",
    note: "",
  },
  {
    year: "2022",
    role: "Google UX Design Certificate",
    org: "Coursera",
    note: "",
  },
  {
    year: "",
    role: "Additional learning",
    org: "HerTechTrail, Tech4Dev Women Techsters",
    note: "",
  },
] as const;

export const contactLinks = [
  {
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    note: "Fastest route",
  },
  {
    label: "LinkedIn",
    value: "in/adenikeadedokun",
    href: "https://www.linkedin.com/in/adenike-adedokun-8395b7229",
    note: "The formal one",
  },
  {
    label: "Behance",
    value: "Selected work",
    href: "https://www.behance.net/Adenike_Portfolio",
    note: "More of the archive",
  },
  { label: "Résumé", value: "Google Doc", href: RESUME_URL, note: "One page" },
] as const;
