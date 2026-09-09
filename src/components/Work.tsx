import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects, type Project } from '../data/site';
import { Picture } from './Picture';
import { useReveal } from '../hooks/useReveal';

/** Spans are picked so every desktop row fills exactly: 5+7, 5+7, 12.
 *  No tile is ever left sitting alone beside dead space. */
const SPAN: Record<Project['span'], string> = {
  5: 'desktop:col-span-5',
  7: 'desktop:col-span-7',
  12: 'desktop:col-span-12',
};

export function Work() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number; label: string } | null>(null);

  // Cursor-follow label. Fine pointers only — coarse pointers get the label
  // printed under each tile instead, so nothing is hover-only.
  const track = (e: React.MouseEvent, label: string) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const box = gridRef.current?.getBoundingClientRect();
    if (!box) return;
    setCursor({ x: e.clientX - box.left, y: e.clientY - box.top, label });
  };

  return (
    <section id="work" data-ground="bone" className="scroll-mt-20 py-16 desktop:py-24">
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)]">
        <header className="mb-10 flex items-baseline justify-between gap-6 border-t border-current/25 pt-4">
          <h2 className="display m-0 text-[clamp(30px,4.2vw,52px)]">Selected work</h2>
          <p className="label m-0 whitespace-nowrap opacity-60">
            {projects.length} projects · 2023—2026
          </p>
        </header>

        <div
          ref={gridRef}
          className="relative grid grid-cols-1 items-start gap-x-5 gap-y-14 desktop:grid-cols-12"
          onMouseLeave={() => setCursor(null)}
        >
          {projects.map((p) => (
            <Tile key={p.index} project={p} onMove={track} />
          ))}

          {cursor && (
            <span
              aria-hidden="true"
              className="label pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[var(--color-pink)] px-4 py-2.5 text-white"
              style={{ left: cursor.x, top: cursor.y }}
            >
              View — {cursor.label}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

function Tile({
  project: p,
  onMove,
}: {
  project: Project;
  onMove: (e: React.MouseEvent, label: string) => void;
}) {
  const { ref, shown } = useReveal<HTMLElement>(0.15);

  const sizes =
    p.span === 12
      ? '(min-width: 1200px) 27vw, (min-width: 810px) 30vw, 90vw'
      : p.span === 7
        ? '(min-width: 1200px) 58vw, 92vw'
        : '(min-width: 1200px) 42vw, 92vw';

  const media = p.gallery ? (
    <div className="grid grid-cols-3 gap-2.5 desktop:gap-4">
      {p.gallery.map((slug) => (
        <div
          key={slug}
          className="overflow-hidden rounded-[2px] bg-[var(--color-taupe)]"
          style={{ aspectRatio: p.ratio }}
        >
          <Picture
            set={p.set}
            slug={slug}
            alt={`${p.client} — ${p.discipline}`}
            sizes={sizes}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-spring)] group-hover:scale-[1.03]"
          />
        </div>
      ))}
    </div>
  ) : (
    <div
      className="overflow-hidden rounded-[2px] bg-[var(--color-taupe)]"
      style={{ aspectRatio: p.ratio }}
    >
      <Picture
        set={p.set}
        slug={p.slug}
        alt={`${p.title} — ${p.discipline}`}
        sizes={sizes}
        className={`h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-spring)] group-hover:scale-[1.03] ${
          p.anchor === 'top' ? 'object-top' : 'object-center'
        }`}
      />
    </div>
  );

  return (
    <article ref={ref} className={`${SPAN[p.span]} ${shown ? 'reveal-in' : 'reveal-out'}`}>
      <Link to={p.href ?? '/'} onMouseMove={(e) => onMove(e, p.title)} className="group block no-underline">
        {media}

        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="label text-[var(--color-pink)]">{p.index}</span>
          <h3 className="m-0 font-display text-[clamp(20px,2.4vw,28px)] font-bold leading-[1.1] tracking-[-0.03em]">
            {p.title}
          </h3>
          <span className="label opacity-55">{p.client} · {p.year}</span>
        </div>

        <p className="mt-2 mb-0 max-w-[58ch] text-[15px] leading-[1.5] opacity-70">{p.blurb}</p>
        <p className="label mt-3 mb-0 opacity-50">{p.discipline}</p>

        {/* Touch equivalent for the cursor label — never hover-only. */}
        <p className="label mt-3 mb-0 inline-flex items-center gap-1.5 text-[var(--color-pink)] [@media(pointer:fine)]:hidden">
          View case study <span aria-hidden="true">→</span>
        </p>
      </Link>
    </article>
  );
}
