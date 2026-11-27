'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, motionAllowed, ScrollTrigger, useGSAP } from '@/lib/motion/gsap';

type Geometry = { w: number; h: number; paths: string[]; ends: [number, number][] };

/**
 * The architecture as a node graph. The ordered list is the accessible
 * structure and stays in the DOM; the SVG connectors are decoration measured
 * from the live node positions, and draw on scroll (stroke-dashoffset).
 * Single column on phones, a zigzag on wider screens.
 */
export function ArchitectureGraph({ steps }: { steps: string[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLLIElement | null)[]>([]);
  const lines = useRef<(SVGPathElement | null)[]>([]);
  const [geo, setGeo] = useState<Geometry>({ w: 0, h: 0, paths: [], ends: [] });

  const measure = useCallback(() => {
    const root = wrap.current;
    if (!root) return;
    const rects = nodes.current.map((n) => (n ? { x: n.offsetLeft, y: n.offsetTop, w: n.offsetWidth, h: n.offsetHeight } : null));
    const paths: string[] = [];
    const ends: [number, number][] = [];
    for (let i = 0; i < rects.length - 1; i += 1) {
      const a = rects[i];
      const b = rects[i + 1];
      if (!a || !b) continue;
      const x1 = a.x + a.w / 2;
      const y1 = a.y + a.h;
      const x2 = b.x + b.w / 2;
      const y2 = b.y;
      const mid = (y1 + y2) / 2;
      paths.push(`M ${x1} ${y1} L ${x1} ${mid} L ${x2} ${mid} L ${x2} ${y2}`);
      ends.push([x2, y2]);
    }
    setGeo({ w: root.offsetWidth, h: root.offsetHeight, paths, ends });
  }, []);

  useEffect(() => {
    measure();
    const root = wrap.current;
    if (!root) return;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  useGSAP(
    () => {
      const els = nodes.current;
      if (!motionAllowed()) {
        els.forEach((n) => n && (n.dataset.lit = 'true'));
        return;
      }
      const made: ScrollTrigger[] = [];
      els.forEach((node, i) => {
        if (!node) return;
        node.dataset.lit = 'false';
        made.push(
          ScrollTrigger.create({
            trigger: node,
            start: 'top 78%',
            onEnter: () => (node.dataset.lit = 'true'),
            onLeaveBack: () => (node.dataset.lit = 'false'),
          }),
        );
        const path = lines.current[i];
        const nextNode = els[i + 1];
        if (path && nextNode) {
          const tween = gsap.fromTo(
            path,
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              ease: 'none',
              scrollTrigger: { trigger: nextNode, start: 'top 92%', end: 'top 62%', scrub: 0.6 },
            },
          );
          if (tween.scrollTrigger) made.push(tween.scrollTrigger);
        }
      });
      return () => made.forEach((t) => t.kill());
    },
    { scope: wrap, dependencies: [geo.paths.length, geo.w] },
  );

  return (
    <div className="relative" ref={wrap}>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 overflow-visible"
        height={geo.h}
        width={geo.w}
      >
        {geo.paths.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="var(--surface-border-strong)" strokeWidth="1" />
            <path
              d={d}
              fill="none"
              pathLength={1}
              ref={(el) => {
                lines.current[i] = el;
              }}
              stroke="var(--accent)"
              strokeDasharray="1"
              strokeWidth="1.5"
            />
            <circle cx={geo.ends[i][0]} cy={geo.ends[i][1]} fill="var(--accent)" r="3" />
          </g>
        ))}
      </svg>

      <ol className="relative grid gap-y-10 md:grid-cols-2 md:gap-x-16 md:gap-y-12">
        {steps.map((step, i) => (
          <li
            className={`group/node relative ${i % 2 ? 'md:col-start-2' : 'md:col-start-1'} rounded-media border border-surfaceBorderStrong bg-[color-mix(in_srgb,var(--canvas)_82%,transparent)] p-5 transition-[border-color,transform] duration-700 data-[lit=true]:border-textSecondary md:p-6`}
            data-lit="true"
            key={step}
            ref={(el) => {
              nodes.current[i] = el;
            }}
            style={{ gridRow: i + 1 }}
          >
            <span className="label block tabular-nums text-textMuted transition-colors duration-700 group-data-[lit=true]/node:text-accent">
              {String(i + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
            </span>
            <span className="mt-3 block font-display text-h3 font-medium text-textPrimary">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
