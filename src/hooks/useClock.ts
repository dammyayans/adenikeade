import { useEffect, useState } from 'react';
import { site } from '../data/site';

const fmt = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hour12: false, timeZone: site.timeZone,
});

/** Starts blank so the prerendered HTML and the first client paint agree —
 *  a baked-in server timestamp would be both a hydration mismatch and a lie. */
export function useClock() {
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
