'use client';

import { useRef } from 'react';
import { gsap, motionAllowed, useGSAP } from '@/lib/motion/gsap';
import type { ProjectDecision } from '@/lib/data/projects';

/**
 * Decisions as numbered cells in a hairline grid. On a fine pointer each cell
 * lifts and tilts a few degrees toward the cursor: transform only.
 */
export function DecisionGrid({ decisions }: { decisions: ProjectDecision[] }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      if (!motionAllowed() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const cleanups: (() => void)[] = [];
      root.current?.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
        const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' });
        const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' });
        const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
        gsap.set(el, { transformPerspective: 1000 });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          ry(px * 4);
          rx(-py * 4);
          y(-6);
        };
        const leave = () => {
          rx(0);
          ry(0);
          y(0);
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        });
      });
      return () => cleanups.forEach((c) => c());
    },
    { scope: root },
  );

  return (
    <ol className="grid border-l border-t border-surfaceBorder md:grid-cols-2" ref={root}>
      {decisions.map((decision, i) => (
        <li className="border-b border-r border-surfaceBorder" key={decision.title}>
          <div className="group/card h-full p-6 transition-colors duration-500 hover:bg-surface/60 md:p-8" data-tilt="">
            <span className="font-display text-h1 font-medium tabular-nums leading-none tracking-[-0.05em] text-textMuted/50 transition-colors duration-500 group-hover/card:text-accent">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h4 className="mt-8 font-display text-h3 font-medium text-textPrimary">{decision.title}</h4>
            <p className="mt-4 max-w-prose text-textSecondary">{decision.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
