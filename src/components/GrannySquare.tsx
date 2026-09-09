/** Three concentric rounds worked outward from a centre ring, turned 45° —
 *  the construction of a crochet granny square. */
export function GrannySquare({ size = 22, mono = false }: { size?: number; mono?: boolean }) {
  const stroke = mono ? 'currentColor' : undefined;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Adenike Adedokun">
      <g fill="none" strokeWidth="10" stroke={stroke}>
        <path d="M50 5 L95 50 L50 95 L5 50 Z"     stroke={stroke ?? '#F0246F'} />
        <path d="M50 21 L79 50 L50 79 L21 50 Z"   stroke={stroke ?? 'currentColor'} />
        <path d="M50 37 L63 50 L50 63 L37 50 Z"   stroke={stroke ?? '#F0246F'} />
      </g>
    </svg>
  );
}
