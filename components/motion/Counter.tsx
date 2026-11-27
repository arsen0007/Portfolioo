'use client';

import { useRef } from 'react';
import { dur, ease } from '@/lib/motion/tokens';
import { gsap, motionAllowed, useGSAP } from '@/lib/motion/gsap';

type CounterProps = {
  /** The final value as displayed, e.g. "94,363", "433", "96%", "5–15". */
  value: string;
  className?: string;
  duration?: number;
};

/**
 * Counts a number up from zero when it scrolls into view. The server renders
 * the real value (SEO, no-JS, screen readers); only the visual animates.
 * Non-numeric values render as-is.
 */
export function Counter({ className, duration = dur.xl, value }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !match) return;
      if (!motionAllowed()) {
        gsap.set(el, { visibility: 'visible' });
        return;
      }
      const [, prefix, num, suffix] = match;
      const target = Number(num.replace(/,/g, ''));
      const decimals = num.includes('.') ? num.split('.')[1].length : 0;
      const useCommas = num.includes(',');
      const state = { n: 0 };
      const format = (n: number) => {
        const fixed = n.toFixed(decimals);
        return useCommas ? Number(fixed).toLocaleString('en-US') : fixed;
      };

      gsap.set(el, { visibility: 'visible' });
      el.textContent = `${prefix}${format(0)}${suffix}`;
      gsap.to(state, {
        n: target,
        duration,
        ease: ease.count,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${format(state.n)}${suffix}`;
        },
        onComplete: () => {
          el.textContent = value;
        },
      });
    },
    { scope: ref },
  );

  return (
    <span aria-label={value} className={className} data-reveal={match ? '' : undefined} ref={ref} role="text">
      {value}
    </span>
  );
}
