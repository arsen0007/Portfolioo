'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type FadeInProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Seconds. Stagger siblings by passing increasing values. */
  delay?: number;
};

/**
 * Reveal-on-scroll without pulling Framer Motion into the page bundle.
 *
 * Content is rendered by the server and is present in the HTML; this only
 * adds the transform once the element is observed. `prefers-reduced-motion`
 * is handled by the global guard in globals.css, which collapses the
 * transition rather than hiding anything.
 */
export function FadeIn({ as, children, className, delay = 0 }: FadeInProps) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    // No IntersectionObserver (or an already-visible element): show immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      className={cn('fade-in', shown && 'fade-in--shown', className)}
      ref={ref}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
