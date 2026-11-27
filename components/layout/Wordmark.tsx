'use client';

import { useRef } from 'react';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { loaderWillRun } from '@/lib/loader';
import { gsap, motionAllowed, useGSAP } from '@/lib/motion/gsap';
import { cn } from '@/lib/utils';

/*
 * The mark: "TA" set in an 11 × 7 dot matrix, like a tiny LED display. Lit
 * dots are the letters; unlit dots stay faintly visible as texture; the A's
 * crossbar is the one signal-orange line. It is the site's idea in miniature:
 * scattered noise that resolves into a system.
 */
const GLYPHS = [
  // T        gap  A
  '#####' + '.' + '.###.',
  '..#..' + '.' + '#...#',
  '..#..' + '.' + '#...#',
  '..#..' + '.' + '#####',
  '..#..' + '.' + '#...#',
  '..#..' + '.' + '#...#',
  '..#..' + '.' + '#...#',
];
const COLS = 11;
const ROWS = 7;
const SIGNAL_ROW = 3; // the A's crossbar
const A_START = 6;

type Dot = { x: number; y: number; lit: boolean; signal: boolean };

const DOTS: Dot[] = GLYPHS.flatMap((row, y) =>
  row.split('').map((ch, x) => ({
    x,
    y,
    lit: ch === '#',
    signal: ch === '#' && y === SIGNAL_ROW && x >= A_START,
  })),
);

// Deterministic pseudo-random offsets so server and client render the same.
function scatter(i: number, spread: number) {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  return { x: (a - Math.floor(a) - 0.5) * spread * 2, y: (b - Math.floor(b) - 0.5) * spread * 1.4 };
}

let introPlayed = false;

export function Mark({ className, animate = true }: { className?: string; animate?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg || !animate || !motionAllowed()) return;
      const lit = Array.from(svg.querySelectorAll<SVGCircleElement>('[data-lit]'));

      // First paint of the session: dots arrive from noise and lock into place.
      // When the intro loader runs, its TA lands on this mark instead.
      if (!introPlayed && !loaderWillRun()) {
        introPlayed = true;
        gsap.from(lit, {
          x: (i) => scatter(i, 9).x,
          y: (i) => scatter(i, 9).y,
          opacity: 0,
          duration: 1.3,
          ease: 'expo.out',
          stagger: { each: 0.018, from: 'random' },
          delay: 0.2,
        });
      }

      // Hover / focus on the link: scatter, then re-form.
      const link = svg.closest('a');
      if (!link) return;
      let tl: gsap.core.Timeline | null = null;
      const play = () => {
        if (tl?.isActive()) return;
        tl = gsap
          .timeline()
          .to(lit, {
            x: (i) => scatter(i + 31, 2.6).x,
            y: (i) => scatter(i + 31, 2.6).y,
            duration: 0.22,
            ease: 'power2.out',
            stagger: { each: 0.004, from: 'random' },
          })
          .to(lit, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)', stagger: { each: 0.008, from: 'center' } });
      };
      link.addEventListener('pointerenter', play);
      link.addEventListener('focus', play);
      return () => {
        link.removeEventListener('pointerenter', play);
        link.removeEventListener('focus', play);
      };
    },
    { scope: ref },
  );

  return (
    <svg
      aria-hidden="true"
      className={cn('h-[26px] w-auto shrink-0 overflow-visible', className)}
      data-mark=""
      ref={ref}
      viewBox={`-0.5 -0.5 ${COLS} ${ROWS}`}
    >
      {DOTS.map((d, i) => (
        <circle
          cx={d.x}
          cy={d.y}
          data-lit={d.lit ? '' : undefined}
          fill={d.signal ? 'var(--accent)' : 'currentColor'}
          key={i}
          opacity={d.lit ? 1 : 0.13}
          r={d.lit ? 0.4 : 0.19}
        />
      ))}
    </svg>
  );
}

type WordmarkProps = {
  className?: string;
  /** Show the mono descriptor after the name (wide screens, top of page). */
  descriptor?: boolean;
  animate?: boolean;
};

/**
 * The site signature: the dot-matrix mark, "Tousif" in Geist and "Ali" in the
 * Instrument Serif italic (the same human-accent move as every headline), and
 * an optional mono descriptor that tucks away once the page scrolls.
 */
export function Wordmark({ animate = true, className, descriptor = false }: WordmarkProps) {
  return (
    <TransitionLink
      aria-label="Tousif Ali, home"
      className={cn('group inline-flex min-h-11 items-center gap-3 text-textPrimary', className)}
      href="/"
    >
      <Mark animate={animate} />
      <span className="flex items-baseline gap-[0.3em] text-[1.125rem] leading-none">
        <span className="font-semibold tracking-[-0.035em]">Tousif</span>
        <span className="font-serif text-[1.3em] font-normal italic tracking-[-0.01em] transition-colors duration-500 group-hover:text-accent">
          Ali
        </span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'label hidden items-center gap-3 overflow-hidden whitespace-nowrap text-[0.65rem] leading-tight text-textMuted transition-[max-width,opacity] duration-700 ease-out xl:flex',
          descriptor ? 'max-w-[14rem] opacity-100' : 'max-w-0 opacity-0',
        )}
      >
        <span className="h-6 w-px shrink-0 bg-surfaceBorderStrong" />
        <span>
          AI systems
          <br />
          Bengaluru
        </span>
      </span>
    </TransitionLink>
  );
}
