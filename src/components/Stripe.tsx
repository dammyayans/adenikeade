/** The five-colour crochet band. Section divider and, fixed to the top of the
 *  viewport, the scroll-progress indicator. One device, two jobs. */
const BANDS = [
  { c: 'var(--color-pink)',    f: 1.4 },
  { c: 'var(--color-butter)',  f: 0.9 },
  { c: 'var(--color-oxblood)', f: 1.1 },
  { c: 'var(--color-rose)',    f: 0.8 },
  { c: 'var(--color-taupe)',   f: 1.3 },
];

export function Stripe({ height = 8, className = '' }: { height?: number; className?: string }) {
  return (
    <div
      className={`flex w-full ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      {BANDS.map((b, i) => (
        <span key={i} style={{ background: b.c, flex: b.f }} />
      ))}
    </div>
  );
}
