import { proof } from '../data/site';
import { useReveal } from '../hooks/useReveal';

export function Proof() {
  const { ref, shown } = useReveal<HTMLDivElement>(0.3);

  return (
    <section data-ground="butter" className="relative z-20 py-14 desktop:py-20">
      {/* The hero film passes behind this section, and figures set in ink over a
          crochet cardigan are unreadable. This is a sheet of the section's own
          ground at 78% — invisible against the page, but it frosts her back far
          enough for the numbers to hold. It tracks --ground, so the crossfade on
          scroll still works. Same device as the reference site's project card
          sliding over the portrait. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'color-mix(in srgb, var(--ground) 78%, transparent)' }}
      />
      <div ref={ref} className="relative mx-auto max-w-[var(--container)] px-[var(--gutter)]">
        <p className="label m-0 mb-8 opacity-60">What I moved</p>
        <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-9 desktop:grid-cols-4">
          {proof.map((p, i) => (
            <div
              key={p.figure}
              className={shown ? 'reveal-in' : 'reveal-out'}
              style={{ '--d': `${i * 0.08}s` } as React.CSSProperties}
            >
              <dt className="display m-0 text-[clamp(34px,5.5vw,64px)] tabular-nums">{p.figure}</dt>
              <dd className="m-0 mt-2.5 max-w-[22ch] text-[14px] leading-[1.4] opacity-70">{p.label}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 mb-0 max-w-[62ch] border-l-2 border-[var(--color-oxblood)] pl-4 text-[14px] leading-[1.5] opacity-70">
          Wetech’s own results — ₦6M awarded to women founders, 500 scholarships across
          22 countries — belong to Wetech. I designed the report and campaign system that
          carried them.
        </p>
      </div>
    </section>
  );
}
