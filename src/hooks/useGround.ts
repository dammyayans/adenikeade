import { useEffect } from 'react';

/** The hook of Direction A: the page ground crossfades through the cardigan's
 *  stripe order as you scroll. With JS off every section simply sits on bone
 *  and stays legible, because nothing hardcodes a light-on-dark colour. */
export const GROUNDS = {
  bone:    { bg: '#EFE9DC', fg: '#2A0A12' },
  butter:  { bg: '#F5E3AE', fg: '#2A0A12' },
  oxblood: { bg: '#5E0E1C', fg: '#F6F2E8' },
  taupe:   { bg: '#CBBBAE', fg: '#2A0A12' },
  pink:    { bg: '#F0246F', fg: '#FFF3F7' },
} as const;

export type Ground = keyof typeof GROUNDS;

export function useGround(key?: string) {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-ground]')
    );
    if (!sections.length) return;

    const root = document.documentElement;
    const apply = (name: string) => {
      const g = GROUNDS[name as Ground];
      if (!g) return;
      root.style.setProperty('--ground', g.bg);
      root.style.setProperty('--on-ground', g.fg);
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', g.bg);
    };

    const io = new IntersectionObserver(
      (entries) => {
        // The section crossing the viewport midline owns the ground.
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) apply((hit.target as HTMLElement).dataset.ground!);
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((s) => io.observe(s));
    apply(sections[0].dataset.ground!);
    return () => io.disconnect();
  }, [key]);
}
