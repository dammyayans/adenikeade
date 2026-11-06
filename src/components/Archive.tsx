import { experience, education } from '../data/site';

type Row = { year: string; role: string; org: string; note: string };

function Rows({ rows }: { rows: readonly Row[] }) {
  return (
    <ul className="m-0 list-none p-0">
      {rows.map((row) => (
        <li
          key={`${row.year}-${row.role}`}
          className="grid grid-cols-[68px_1fr] items-baseline gap-x-5 gap-y-1 border-b border-current/18 py-3.5 last:border-0 desktop:grid-cols-[132px_1.1fr_0.9fr]"
        >
          <span className="label tabular-nums opacity-60">{row.year}</span>
          <span className="text-[15px] font-medium">
            {row.role}
            <span className="opacity-55"> — {row.org}</span>
          </span>
          {row.note && (
            <span className="col-span-2 text-[13.5px] leading-[1.4] opacity-60 desktop:col-span-1">
              {row.note}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function Archive() {
  return (
    <section data-ground="taupe" className="py-16 desktop:py-20">
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)]">
        <header className="mb-8 flex items-baseline justify-between gap-6 border-t border-current/30 pt-4">
          <h2 className="display m-0 text-[clamp(24px,3vw,36px)]">Experience</h2>
          <p className="label m-0 opacity-60">Roles · study · certification</p>
        </header>

        <Rows rows={experience} />

        <h3 className="display mt-14 mb-6 text-[clamp(19px,2.2vw,26px)]">
          Education &amp; certifications
        </h3>
        <Rows rows={education} />
      </div>
    </section>
  );
}
