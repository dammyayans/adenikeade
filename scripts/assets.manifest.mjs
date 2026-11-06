// Curated selection from the 100-file archive. Reviewed via scratch/contact sheets.
// `w` = the widest the image is ever rendered; derivatives are capped there.
export const ROOT = 'raw/Adenike Adedokun - Brand Design';

export const SETS = {
  // 01 — THE POWER SHIFT · Wetech Conference 2026 · lead case study
  powershift: {
    dir: 'Flyers',
    w: 1400,
    files: [
      ['Frame 2019.png',   'power-shift-kv'],
      ['Power Shift 1.png','power-shift-route-chrome'],
      ['Power Shift 2.png','power-shift-route-violet'],
      ['Power Shift 3.png','power-shift-route-lime'],
      ['Frame 1946.png',   'power-shift-speaker-card'],
    ],
  },

  // 01c — The Power Shift, 26 September 2026 · the event itself
  powershift26: {
    dir: 'Event Branding/Power Shift 2026',
    w: 1800,
    files: [
      ['DSC_7802.jpg', 'ps26-hall'],
      ['BODU7164.jpg', 'ps26-main-stage'],
      ['DSC_7820.jpg', 'ps26-founder-panel'],
      ['DSC_7296.jpg', 'ps26-community-spotlight'],
      ['BODU6793.jpg', 'ps26-find-your-word'],
      ['DSC_7027.jpg', 'ps26-wall-shaping'],
      ['DSC_7032.jpg', 'ps26-wall-building'],
      ['DSC_7175.jpg', 'ps26-career-studio'],
      ['BODU7449.jpg', 'ps26-welcome-screen'],
      ['DSC_7417.jpg', 'ps26-crew-tees'],
    ],
  },

  // 01b — event.wetech.africa · the live event site she designed
  eventsite: {
    dir: 'Event Website',
    w: 1600,
    files: [['01 Hero.png', 'event-site-hero']],
  },

  // 02 — Wetech Conference 2024 · environmental branding
  conference: {
    dir: 'Event Branding/Wetech Conference 2024',
    w: 1800,
    files: [
      ['BODU5644.jpg', 'conf24-welcome-archway'],
      ['BODU5179.jpg', 'conf24-registration'],
      ['BODU5682.jpg', 'conf24-stage-backdrop'],
      ['BODU5706.jpg', 'conf24-way-forward'],
      ['BODU5691.jpg', 'conf24-photo-panels'],
      ['BODU5058.jpg', 'conf24-placards'],
      ['BODU5098.jpg', 'conf24-sponsor-wall'],
      ['DSC_1449.jpg', 'conf24-panel-session'],
      ['DSC_1408.jpg', 'conf24-main-stage'],
    ],
  },

  // 02b — Wetech Conference 2023 · the previous edition
  conference23: {
    dir: 'Event Branding/Wetech Conference 2023',
    w: 1800,
    files: [
      ['Wetech 34.jpg',  'conf23-her-tech-backdrop'],
      ['Wetech 21.jpg',  'conf23-founders-wheel'],
      ['Wetech 20.jpg',  'conf23-lanyards'],
      ['Wetech 169.jpg', 'conf23-founders-stage'],
      ['Wetech 183.jpg', 'conf23-main-banner'],
      ['Wetech 216.jpg', 'conf23-session-screens'],
    ],
  },

  // 02b — Impact Report · the landscape cover used on the work card. The rest of
  // the report set is rendered from the PDF by build-pdf.mjs.
  reportwide: {
    dir: 'Presentation Decks & Reports',
    w: 1600,
    files: [['Impact Report Cover Wide.webp', 'report-cover-wide']],
  },

  // 03 — wetech.africa redesign
  website: {
    dir: 'Website Design',
    w: 1400,
    files: [
      ['Landing Page.png', 'web-landing'],
      ['About.png',        'web-about'],
      ['Programs.png',     'web-programs'],
      ['Media.png',        'web-media'],
    ],
  },

  // 05 — Wetech campaign & editorial system
  campaign: {
    dir: 'Flyers',
    w: 1200,
    files: [
      ['CW 1.png',              'wt-editorial-ecosystem'],
      ['MA 1.png',              'wt-editorial-motherhood'],
      ['Community writer.png',  'wt-editorial-power'],
      ['Call for Mentees.png',  'wt-mentees'],
      ['Call for Mentors.png',  'wt-mentors'],
      ['PitchHer2.jpg',         'wt-pitchher'],
      ['BHM 2026.png',          'wt-bhm'],
      ['WCW.png',               'wt-wcw'],
      ['TH 2.png',              'wt-townhall'],
      ['Success Design 2.png',  'wt-storytelling'],
    ],
  },
};
