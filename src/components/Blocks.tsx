import type { Block } from '../data/caseStudies';
import { Picture } from './Picture';
import { Film } from './Film';
import { useReveal } from '../hooks/useReveal';

const COLS: Record<2 | 3, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 desktop:grid-cols-3',
};

const SIZES: Record<2 | 3, string> = {
  2: '(min-width: 1200px) 46vw, (min-width: 810px) 46vw, 92vw',
  3: '(min-width: 1200px) 30vw, (min-width: 810px) 46vw, 92vw',
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

    // Where the block names an `href` the plate itself is the link, so the
    // whole image is the target rather than a word tucked under it.
    case 'full': {
      const plate = (
        <div
          className="overflow-hidden rounded-[2px] bg-[var(--color-taupe)]"
          style={{ aspectRatio: block.ratio ?? '3 / 2' }}
        >
          <Picture
            set={block.set}
            slug={block.slug}
            alt={block.caption}
            sizes="(min-width: 1200px) 92vw, 94vw"
            className={`h-full w-full object-cover ${block.anchor === 'top' ? 'object-top' : 'object-center'}`}
          />
        </div>
      );

      return (
        <div ref={ref} className={cls}>
          <figure className="m-0">
            {block.href ? (
              <a
                href={block.href}
                target="_blank"
                rel="noreferrer"
                className="block no-underline transition-opacity duration-[var(--dur-base)] hover:opacity-85"
              >
                {plate}
              </a>
            ) : (
              plate
            )}
            <figcaption className="caption mt-3 max-w-[64ch] opacity-60">
              {block.caption}
            </figcaption>
          </figure>
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
