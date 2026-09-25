import { useReveal } from '../hooks/useReveal';

export function Statement() {
  const { ref, shown } = useReveal<HTMLDivElement>(0.3);

  return (
    <section data-ground="oxblood" className="py-20 desktop:py-32">
      <div
        ref={ref}
        className={`mx-auto max-w-[var(--container)] px-[var(--gutter)] ${shown ? 'reveal-in' : 'reveal-out'}`}
      >
        <p className="label m-0 mb-7 opacity-60">The part after the logo</p>
        <p className="display m-0 max-w-[19ch] text-[clamp(34px,6.4vw,88px)]">
          Most of what I make gets used, not presented<span className="text-[var(--color-rose)]">.</span>
        </p>
        <p className="mt-8 mb-0 max-w-[54ch] text-[clamp(16px,1.7vw,19px)] leading-[1.5] opacity-75">
          A thirty-page report. A conference two thousand women walk through. A
          compliance notice written in pidgin so colleagues actually finish reading it.
        </p>
      </div>
    </section>
  );
}
