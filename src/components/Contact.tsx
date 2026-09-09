import { contactLinks, EMAIL, site } from '../data/site';
import { useClock } from '../hooks/useClock';

export function Contact() {
  const time = useClock();

  return (
    <section id="contact" data-ground="pink" className="scroll-mt-20 pt-16 pb-10 desktop:pt-24">
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)]">
        <p className="label m-0 mb-7 opacity-70">Open to work — full-time, contract, or a single project</p>

        <a
          href={`mailto:${EMAIL}`}
          className="display block break-all no-underline text-[clamp(28px,6.6vw,86px)]"
        >
          {EMAIL}
        </a>

        <ul className="m-0 mt-12 list-none p-0">
          {contactLinks.map((link) => (
            <li key={link.label} className="border-t border-current/25 last:border-b">
              <a
                href={link.href}
                {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex flex-wrap items-center gap-x-4 gap-y-2 py-5 no-underline"
              >
                <span className="font-display text-[clamp(24px,3.6vw,44px)] font-bold leading-none tracking-[-0.035em]">
                  {link.label}
                </span>
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-current transition-transform duration-[var(--dur-base)] ease-[var(--ease-spring)] group-hover:translate-x-1"
                >
                  →
                </span>
                <span className="label rounded-full border border-current/45 px-3 py-1.5 opacity-80">
                  {link.note}
                </span>
                <span className="ml-auto hidden text-[14px] opacity-65 desktop:inline">{link.value}</span>
              </a>
            </li>
          ))}
        </ul>

        <footer className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 pb-2">
          <p className="label m-0 opacity-75">
            © {new Date().getFullYear()} {site.name} — {site.domain}
          </p>
          <p className="label m-0 tabular-nums opacity-75">
            {site.location} · {time} GMT+1
          </p>
        </footer>
      </div>
    </section>
  );
}
