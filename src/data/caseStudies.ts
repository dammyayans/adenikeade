import type { Ground } from "../hooks/useGround";

export type Block =
  | { kind: "text"; heading?: string; body: string[] }
  | {
      kind: "full";
      set: string;
      slug: string;
      caption: string;
      ratio?: string;
      anchor?: string;
      /** Makes the plate itself the link — a shipped site you can go and use. */
      href?: string;
    }
  | {
      kind: "grid";
      cols: 2 | 3;
      ratio: string;
      items: { set: string; slug: string; caption: string }[];
    }
  | {
      /** A film someone chooses to play, with sound. `poster` is a slug in the
       *  `film` set (src/media.film.json), `credit` names whoever shot it —
       *  event films are usually the client's, not hers. */
      kind: "film";
      slug: string;
      poster: string;
      caption: string;
      credit?: string;
      ratio?: string;
    }
  | { kind: "quote"; text: string; note?: string }
  | {
      kind: "facts";
      heading: string;
      items: { k: string; v: string }[];
      note?: string;
    };

export type Chapter = { ground: Ground; blocks: Block[] };

export type CaseStudy = {
  slug: string;
  index: string;
  title: string;
  client: string;
  year: string;
  proposition: string;
  meta: { k: string; v: string }[];
  lead: {
    set: string;
    slug: string;
    ratio: string;
    anchor?: string;
    /** Named only on a diptych, where the reader has to be told which is which. */
    label?: string;
    /** A second plate beside the first. For a case study that covers two editions
     *  a single lead has to pick a winner; a pair lets the same surface — a wall
     *  people stand at — be compared across both years, which is the argument. */
    second?: { set: string; slug: string; anchor?: string; label?: string };
  };
  chapters: Chapter[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "power-shift",
    index: "01",
    title: "The Power Shift",
    client: "Wetech",
    year: "2026",
    proposition:
      "Three routes to the identity for the largest gathering of women in tech in Africa — explored against one locked typographic system, so the decision was about temperature, not layout.",
    meta: [
      { k: "Client", v: "Wetech" },
      {
        k: "Role",
        v: "Brand designer — identity, key visual, event system, website UI/UX",
      },
      { k: "Year", v: "2026" },
      { k: "Event", v: "26 September 2026 · Landmark Event Centre, Lagos" },
    ],
    lead: { set: "powershift", slug: "power-shift-kv", ratio: "4 / 5" },
    chapters: [
      {
        ground: "butter",
        blocks: [
          {
            kind: "text",
            heading: "The brief changed, so the identity had to",
            body: [
              "The conference had run twice on a bright yellow-and-lime system built for energy — and it worked, twice, in a full room. The 2026 edition moved the subject to AI, capital and innovation, which meant the audience now included investors and institutional partners alongside the community that had always turned up.",
              "That is a harder brief than it sounds. The identity had to carry enough authority to sit beside a sponsor wall of Flutterwave, Microsoft and Interswitch, without losing the warmth that filled the room the first two times. Cold and credible is easy. Warm and credible is the actual problem.",
            ],
          },
        ],
      },
      {
        ground: "bone",
        blocks: [
          {
            kind: "text",
            heading: "Three routes, one system",
            body: [
              "Rather than show three different layouts, I locked the typographic system first — the same wordmark scale, the same stacked title, the same date-and-venue bar along the foot — and let the routes differ only in material and temperature. That way the conversation with stakeholders was about what the event should feel like, not about which composition they preferred.",
            ],
          },
          {
            kind: "grid",
            cols: 3,
            ratio: "4 / 5",
            items: [
              {
                set: "powershift",
                slug: "power-shift-route-chrome",
                caption:
                  "Route A — chrome. Iridescent and optimistic, the most forward-looking of the three.",
              },
              {
                set: "powershift",
                slug: "power-shift-route-violet",
                caption:
                  "Route B — violet. The deepest of the three, and the closest to the earlier editions.",
              },
              {
                set: "powershift",
                slug: "power-shift-route-lime",
                caption:
                  "Route C — lime on black. The boldest of the three, and the coldest.",
              },
            ],
          },
          {
            kind: "text",
            body: [
              "Holding the type still is what makes a set like this useful. Put side by side, the three read as one event considering its own tone — which is the argument you actually want a stakeholder to have.",
            ],
          },
        ],
      },
      {
        ground: "oxblood",
        blocks: [
          {
            kind: "quote",
            text: "Warm and credible is the actual problem. Cold and credible is easy.",
            note: "The note I kept coming back to while exploring routes.",
          },
        ],
      },
      {
        ground: "bone",
        blocks: [
          {
            kind: "text",
            heading: "Extending the system",
            body: [
              "Once the route was chosen the same material had to survive being cut down — speaker announcements, programme cards, and a sponsor lockup that has to hold six logos without the key visual collapsing behind them.",
            ],
          },
          {
            kind: "full",
            set: "powershift",
            slug: "power-shift-speaker-card",
            ratio: "4 / 5",
            caption:
              "Speaker announcement, cropped for social with the sponsor bar intact.",
          },
        ],
      },
      {
        ground: "butter",
        blocks: [
          {
            kind: "text",
            heading: "The identity on a screen",
            body: [
              "The same system carries the event site, where it stops being a picture of the conference and starts doing its work — selling a ticket, a sponsorship and a speaking slot to three audiences who want different things from one page.",
            ],
          },
          {
            kind: "full",
            set: "eventsite",
            slug: "event-site-hero",
            ratio: "3 / 2",
            anchor: "top",
            href: "https://event.wetech.africa/",
            caption: "event.wetech.africa — UI and UX design. Open the live site ↗",
          },
        ],
      },
      {
        ground: "taupe",
        blocks: [
          {
            kind: "facts",
            heading: "The event",
            items: [
              { k: "Date", v: "26 September 2026" },
              {
                k: "Venue",
                v: "Landmark Event Centre, Victoria Island, Lagos",
              },
              { k: "Expected", v: "2,500+ attendees" },
              {
                k: "Theme",
                v: "Women Leading the Future of AI, Capital & Innovation",
              },
            ],
            note: "Attendance figure is Wetech’s own projection, published in the 2025 Impact Report.",
          },
        ],
      },
    ],
  },

  {
    slug: "wetech-2023-2024",
    index: "02",
    title: "Wetech 2023/2024",
    client: "Wetech",
    year: "2023–2024",
    proposition:
      "Two editions of a conference you walk into — an archway, a registration wall, a main stage, and a set of placards that turned attendees into the campaign.",
    meta: [
      { k: "Client", v: "Wetech" },
      {
        k: "Role",
        v: "Lead brand designer — event branding, stage branding, digital branding",
      },
      { k: "Editions", v: "2023 and 2024" },
      { k: "Venue", v: "Lagos, Nigeria" },
    ],
    // Two editions, so two plates. Both are the same surface doing the same job —
    // a wall people stand in front of — which is what makes the year-on-year
    // change in the system legible rather than just decorative.
    lead: {
      set: "conference23",
      slug: "conf23-her-tech-backdrop",
      ratio: "3 / 2",
      label: "2023 — Her Tech, Her Rules",
      second: {
        set: "conference",
        slug: "conf24-welcome-archway",
        label: "2024 — the welcome archway",
      },
    },
    chapters: [
      {
        ground: "butter",
        blocks: [
          {
            kind: "text",
            heading: "Print that has to survive a room",
            body: [
              "Event branding is the least forgiving format a brand system meets. A key visual that reads beautifully at A4 has to also work at four metres wide, behind a moving crowd, half-obscured, photographed on a phone in mixed light. Nothing about it is decided at the desk.",
              "Across two editions the job was the same: make the venue legible before anyone reads a word, and give people something to photograph that carries the brand home with them.",
            ],
          },
        ],
      },
      {
        ground: "bone",
        blocks: [
          {
            kind: "text",
            heading: "2023 — establishing the room",
            body: [
              "The first edition set the vocabulary: a yellow field, a stacked lockup, and a stage that names the session rather than the sponsor. The printed Founders Wheel was the piece that surprised me — a game, physically built, that gave people a reason to stand still long enough to talk to each other.",
            ],
          },
          {
            kind: "grid",
            cols: 3,
            ratio: "3 / 2",
            items: [
              {
                set: "conference23",
                slug: "conf23-her-tech-backdrop",
                caption: "Her Tech, Her Rules — the photo backdrop.",
              },
              {
                set: "conference23",
                slug: "conf23-founders-wheel",
                caption:
                  "The Founders Wheel — a printed game, built to give people a reason to stop and talk.",
              },
              {
                set: "conference23",
                slug: "conf23-founders-stage",
                caption:
                  "The founders stage, with the session named above the panel.",
              },
            ],
          },
          {
            kind: "grid",
            cols: 3,
            ratio: "3 / 2",
            items: [
              {
                set: "conference23",
                slug: "conf23-main-banner",
                caption: "The main banner, with the room filling up.",
              },
              {
                set: "conference23",
                slug: "conf23-session-screens",
                caption:
                  "Session screens, carrying the same lockup on screen.",
              },
              {
                set: "conference23",
                slug: "conf23-lanyards",
                caption:
                  "Lanyards and medals — the smallest pieces in the system.",
              },
            ],
          },
        ],
      },
      {
        ground: "bone",
        blocks: [
          {
            kind: "text",
            heading: "2024 — building a route through the venue",
            body: [
              "The second edition treated the venue as a sequence rather than a set of surfaces. A lime welcome archway you physically pass under, then registration, then the main stage — each one a step, each one carrying the same lockup at a different scale so you always know where you are.",
            ],
          },
          {
            kind: "film",
            slug: "conf24-aftermovie",
            poster: "conf24-aftermovie-poster",
            caption:
              "A walk through the venue — the archway, the queue wrapping the building, registration, the lanyards, the doodle wall, and out onto the main stage.",
            credit: "Film: Wetech. Environmental branding and signage: Adenike Adedokun.",
          },
          {
            kind: "full",
            set: "conference",
            slug: "conf24-way-forward",
            ratio: "3 / 2",
            caption:
              "We Are The Way Forward & We Are Here — the main stage backdrop.",
          },
          {
            kind: "grid",
            cols: 3,
            ratio: "3 / 2",
            items: [
              {
                set: "conference",
                slug: "conf24-registration",
                caption: "The registration wall.",
              },
              {
                set: "conference",
                slug: "conf24-photo-panels",
                caption: "She Believed She Could / Explore — the photo panels.",
              },
              {
                set: "conference",
                slug: "conf24-sponsor-wall",
                caption: "The sponsor wall, holding eleven partner marks.",
              },
            ],
          },
        ],
      },
      {
        ground: "oxblood",
        blocks: [
          {
            kind: "quote",
            text: "The placards were the cheapest thing we printed and the furthest-travelling.",
            note: "Circular hand-held signs — She Builds She Leads She Inspires · I Am Fearless & Tech-Savvy · Redefining the Impossible · The Power of Community.",
          },
        ],
      },
      {
        ground: "bone",
        blocks: [
          {
            kind: "grid",
            cols: 2,
            ratio: "3 / 2",
            items: [
              {
                set: "conference",
                slug: "conf24-placards",
                caption:
                  "Attendees with the placards, on the way out.",
              },
              {
                set: "conference",
                slug: "conf24-main-stage",
                caption:
                  "Women Who Believe / Women Who Inspire — the panels either side of the stage.",
              },
            ],
          },
          {
            kind: "text",
            body: [
              "A placard costs almost nothing to produce and every one of them becomes a photograph on somebody’s feed the same evening. It is the highest-leverage piece in an event system and the one most often left off the budget.",
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "impact-report",
    index: "03",
    title: "Impact Report 2025",
    client: "Wetech",
    year: "2025",
    proposition:
      "Wetech’s year in thirty pages — the numbers a funder needs, and the stories those numbers came from.",
    meta: [
      { k: "Client", v: "Wetech" },
      { k: "Role", v: "Brand designer — editorial and information design" },
      { k: "Extent", v: "30 pages" },
      { k: "Year", v: "2025" },
    ],
    lead: { set: "report", slug: "report-cover", ratio: "1 / 1.414" },
    chapters: [
      {
        ground: "butter",
        blocks: [
          {
            kind: "text",
            heading: "Two readers, one document",
            body: [
              "An annual report is usually designed for the funder and then apologised for to everyone else. This one had to work for both: a partner skimming for reach and conversion figures, and a woman who had been through a programme and wanted to find her own year in it.",
              "The answer was to let the two reading modes have different pages rather than fight inside the same one. Dense, tabular, high-contrast pages for the data. Full-bleed photography and set quotes for the stories. One grid underneath so it never reads as two documents stapled together.",
            ],
          },
        ],
      },
      {
        ground: "bone",
        blocks: [
          {
            kind: "text",
            heading: "The system",
            body: [
              "A black field with lime and lavender as the only accents, and a typographic hierarchy tight enough to survive being read on a phone — which is how most of it is actually read.",
            ],
          },
          {
            kind: "grid",
            cols: 2,
            ratio: "1 / 1.414",
            items: [
              {
                set: "report",
                slug: "report-theory-of-change",
                caption:
                  "Theory of change, mapped across activities, outcomes and impact.",
              },
              {
                set: "report",
                slug: "report-reach-data",
                caption:
                  "Reach and footprint, broken down by age and years of experience.",
              },
            ],
          },
          {
            kind: "grid",
            cols: 2,
            ratio: "1 / 1.414",
            items: [
              {
                set: "report",
                slug: "report-impact-signals",
                caption:
                  "Impact signals — the densest page in the report, set as a three-column table.",
              },
              {
                set: "report",
                slug: "report-celebrateher",
                caption:
                  "The #CelebrateHer campaign page.",
              },
            ],
          },
        ],
      },
      {
        ground: "taupe",
        blocks: [
          {
            kind: "facts",
            heading: "What the report carries",
            items: [
              { k: "Women trained and mentored", v: "510" },
              { k: "Countries represented", v: "23" },
              { k: "Scholarships awarded", v: "500" },
              { k: "PitchHer funding awarded", v: "₦6M" },
              { k: "Follow-on investment secured", v: "$500K+" },
              { k: "Campaign reach", v: "290k+" },
            ],
            note: "These are Wetech’s results, not mine. I designed the report and the campaign system that communicated them.",
          },
        ],
      },
    ],
  },

  {
    slug: "wetech-africa",
    index: "04",
    title: "wetech.africa",
    client: "Wetech",
    year: "2024",
    proposition:
      "A full redesign of the site, restructured around one question the old homepage never answered: what should I do next?",
    meta: [
      { k: "Client", v: "Wetech" },
      {
        k: "Role",
        v: "Lead brand designer — art direction, UI, content structure",
      },
      { k: "Scope", v: "Landing, About, Programs, Media" },
      { k: "Year", v: "2024" },
    ],
    lead: {
      set: "website",
      slug: "web-landing",
      ratio: "3 / 2",
      anchor: "top",
    },
    chapters: [
      {
        ground: "butter",
        blocks: [
          {
            kind: "text",
            heading: "Restructuring before restyling",
            body: [
              "The old site described the organisation accurately and left the visitor with nothing to do. The redesign started by deciding what each page was for — join, understand, apply, verify — and only then by deciding what it looked like.",
              "The headline does the positioning in one line: Where Women In Tech Rise, Lead, & Thrive, with the last two clauses split into canary and violet so the sentence has a rhythm even before you read it. The ground is a pale lime-cream rather than white, which keeps the dark hero from feeling like a different site.",
            ],
          },
        ],
      },
      {
        ground: "bone",
        blocks: [
          {
            kind: "grid",
            cols: 3,
            ratio: "3 / 4",
            items: [
              {
                set: "website",
                slug: "web-about",
                caption: "About — the team and the case for the organisation.",
              },
              {
                set: "website",
                slug: "web-programs",
                caption: "Programs — every way in, ordered by commitment.",
              },
              {
                set: "website",
                slug: "web-media",
                caption: "Media — press and coverage, and where journalists start.",
              },
            ],
          },
          {
            kind: "text",
            body: [
              "Partner marks — Flutterwave, Microsoft, Interswitch — sit immediately under the fold rather than in a footer, because for this audience the proof is the reason to keep scrolling.",
            ],
          },
        ],
      },
      {
        ground: "bone",
        blocks: [
          {
            kind: "text",
            heading: "The system beyond the site",
            body: [
              "The site is the hub, but most people meet the brand on a phone in a feed. These are the campaign surfaces built from the same system — programme calls, editorial cards, community formats — which is where the two hundred-odd assets and the growth from one thousand to nine thousand followers actually came from.",
            ],
          },
          {
            kind: "grid",
            cols: 3,
            ratio: "4 / 5",
            items: [
              {
                set: "campaign",
                slug: "wt-mentees",
                caption: "Mentorship Program — call for mentees.",
              },
              {
                set: "campaign",
                slug: "wt-mentors",
                caption:
                  "Mentorship Program — call for mentors, the same layout inverted.",
              },
              {
                set: "campaign",
                slug: "wt-townhall",
                caption: "Community townhall.",
              },
            ],
          },
          {
            kind: "grid",
            cols: 3,
            ratio: "4 / 5",
            items: [
              {
                set: "campaign",
                slug: "wt-editorial-power",
                caption:
                  "Power Doesn’t Sound Like It Used To — a community writer editorial.",
              },
              {
                set: "campaign",
                slug: "wt-editorial-motherhood",
                caption:
                  "Motherhood Is Not a Pause Button — the same format again.",
              },
              {
                set: "campaign",
                slug: "wt-editorial-ecosystem",
                caption: "The Tech Ecosystem Is Evolving Rapidly.",
              },
            ],
          },
          {
            kind: "text",
            body: [
              "The editorial cards are one template with three variables — a black-and-white portrait, a two-line claim, and a byline. Consistency at that scale is not a style decision, it is what makes a hundred posts read as one publication.",
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "interswitch",
    index: "05",
    title: "Making people read the thing nobody reads",
    client: "Interswitch",
    year: "2025–2026",
    proposition:
      "Internal communications for a fintech — compliance digests, a cybersecurity month, an innovation lab — held to one voice across two very different registers.",
    meta: [
      { k: "Client", v: "Interswitch" },
      { k: "Role", v: "Brand designer — internal communications" },
      {
        k: "Surfaces",
        v: "Digests, key visuals, digital screens, print, workplace",
      },
      { k: "Year", v: "2025–2026" },
    ],
    lead: { set: "interswitch", slug: "isw-cybersecurity-kv", ratio: "4 / 5" },
    chapters: [
      {
        ground: "butter",
        blocks: [
          {
            kind: "text",
            heading: "The audience cannot leave, which makes it harder",
            body: [
              "Internal communications has a captive audience and no attention. Nobody unsubscribes from a compliance digest; they just do not open it. The measure of the work is not reach, it is whether a colleague reaches the end of the page.",
              "Across a year of it the system settled into two registers. Security and product work runs dark, technical and high-contrast. Compliance and policy work runs illustrated and conversational, because the content is already forbidding and the design should not add to it.",
            ],
          },
        ],
      },
      {
        ground: "bone",
        blocks: [
          {
            kind: "text",
            heading: "Register one — dark and technical",
            body: [
              "Cybersecurity Month, the innovation lab, and product demo days. Neon on near-black, isometric and dimensional, closer to a product launch than an internal memo — which is the point, because these are the pieces competing with actual product marketing for the same fifteen seconds.",
            ],
          },
          {
            kind: "grid",
            cols: 3,
            ratio: "4 / 5",
            items: [
              {
                set: "interswitch",
                slug: "isw-cybersecurity-kv",
                caption: "Cybersecurity Month 2025 — Secure Our World.",
              },
              {
                set: "interswitch",
                slug: "isw-demo-day-a",
                caption: "Product Demo Day — route A.",
              },
              {
                set: "interswitch",
                slug: "isw-demo-day-b",
                caption:
                  "Product Demo Day — route B, same week, a different mood.",
              },
            ],
          },
          {
            kind: "grid",
            cols: 3,
            ratio: "4 / 5",
            items: [
              {
                set: "interswitch",
                slug: "isw-labs-enter",
                caption:
                  "Enter our Interswitch Labs and test the future early.",
              },
              {
                set: "interswitch",
                slug: "isw-labs-welcome",
                caption: "Welcome to Interswitch Labs.",
              },
              {
                set: "interswitch",
                slug: "isw-ember-season",
                caption:
                  "Staying Vigilant This Ember Season — fraud awareness for the festive run-in.",
              },
            ],
          },
        ],
      },
      {
        ground: "oxblood",
        blocks: [
          {
            kind: "quote",
            text: "Nobody unsubscribes from a compliance digest. They just don’t open it.",
            note: "Which makes finishing the page the only metric worth designing for.",
          },
        ],
      },
      {
        ground: "bone",
        blocks: [
          {
            kind: "text",
            heading: "Register two — illustrated and conversational",
            body: [
              "The December gift-declaration digest is the piece I would defend hardest. It is a regulatory notice about accepting corporate gifts, and it is written as a two-character comic in Nigerian pidgin — “Omo, December is about to be Detty.” A policy document nobody would have finished became one people quoted back.",
              "The October edition takes the same permission in a different direction: four compliance myths, each answered, each given its own illustrated panel, on a light blue field chosen specifically because it looks nothing like a policy PDF.",
            ],
          },
          {
            kind: "grid",
            cols: 2,
            ratio: "1 / 1.6",
            items: [
              {
                set: "interswitch",
                slug: "isw-digest-december",
                caption:
                  "Compliance Digest, December — gift declaration, written in pidgin.",
              },
              {
                set: "interswitch",
                slug: "isw-digest-october",
                caption:
                  "Compliance Digest, October — debunking compliance myths.",
              },
            ],
          },
          {
            kind: "full",
            set: "interswitch",
            slug: "isw-teamwork",
            ratio: "1 / 1.25",
            caption:
              "Teamwork Makes the Mission Secure — reporting risk framed as a shared job, not a rule.",
          },
        ],
      },
    ],
  },
];

export const getCaseStudy = (slug: string) =>
  caseStudies.find((c) => c.slug === slug);
export const nextCaseStudy = (slug: string) => {
  const i = caseStudies.findIndex((c) => c.slug === slug);
  return caseStudies[(i + 1) % caseStudies.length];
};
