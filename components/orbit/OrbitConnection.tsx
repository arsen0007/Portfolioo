'use client';

import { motion } from 'framer-motion';
import type { AccentColor } from '@/lib/constants/colors';

export type OrbitConnectionProps = {
  active?: boolean;
  accent: AccentColor;
  delay: number;
  hovered?: boolean;
  reducedMotion?: boolean;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

export function OrbitConnection({
  active = false,
  accent,
  delay,
  hovered = false,
  reducedMotion = false,
  x1,
  x2,
  y1,
  y2,
}: OrbitConnectionProps) {
  const isBright = active || hovered;
  const accentStroke = `var(--${accent})`;

  return (
    <motion.line
      animate={{
        opacity: isBright ? 1 : 0.6,
        pathLength: 1,
        stroke: isBright ? accentStroke : 'var(--connection-line)',
        strokeWidth: isBright ? 1 : 0.5,
      }}
      className={hovered && !active ? 'orbit-line-flow' : undefined}
      initial={{
        opacity: 0,
        pathLength: 0,
        stroke: 'var(--connection-line)',
        strokeWidth: 0.5,
      }}
      stroke="var(--connection-line)"
      strokeDasharray={active ? undefined : '5 4'}
      strokeWidth={0.5}
      transition={{
        duration: reducedMotion ? 0 : 0.18,
        ease: 'easeOut',
        opacity: { delay: 0, duration: reducedMotion ? 0 : 0.18 },
        pathLength: {
          delay: reducedMotion ? 0 : delay,
          duration: reducedMotion ? 0 : 0.55,
        },
        stroke: { duration: reducedMotion ? 0 : 0.18 },
        strokeWidth: { duration: reducedMotion ? 0 : 0.18 },
      }}
      vectorEffect="non-scaling-stroke"
      x1={x1}
      x2={x2}
      y1={y1}
      y2={y2}
    />
  );
}
