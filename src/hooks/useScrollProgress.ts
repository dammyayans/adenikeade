import { useEffect, useState } from 'react';

/** rAF-driven rather than scroll-event driven — scroll events fire at
 *  inconsistent rates and produce a jittery bar. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    let last = -1;

    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (Math.abs(p - last) > 0.001) {
        last = p;
        setProgress(p);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return progress;
}
