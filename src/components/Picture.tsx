import media from '../media.json';
import report from '../media.report.json';
import film from '../media.film.json';

const SETS: Record<string, MediaItem[]> = { ...media, ...report, ...film } as never;

export type MediaItem = {
  slug: string;
  width: number;
  height: number;
  ratio: number;
  widths: number[];
  lqip: string;
};

export function getItem(set: string, slug: string): MediaItem | undefined {
  return SETS[set]?.find((i) => i.slug === slug);
}

type Props = {
  set: string;
  slug: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/** Width and height are always emitted so the box is reserved before load —
 *  this is what keeps CLS at zero. */
export function Picture({ set, slug, alt, sizes, className, priority }: Props) {
  const item = getItem(set, slug);
  if (!item) return null;

  const url = (w: number, fmt: string) => `/media/${set}/${item.slug}-${w}.${fmt}`;
  const srcSet = (fmt: string) =>
    item.widths.map((w) => `${url(w, fmt)} ${w}w`).join(', ');
  const widest = item.widths[item.widths.length - 1];

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        src={url(widest, 'webp')}
        alt={alt}
        width={item.width}
        height={item.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchpriority: 'high' } : {})}
        className={className}
        style={{
          backgroundImage: `url("${item.lqip}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </picture>
  );
}
