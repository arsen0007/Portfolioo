'use client';

import { useState, type ElementType, type ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { willPreload } from './Preloader';

/**
 * Reveal that waits for the preloader's split on the first visit of a session,
 * and plays immediately otherwise. Delay is not part of the markup, so there is
 * no hydration mismatch.
 */
export function HeroReveal({
  as,
  children,
  className,
  delay = 0,
  mode = 'lines',
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  mode?: 'lines' | 'words' | 'fade';
}) {
  const [offset] = useState(() => (willPreload() ? 1.25 : 0));
  return (
    <Reveal as={as} className={className} delay={delay + offset} immediate mode={mode}>
      {children}
    </Reveal>
  );
}
