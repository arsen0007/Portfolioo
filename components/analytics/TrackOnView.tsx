'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

type TrackOnViewProps = {
  event: string;
  params?: Record<string, string>;
  /** `mount`: fire as soon as it renders. `visible`: when the marker scrolls into view. */
  when?: 'mount' | 'visible';
};

/** Fires one analytics event per page visit: on mount, or when it is scrolled into view. */
export function TrackOnView({ event, params, when = 'visible' }: TrackOnViewProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const key = JSON.stringify(params ?? {});

  useEffect(() => {
    const data = JSON.parse(key) as Record<string, string>;
    if (when === 'mount') {
      trackEvent(event, data);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackEvent(event, data);
          io.disconnect();
        }
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [event, key, when]);

  return <span aria-hidden="true" className="block h-px w-px" ref={ref} />;
}
