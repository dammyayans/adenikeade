import type { Block } from '../data/caseStudies';
import { Picture } from './Picture';
import { Film } from './Film';
import { useReveal } from '../hooks/useReveal';

const COLS: Record<2 | 3, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 desktop:grid-cols-3',
};

// The container stops at 1310px of content, so past 1370px the columns stop growing
// and a vw value would keep asking for more image than is ever shown.
const SIZES: Record<2 | 3, string> = {
  2: '(min-width: 1370px) 645px, (min-width: 810px) 46vw, 92vw',
  3: '(min-width: 1370px) 423px, (min-width: 1200px) 30vw, (min-width: 810px) 46vw, 92vw',
};

export function BlockView({ block }: { block: Block }) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.15);
  const cls = shown ? 'reveal-in' : 'reveal-out';

  switch (block.kind) {
    case 'text':
      return (
        <div ref={ref} className={`${cls} max-w-[68ch]`}>
          {block.heading && (
            <h2 className="display m-0 mb-5 text-[clamp(24px,3.4vw,40px)]">{block.heading}</h2>
          )}
          {block.body.map((p) => (
            <p key={p.slice(0, 20)} className="mb-4 text-[clamp(16px,1.7vw,18px)] leading-[1.6] opacity-80 last:mb-0">
              {p}
            </p>
          ))}
        </div>
      );

    // Where the block names an `href` the whole figure is one link: the plate
    // and its caption share a single target. The caption then names the link,
    // so the image goes empty-alt to avoid being announced twice.
    case 'full': {
      const figure = (
        <figure className="m-0">
          <div
            className="overflow-hidden rounded-[2px] bg-[var(--color-taupe)]"
            style={{ aspectRatio: block.ratio ?? '3 / 2' }}
          >
            <Picture
              set={block.set}
              slug={block.slug}
              alt={block.href ? '' : block.caption}
              sizes="(min-width: 1370px) 1310px, 94vw"
              className={`h-full w-full object-cover ${block.anchor === 'top' ? 'object-top' : 'object-center'}`}
            />
          </div>
          <figcaption
            className={`caption mt-3 max-w-[64ch] opacity-60 ${block.href ? 'underline underline-offset-2' : ''}`}
          >
            {block.caption}
          </figcaption>
        </figure>
      );

      return (
        <div ref={ref} className={cls}>
          {block.href ? (
            <a
              href={block.href}
              target="_blank"
              rel="noreferrer"
              className="block no-underline transition-opacity duration-[var(--dur-base)] hover:opacity-85"
            >
              {figure}
            </a>
          ) : (
            figure
          )}
        </div>
      );
    }

    case 'grid':
      return (
        <div ref={ref} className={`${cls} grid grid-cols-1 gap-x-5 gap-y-8 ${COLS[block.cols]}`}>
          {block.items.map((item) => (
            <figure key={item.slug} className="m-0">
              <div
                className="overflow-hidden rounded-[2px] bg-[var(--color-taupe)]"
                style={{ aspectRatio: block.ratio }}
              >
                <Picture
                  set={item.set}
                  slug={item.slug}
                  alt={item.caption}
                  sizes={SIZES[block.cols]}
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="caption mt-3 opacity-60">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      );

    // Film brings its own reveal and its own measure, so it is returned whole
    // rather than wrapped in the shared box the pictures use.
    case 'film':
      return (
        <Film
          slug={block.slug}
          poster={block.poster}
          caption={block.caption}
          credit={block.credit}
          ratio={block.ratio}
        />
      );

    case 'quote':
      return (
        <div ref={ref} className={cls}>
          <blockquote className="m-0">
          <p className="display m-0 max-w-[17ch] text-[clamp(28px,5.4vw,72px)]">
            {block.text}
          </p>
            {block.note && (
              <p className="mt-6 mb-0 max-w-[52ch] text-[15px] leading-[1.5] opacity-70">{block.note}</p>
            )}
          </blockquote>
        </div>
      );

    case 'link':
      return (
        <div ref={ref} className={cls}>
          <a
            href={block.href}
            target="_blank"
            rel="noreferrer"
            className="group block border-y border-current/25 py-7 no-underline transition-colors duration-[var(--dur-base)] hover:border-current/50"
          >
            <p className="label m-0 mb-4 opacity-60">{block.label}</p>
            <span className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="font-display text-[clamp(24px,3.6vw,44px)] font-bold leading-none tracking-[-0.035em]">
                {block.title}
              </span>
              <span
                aria-hidden="true"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-current transition-transform duration-[var(--dur-base)] ease-[var(--ease-spring)] group-hover:translate-x-1"
              >
                →
              </span>
              {block.note && (
                <span className="label rounded-full border border-current/45 px-3 py-1.5 opacity-80 md:ml-auto">
                  {block.note}
                </span>
              )}
            </span>
          </a>
        </div>
      );

    case 'facts':
      return (
        <div ref={ref} className={cls}>
          <p className="label m-0 mb-7 opacity-60">{block.heading}</p>
          <dl className="m-0 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2 desktop:grid-cols-3">
            {block.items.map((f) => (
              <div key={f.k} className="border-t border-current/25 pt-3">
                <dt className="label m-0 opacity-60">{f.k}</dt>
                <dd className="m-0 mt-1.5 font-display text-[clamp(19px,2.2vw,26px)] font-bold leading-[1.15] tracking-[-0.03em] tabular-nums">
                  {f.v}
                </dd>
              </div>
            ))}
          </dl>
          {block.note && (
            <p className="mt-8 mb-0 max-w-[62ch] border-l-2 border-current/40 pl-4 text-[14px] leading-[1.5] opacity-70">
              {block.note}
            </p>
          )}
        </div>
      );
  }
}
