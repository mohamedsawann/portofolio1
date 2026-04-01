import { useEffect, useState } from "react";

/** Approximate “night” tint: 7pm–6am local (no geo sunset). */
export function useLocalNight(): boolean {
  const [night, setNight] = useState(() => {
    const h = new Date().getHours();
    return h >= 19 || h < 6;
  });

  useEffect(() => {
    const tick = () => {
      const h = new Date().getHours();
      setNight(h >= 19 || h < 6);
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return night;
}
