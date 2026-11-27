'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, motionAllowed, useGSAP } from '@/lib/motion/gsap';

type MagneticProps = {
  children: ReactNode;
  /** Max pull in px. */
  strength?: number;
  className?: string;
};

/**
 * Pulls its child toward the pointer while hovered and springs back on leave.
 * Fine pointers only; a no-op on touch and under reduced motion.
 */
export function Magnetic({ children, className, strength = 14 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionAllowed() || !window.matchMedia('(pointer: fine)').matches) return;

      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        xTo(dx * strength);
        yTo(dy * strength);
      };
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <span className={className ?? 'inline-block'} ref={ref}>
      {children}
    </span>
  );
}
