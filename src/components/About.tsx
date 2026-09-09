import { about } from '../data/site';
import { useReveal } from '../hooks/useReveal';

export function About() {
  const { ref, shown } = useReveal<HTMLDivElement>(0.2);

  return (
    <section id="about" data-ground="bone" className="scroll-mt-20 py-16 desktop:py-24">
      <div ref={ref} className={`mx-auto max-w-[var(--container)] px-[var(--gutter)] ${shown ? 'reveal-in' : 'reveal-out'}`}>
        <header className="mb-10 border-t border-current/25 pt-4">
          <h2 className="display m-0 text-[clamp(30px,4.2vw,52px)]">About</h2>
        </header>

        <div className="grid gap-10 desktop:grid-cols-[1.6fr_1fr] desktop:gap-16">
          <div>
            <p className="m-0 mb-7 max-w-[24ch] font-display text-[clamp(24px,3.2vw,38px)] font-bold leading-[1.08] tracking-[-0.035em]">
              {about.lead}
            </p>
            {about.paragraphs.map((para) => (
              <p key={para.slice(0, 24)} className="mb-4 max-w-[64ch] text-[16px] leading-[1.6] opacity-75 last:mb-0">
                {para}
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <p className="label m-0 mb-3.5 opacity-55">Services</p>
              <ul className="m-0 list-none p-0">
                {about.services.map((s) => (
                  <li key={s} className="border-b border-current/12 py-2.5 text-[15px] last:border-0">{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label m-0 mb-3.5 opacity-55">Tools</p>
              <p className="m-0 text-[15px] opacity-70">{about.tools.join(' · ')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
