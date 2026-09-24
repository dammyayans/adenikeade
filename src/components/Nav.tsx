import { Link, useLocation } from 'react-router-dom';
import { nav, site } from '../data/site';
import { useClock } from '../hooks/useClock';
import { GrannySquare } from './GrannySquare';

export function Nav() {
  const time = useClock();
  const { pathname } = useLocation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-normal">
      <div className="mx-auto flex max-w-[var(--container)] items-center justify-between gap-4 px-[var(--gutter)] py-4">
        {/* Home from anywhere: a route change on a case study, a jump to the top
            when the home page is already under it. */}
        <Link
          to="/"
          onClick={() => {
            if (pathname === '/') window.scrollTo(0, 0);
          }}
          className="flex items-center gap-2.5 py-3 -my-3 no-underline"
          aria-label={`${site.name} — home`}
        >
          <GrannySquare size={20} />
          <span className="hidden font-display text-[15px] font-bold tracking-[-0.03em] md:inline">
            {site.name}
            <sup className="ml-0.5 text-[8px] text-[var(--color-pink)]">®</sup>
          </span>
        </Link>

        <nav aria-label="Primary">
          <ul className="flex list-none items-center gap-4 p-0 md:gap-6 desktop:gap-6">
            {nav.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  {...(('external' in item && item.external)
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="label group inline-flex items-baseline gap-1.5 py-3.5 -my-3.5 no-underline opacity-80 transition-opacity duration-[var(--dur-fast)] hover:opacity-100"
                >
                  <span className="text-[9px] text-[var(--color-pink)]">{item.index}</span>
                  <span className="relative">
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-[var(--dur-base)] ease-[var(--ease-spring)] group-hover:origin-left group-hover:scale-x-100" />
                  </span>
                  {'external' in item && item.external && (
                    <span aria-hidden="true" className="text-[9px]">↗</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="label m-0 hidden tabular-nums opacity-70 md:block desktop:block">
          Lagos {time}
        </p>
      </div>
    </header>
  );
}
