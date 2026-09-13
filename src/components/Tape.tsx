/** Two crochet-coloured bands crossing, each running its words the other way.
 *  It gives the film the runway it needs before Selected Work, and it says what she
 *  does while the reader is still looking at her.
 *
 *  Sits at z-20 — the bands cross in FRONT of the pinned film, which is what makes
 *  her read as being on the page rather than pasted over it. */
const WORDS = [
  'Brand identity',
  'Event worlds',
  'Campaign at volume',
  'Art direction',
  'Report systems',
  'Multidisciplinary',
];

function Track({ reverse }: { reverse?: boolean }) {
  // The list is laid down twice so the -50% loop meets its own start exactly.
  // The second copy is decoration for anyone reading with their ears.
  return (
    <div className={`tape-track ${reverse ? 'tape-track--reverse' : ''}`}>
      {[false, true].map((dupe) => (
        <ul key={String(dupe)} className="m-0 flex list-none p-0" aria-hidden={dupe || undefined}>
          {WORDS.map((w) => (
            <li key={w} className="flex shrink-0 items-center whitespace-nowrap">
              <span className="px-[0.45em]">{w}</span>
              <span className="opacity-45" aria-hidden="true">//</span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export function Tape() {
  return (
    <section
      id="disciplines"
      data-ground="taupe"
      className="relative z-20 overflow-hidden py-20 desktop:py-28"
      aria-label="Disciplines"
    >
      {/* The bands are wider than the viewport so their rotated ends never show. */}
      <div className="relative h-[190px] desktop:h-[260px]">
        <div className="absolute inset-x-[-10%] top-[4%] -rotate-[6deg] bg-[var(--color-oxblood)] py-3.5 text-[var(--color-paper)] shadow-[0_10px_30px_rgba(42,10,18,0.14)] desktop:py-5">
          <div className="display text-[clamp(20px,3.4vw,40px)] uppercase tracking-[-0.01em]">
            <Track />
          </div>
        </div>

        <div className="absolute inset-x-[-10%] top-[46%] rotate-[4deg] bg-[var(--color-rose)] py-3.5 text-[var(--color-oxblood)] shadow-[0_10px_30px_rgba(42,10,18,0.12)] desktop:py-5">
          <div className="display text-[clamp(20px,3.4vw,40px)] uppercase tracking-[-0.01em]">
            <Track reverse />
          </div>
        </div>
      </div>
    </section>
  );
}
