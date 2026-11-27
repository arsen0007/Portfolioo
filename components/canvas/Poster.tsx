'use client';

import { useMemo } from 'react';

/**
 * Static decorative fallback for low tier, reduced motion and WebGL failure:
 * a dotted orb drawn in the token colours. No three.js, no animation.
 */
export function Poster() {
  const dots = useMemo(() => {
    const out: { x: number; y: number; r: number; o: number; s: boolean }[] = [];
    const n = 1500;
    const ga = Math.PI * (3 - Math.sqrt(5));
    let seed = 11;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < n; i++) {
      const y = 1 - ((i + 0.5) / n) * 2;
      const rr = Math.sqrt(1 - y * y);
      const a = i * ga;
      const x = Math.cos(a) * rr;
      const z = Math.sin(a) * rr; // depth: -1 far .. 1 near
      const near = (z + 1) / 2;
      out.push({
        x: 100 + x * 88 + (rnd() - 0.5) * 1.2,
        y: 100 + y * 88 + (rnd() - 0.5) * 1.2,
        r: 0.35 + near * 0.75 * (0.6 + rnd() * 0.6),
        o: 0.1 + near * 0.6,
        s: rnd() < 0.045,
      });
    }
    // sparse dust around the orb
    for (let i = 0; i < 120; i++) {
      const a = rnd() * Math.PI * 2;
      const d = 96 + rnd() * 34;
      out.push({ x: 100 + Math.cos(a) * d, y: 100 + Math.sin(a) * d * 0.9, r: 0.4, o: 0.18, s: false });
    }
    return out;
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      data-scene-poster=""
    >
      <svg
        className="absolute left-1/2 top-1/2 h-[min(46vw,78vh)] w-[min(46vw,78vh)] min-h-[300px] min-w-[300px] -translate-x-1/2 -translate-y-1/2 opacity-60 md:left-[70%] md:opacity-100 [@media(max-width:767px)]:opacity-35"
        viewBox="0 0 200 200"
      >
        {dots.map((d, i) => (
          <circle
            cx={d.x.toFixed(2)}
            cy={d.y.toFixed(2)}
            fill={d.s ? 'var(--accent)' : 'var(--text-primary)'}
            fillOpacity={d.s ? Math.min(1, d.o + 0.3).toFixed(2) : d.o.toFixed(2)}
            key={i}
            r={d.r.toFixed(2)}
          />
        ))}
      </svg>
    </div>
  );
}
