export const RESUME_URL = 'https://drive.google.com/file/d/PLACEHOLDER_RESUME_ID/view';
export const EMAIL = 'islamiahadedokun@gmail.com';

export const site = {
  name: 'Adenike Adedokun',
  role: 'Brand designer',
  disciplines: ['Identity', 'Event worlds', 'Campaign at volume'],
  location: 'Lagos, Nigeria',
  timeZone: 'Africa/Lagos',
  domain: 'adenikeade.com',
} as const;

export const nav = [
  { index: '01', label: 'Work', href: '#work' },
  { index: '02', label: 'About', href: '#about' },
  { index: '03', label: 'Résumé', href: RESUME_URL, external: true },
  { index: '04', label: 'Contact', href: '#contact' },
] as const;

/** Her outcomes — deliberately separate from the organisation's figures. */
export const proof = [
  { figure: '1K→5K', label: 'Instagram growth driven at Wetech' },
  { figure: '+80%', label: 'Engagement lift over the same period' },
  { figure: '200+', label: 'Social assets designed and shipped' },
  { figure: '30pp', label: 'Annual report, designed end to end' },
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
    index: '01',
    title: 'The Power Shift',
    client: 'Wetech',
    discipline: 'Identity · Key visual · Event system',
    year: '2026',
    blurb:
      'Identity for the largest gathering of women in tech in Africa. Three key-visual routes explored before one was chosen — chrome, violet and lime against the same locked typographic system.',
    set: 'powershift',
    slug: 'power-shift-kv',
    span: 5,
    ratio: '4 / 5',
    href: '/work/power-shift',
  },
  {
    index: '02',
    title: 'Wetech Conference',
    client: 'Wetech',
    discipline: 'Environmental branding · Signage · Stage',
    year: '2023–2024',
    blurb:
      'An archway people walk through, a registration wall, a main stage, and a set of hand-held placards that turned two thousand attendees into the campaign.',
    set: 'conference',
    slug: 'conf24-welcome-archway',
    span: 7,
    ratio: '3 / 2',
    href: '/work/wetech-conference',
  },
  {
    index: '03',
    title: 'Impact Report 2025',
    client: 'Wetech',
    discipline: 'Editorial · Information design',
    year: '2025',
    blurb:
      'Thirty pages holding one system across a theory-of-change diagram, distribution charts, impact stories and a partner grid.',
    set: 'report',
    slug: 'report-cover',
    span: 5,
    ratio: '1 / 1.414',
    href: '/work/impact-report',
  },
  {
    index: '04',
    title: 'wetech.africa',
    client: 'Wetech',
    discipline: 'Website redesign · Art direction',
    year: '2024',
    blurb:
      'A full redesign of the site, restructuring content and hierarchy around what the organisation actually wanted people to do.',
    set: 'website',
    slug: 'web-landing',
    span: 7,
    ratio: '3 / 2',
    anchor: 'top',
    href: '/work/wetech-africa',
  },
  {
    index: '05',
    title: 'Making people read the thing nobody reads',
    client: 'Interswitch',
    discipline: 'Internal communications system',
    year: '2025–2026',
    blurb:
      'Compliance digests, a cybersecurity month, an innovation lab. One voice across a fintech’s internal comms — including a gift-declaration notice written in pidgin.',
    set: 'interswitch',
    slug: 'isw-cybersecurity-kv',
    span: 12,
    ratio: '4 / 5',
    gallery: ['isw-cybersecurity-kv', 'isw-demo-day-a', 'isw-digest-october'],
    href: '/work/interswitch',
  },
];

export const about = {
  lead: 'I design the things a brand actually meets people through.',
  paragraphs: [
    'I hold brand at two organisations at once — Interswitch, where the work is internal communications for a fintech, and Wetech, where I have led brand for three years across identity, web, events and campaign. The two could not look less alike, which is the point: a brand system is only worth anything if it survives contact with a real brief.',
    'Most of what I make gets used rather than presented. A thirty-page annual report. A conference two thousand women walk through. A compliance notice written in pidgin so that colleagues actually finish reading it. I am interested in the part after the logo — where a brand has to hold together across a stage backdrop, a data page and a WhatsApp-sized flyer on the same afternoon.',
  ],
  services: ['Brand identity', 'Event branding', 'Editorial & report design', 'Campaign systems', 'Art direction', 'Product & UX design'],
  tools: ['Figma', 'Illustrator', 'Photoshop', 'After Effects'],
} as const;

export const archive = [
  { year: '2025—', role: 'Brand Designer', org: 'Interswitch', note: 'Internal communications, event collateral, workplace branding' },
  { year: '2022—', role: 'Lead Brand Designer', org: 'Wetech', note: 'Identity, web, conference, campaign' },
  { year: '2023', role: 'Product Designer & Technical Writer', org: 'FMDQ Group', note: 'Four internal web applications, research to hi-fi' },
  { year: '2024', role: 'BSc Computer Science', org: 'University of Ilorin', note: '' },
  { year: '—', role: 'Google UX Design Certificate', org: 'Coursera', note: 'Also: HerTechTrail, Tech4Dev Women Techsters' },
] as const;

export const contactLinks = [
  { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, note: 'Fastest route' },
  { label: 'LinkedIn', value: 'in/adenikeadedokun', href: 'https://www.linkedin.com/in/adenike-adedokun', note: 'The formal one' },
  { label: 'Behance', value: 'Selected work', href: 'https://www.behance.net/adenikeadedokun', note: 'More of the archive' },
  { label: 'Résumé', value: 'PDF', href: RESUME_URL, note: 'One page' },
] as const;
