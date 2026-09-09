import { site, EMAIL } from '../data/site';
import { HeroFilm } from './HeroFilm';

export function Hero() {
  return (
    <section id="top" data-ground="bone" className="relative pt-24 pb-16 md:pt-20 desktop:pb-24">
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)]">
        {/* Mobile puts the film second; desktop sets it beside the name. */}
        <div className="grid items-end gap-8 desktop:grid-cols-[1.55fr_1fr] desktop:gap-[60px]">
          <div className="order-1">
            <p className="label enter m-0 mb-5 opacity-70" style={{ '--d': '0.3s' } as React.CSSProperties}>
              Portfolio — {site.location} · {new Date().getFullYear()}
            </p>

            <h1
              className="display enter m-0 text-[clamp(52px,12.5vw,148px)]"
              style={{ '--d': '0.45s' } as React.CSSProperties}
            >
              Adenike
              <br />
              Adedokun<span className="text-[var(--color-pink)]">.</span>
            </h1>

            <p
              className="enter mt-6 mb-0 max-w-[46ch] text-[clamp(17px,2vw,21px)] leading-[1.45] opacity-75"
              style={{ '--d': '0.6s' } as React.CSSProperties}
            >
              {site.role} · {site.disciplines.join(' · ')}
            </p>

            <div
              className="enter mt-9 flex flex-wrap items-center gap-3"
              style={{ '--d': '0.68s' } as React.CSSProperties}
            >
              <span className="label inline-flex items-center gap-2 rounded-full border border-current/25 px-3.5 py-2">
                <span className="dot" aria-hidden="true" />
                Available for work
              </span>
              <a href="#work" className="btn label no-underline">See the work</a>
              <a href={`mailto:${EMAIL}`} className="btn label no-underline">Start a project</a>
            </div>
          </div>

          <div className="enter order-2" style={{ '--d': '0.5s' } as React.CSSProperties}>
            <HeroFilm />
          </div>
        </div>
      </div>
    </section>
  );
}
