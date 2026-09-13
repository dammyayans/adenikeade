import { site, EMAIL } from '../data/site';

/** The hero copy only. The film is not in here — it lives in HeroStage, in a layer
 *  above this one, so she stands in front of the name until the scroll carries her
 *  off to the right and uncovers it. Everything here sits at z-0 for that reason. */
export function Hero() {
  return (
    // On a phone there is no room to put copy behind her and still read it, so the
    // copy packs to the top and she stands in what is left below it — HeroFilm
    // scales her to fit under #hero-copy-end. From md up she is tall enough to sit
    // in front of the name, as intended, and the copy spreads to fill the screen.
    <section
      id="top"
      data-ground="bone"
      className="relative z-0 flex min-h-svh flex-col justify-start gap-8 pt-24 pb-10 md:justify-between md:pt-20 desktop:pb-14"
    >
      <div className="mx-auto flex w-full max-w-[var(--container)] flex-wrap items-start justify-between gap-4 px-[var(--gutter)]">
        <p className="label enter m-0 opacity-70" style={{ '--d': '0.3s' } as React.CSSProperties}>
          Portfolio — {site.location} · {new Date().getFullYear()}
        </p>
        <span
          className="label enter inline-flex items-center gap-2 rounded-full border border-current/25 px-3.5 py-2"
          style={{ '--d': '0.68s' } as React.CSSProperties}
        >
          <span className="dot" aria-hidden="true" />
          Available for work
        </span>
      </div>

      {/* Sits low enough that her head clears the first line — the name crosses her
          shoulders rather than her face. */}
      <div className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] desktop:pb-[6svh]">
        <h1
          className="display enter m-0 text-[clamp(52px,13vw,172px)] desktop:text-center"
          style={{ '--d': '0.45s' } as React.CSSProperties}
        >
          Adenike
          <br />
          Adedokun<span className="text-[var(--color-pink)]">.</span>
        </h1>
      </div>

      {/* Flanks her: she stands in the middle, these sit either side of her. */}
      <div
        id="hero-copy-end"
        className="mx-auto flex w-full max-w-[var(--container)] flex-col gap-6 px-[var(--gutter)] desktop:flex-row desktop:items-end desktop:justify-between"
      >
        <p
          className="enter m-0 max-w-[22ch] text-[clamp(15px,1.5vw,18px)] leading-[1.45] opacity-75"
          style={{ '--d': '0.6s' } as React.CSSProperties}
        >
          {site.role} · {site.disciplines.join(' · ')}
        </p>

        <div
          className="enter flex flex-wrap items-center gap-3"
          style={{ '--d': '0.72s' } as React.CSSProperties}
        >
          <a href="#work" className="btn label no-underline">See the work</a>
          <a href={`mailto:${EMAIL}`} className="btn label no-underline">Start a project</a>
        </div>
      </div>
    </section>
  );
}
