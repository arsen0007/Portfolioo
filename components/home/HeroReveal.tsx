'use client';

import type { ElementType, ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { whenLoaderDone } from '@/lib/loader';

/**
 * Above-the-fold reveal that waits for the intro loader to hand the screen
 * over on the first visit of a session, and plays immediately otherwise.
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
  return (
    <Reveal as={as} className={className} delay={delay} immediate mode={mode} waitFor={whenLoaderDone}>
      {children}
    </Reveal>
  );
}
