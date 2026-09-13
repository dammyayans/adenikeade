import type { ReactNode } from 'react';
import { HeroFilm } from './HeroFilm';

/** The stage the film travels across.
 *
 *  Three layers. The hero copy is at z-0, so she stands in front of the name. The
 *  film is pinned at z-10. The bands and stats that follow are at z-20, so they
 *  cross in front of her on the way past — the same reading order the reference
 *  site uses when a project card slides over the portrait.
 *
 *  This works because the site's sections are transparent: useGround crossfades a
 *  single body background rather than painting each section. A cut-out in the
 *  middle layer is therefore visible across every section boundary for free.
 *
 *  The film is pinned to THIS box, not to the hero, which is what lets her overflow
 *  past the fold and keep going. She has finished leaving by the time the stage
 *  ends, so Selected Work never has her behind it. */
export function HeroStage({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* pointer-events-none: she is a picture, and the CTAs are behind her. */}
      <div id="hero-film-col" className="pointer-events-none absolute inset-0 z-10">
        <div
          id="hero-film-sticky"
          className="sticky top-0 flex h-svh items-end justify-center overflow-hidden"
        >
          {/* The entrance fade sits on a wrapper, never on the film itself: the
              film's own transform is written inline every frame and an animation
              would override it. Arriving after the copy also means that on a phone
              she has been fitted under the buttons before she is first seen. */}
          <div className="enter" style={{ '--d': '0.5s' } as React.CSSProperties}>
            <HeroFilm />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
