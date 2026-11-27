'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, motionAllowed, useGSAP } from '@/lib/motion/gsap';

/**
 * Pins the numeral scene on desktop with motion allowed. While pinned, the DOM
 * "433" recedes to a ghost as the particle field takes the numeral shape.
 * On touch and under reduced motion this is a plain block.
 */
export function NumberPin({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionAllowed()) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (pointer: fine)', () => {
        const num = el.querySelector('[data-bignum]');
        const rest = el.querySelectorAll('[data-number-late]');
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: '+=110%', pin: true, scrub: 0.6, anticipatePin: 1 },
        });
        tl.to(num, { opacity: 0.1, scale: 1.04, transformOrigin: '0% 50%' }, 0.15)
          .fromTo(rest, { opacity: 0.35, y: 24 }, { opacity: 1, y: 0, stagger: 0.1 }, 0.1);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
