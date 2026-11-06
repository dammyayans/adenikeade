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
      /** A way out to the real thing — the published document, the live site.
       *  Deliberately typographic: a plate here would only be a picture of a
       *  link, and the pages themselves are already shown above. */
      kind: "link";
      href: string;
      /** Small line above, naming what is being linked. */
      label: string;
      /** The line that is clicked. */
      title: string;
      /** Pill to the right — extent, format, host. */
      note?: string;
    }
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
      "A visual identity for Wetech’s 2026 flagship conference, bringing together women shaping the future of technology, AI and innovation.",
    meta: [
      { k: "Client", v: "Wetech" },
      {
        k: "Role",
        v: "Brand designer — identity, key visual, event system, website UI/UX",
      },
      { k: "Year", v: "2026" },
      { k: "Event", v: "26 September 2026 · Landmark Event Centre, Lagos" },
    ],
    lead: { set: "powershift26", slug: "ps26-founder-panel", ratio: "3 / 2" },
    chapters: [
      {
        ground: "butter",
        blocks: [
          {
            kind: "text",
            heading: "The brief",
            body: [
              "We wanted an identity that felt futuristic, reflecting the possibilities of AI, capital and innovation, while still holding on to the warmth and sense of community that Wetech is known for.",
              "The visual direction brought these two ideas together, creating an identity that felt bold, forward-looking and full of energy, without losing the human side of the conference.",
            ],
          },
        ],
      },
      {
        ground: "bone",
        blocks: [
          {
            kind: "text",
            heading: "Across digital touchpoints",
            body: [
              "With the visual direction established, I extended the identity across the conference’s digital touchpoints, designing the screens that carried the event through the day: the main visual, speaker panels, the holding screen and the session timer.",
            ],
          },
          {
            kind: "full",
            set: "powershift",
            slug: "power-shift-screen-main",
            ratio: "16 / 9",
            caption: "The main screen, with the wordmark set among photographs of attendees.",
          },
          {
            kind: "full",
            set: "powershift",
            slug: "power-shift-screen-panel",
            ratio: "40 / 13",
            caption: "Panel screen — Breaking Into AI & Emerging Technologies.",
          },
          {
            kind: "full",
            set: "powershift",
            slug: "power-shift-screen-interview",
            ratio: "40 / 13",
            caption: "Afternoon block screen — the voices on the interview stage.",
          },
          {
            kind: "grid",
            cols: 2,
            ratio: "40 / 13",
            items: [
              {
                set: "powershift",
                slug: "power-shift-screen-holding",
                caption: "Holding screen.",
              },
              {
                set: "powershift",
                slug: "power-shift-screen-timer",
                caption: "Countdown timer — main stage resumes in 00:60.",
              },
            ],
          },
        ],
      },
      {
        ground: "butter",
        blocks: [
          {
            kind: "text",
            heading: "Extending the experience online",
            body: [
              "I also designed the conference website, creating a digital experience that brought together event information, registration and partnership opportunities.",
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
        ground: "bone",
        blocks: [
          {
            kind: "text",
            heading: "The identity in the room",
            body: [
              "On 26 September the system came off the screen and into the venue — a main stage, a community stage, photo walls, a career studio and an exhibition floor, all carrying the same visual direction.",
            ],
          },
          {
            kind: "grid",
            cols: 3,
            ratio: "3 / 2",
            items: [
              {
                set: "powershift26",
                slug: "ps26-main-stage",
                caption: "The main stage — Welcome to The Power Shift.",
              },
              {
                set: "powershift26",
                slug: "ps26-community-spotlight",
                caption:
                  "Wetech Community Spotlight — real stories of growth, impact and leadership in tech.",
              },
              {
                set: "powershift26",
                slug: "ps26-hall",
                caption: "The main hall, with the exhibition floor behind.",
              },
            ],
          },
          {
            kind: "grid",
            cols: 3,
            ratio: "2 / 3",
            items: [
              {
                set: "powershift26",
                slug: "ps26-find-your-word",
                caption: "Find Your Word — a word search built into the venue.",
              },
              {
                set: "powershift26",
                slug: "ps26-wall-shaping",
                caption: "Women Shaping What Comes Next.",
              },
              {
                set: "powershift26",
                slug: "ps26-wall-building",
                caption: "Women Building Tech That Matters.",
              },
            ],
          },
          {
            kind: "grid",
            cols: 3,
            ratio: "3 / 2",
            items: [
              {
                set: "powershift26",
                slug: "ps26-career-studio-booth",
                caption: "The Wetech Career Studio.",
              },
              {
                set: "powershift26",
                slug: "ps26-welcome-screen",
                caption: "Attendees in front of the welcome screen.",
              },
              {
                set: "powershift26",
                slug: "ps26-crew-tees",
                caption: "The Power Shift tees, on the exhibition floor.",
              },
            ],
          },
          {
            kind: "film",
            slug: "ps26-recap",
            poster: "ps26-recap-poster",
            caption:
              "The day in a minute and a half — arrivals, the full hall, the exhibition floor, the PitchHer final, the word wall, and The Power Shift sign outside.",
            credit: "Film: Wetech. Identity and event branding: Adenike Adedokun.",
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
              { k: "Projected attendance", v: "2,500+" },
              {
                k: "Theme",
                v: "Women Leading the Future of AI, Capital & Innovation",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "impact-report",
    index: "02",
    title: "Wetech 2025 Impact Report",
    client: "Wetech",
    year: "2025",
    proposition:
      "A 30-page impact report designed to turn programme results, data and community stories into a clear, engaging publication.",
    meta: [
      { k: "Client", v: "Wetech" },
      { k: "Role", v: "Brand designer — editorial and information design" },
      { k: "Extent", v: "30 pages" },
      { k: "Year", v: "2025" },
    ],
    lead: { set: "reportwide", slug: "report-cover-wide", ratio: "16 / 9" },
    chapters: [
      {
        ground: "butter",
        blocks: [
          {
            kind: "text",
            heading: "Making the numbers meaningful",
            body: [
              "The report needed to communicate Wetech’s impact to partners, funders and community members. My challenge was to make detailed information easy to navigate without losing the stories behind the numbers.",
            ],
          },
        ],
      },
      {
        ground: "bone",
        blocks: [
          {
            kind: "text",
            heading: "A clear visual system",
            body: [
              "I created a consistent editorial layout using bold typography, data visualisations, photography and a focused colour palette.",
              "The result brings together programme outcomes, impact stories and organisational milestones in one cohesive report.",
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
        ground: "butter",
        blocks: [
          {
            kind: "link",
            href: "https://docsend.com/view/cxrftf6uquc8p5eu",
            label: "The document itself",
            title: "Read the 2025 Impact Report",
            note: "30 pages · DocSend",
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
    slug: "wetech-2023-2024",
    index: "03",
    title: "Wetech Conferences",
    client: "Wetech",
    year: "2023–2024",
    proposition:
      "Bringing Wetech’s annual conferences to life through event branding, environmental graphics and cohesive visual experiences.",
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
            heading: "Beyond the screen",
            body: [
              "Designing for a live event means thinking beyond individual graphics. Every element, from the entrance to the main stage, needs to work together to create a recognisable experience.",
            ],
          },
        ],
      },
      {
        ground: "bone",
        blocks: [
          {
            kind: "text",
            heading: "2023 edition",
            body: [
              "Key visual, promotional designs, merch designs, stage presentation designs and event branding.",
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
            heading: "2024 edition",
            body: [
              "Key visual, promotional designs, merch designs, stage presentation designs and event branding.",
            ],
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
            kind: "film",
            slug: "conf24-aftermovie",
            poster: "conf24-aftermovie-poster",
            caption:
              "A walk through the venue — the archway, the queue wrapping the building, registration, the lanyards, the doodle wall, and out onto the main stage.",
            credit: "Film: Wetech. Environmental branding and signage: Adenike Adedokun.",
          },
        ],
      },
    ],
  },

  {
    slug: "wetech-africa",
    index: "04",
    title: "Wetech Website Redesign",
    client: "Wetech",
    year: "2024",
    proposition:
      "A refreshed digital experience designed to make Wetech’s programmes, community and impact easier to explore.",
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
            heading: "Making navigation simpler",
            body: [
              "I reworked the site’s content structure and visual hierarchy to help visitors find relevant programmes, learn about Wetech and take action more easily.",
              "The redesign introduced clearer typography, consistent page layouts and a refreshed visual direction across the homepage, About, Programmes and Media pages.",
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
            kind: "link",
            href: "https://wetech.africa/",
            label: "The site itself",
            title: "Visit the website",
            note: "wetech.africa",
          },
        ],
      },
      {
        ground: "bone",
        blocks: [
          {
            kind: "text",
            heading: "Beyond the website",
            body: [
              "Alongside the website, I developed campaign templates and social media graphics that kept Wetech’s visual identity consistent across its digital channels.",
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
            kind: "link",
            href: "https://www.instagram.com/wetechofficial",
            label: "The feed itself",
            title: "See Wetech on Instagram",
            note: "@wetechofficial",
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
