import { useEffect, useState } from 'react';

const POSTER_ALT =
  'Adenike Adedokun, arms folded, in a hand-crocheted striped cardigan';

type Mode = 'poster' | 'desktop' | 'mobile';

/** Browsers ignore `media` on <source> inside <video>, so the variant is chosen
 *  here instead. Until that choice is made — and always under reduced-motion —
 *  the poster stands alone, which also makes it a clean, cheap LCP element. */
export function HeroFilm() {
  const [mode, setMode] = useState<Mode>('poster');

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const small = window.matchMedia('(max-width: 809px)');

    const decide = () => setMode(reduce.matches ? 'poster' : small.matches ? 'mobile' : 'desktop');
    decide();

    reduce.addEventListener('change', decide);
    return () => reduce.removeEventListener('change', decide);
  }, []);

  const frame = 'aspect-square w-full overflow-hidden rounded-[2px] bg-[var(--color-taupe)]';

  const poster = (
    <picture>
      <source type="image/avif" srcSet="/media/hero/poster.avif" />
      <source type="image/webp" srcSet="/media/hero/poster.webp" />
      <img
        src="/media/hero/poster.jpg"
        alt={POSTER_ALT}
        width={1080}
        height={1080}
        {...{ fetchpriority: 'high' }}
        className="h-full w-full object-cover"
      />
    </picture>
  );

  if (mode === 'poster') return <div className={frame}>{poster}</div>;

  return (
    <div className={frame}>
      <video
        key={mode}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/media/hero/poster.jpg"
        width={1080}
        height={1080}
        aria-label={POSTER_ALT}
        className="h-full w-full object-cover"
      >
        <source type='video/mp4; codecs="av01.0.05M.08"' src={`/media/hero/hero-${mode}.av1.mp4`} />
        <source type="video/webm" src={`/media/hero/hero-${mode}.vp9.webm`} />
        <source type="video/mp4" src={`/media/hero/hero-${mode}.h264.mp4`} />
      </video>
    </div>
  );
}
