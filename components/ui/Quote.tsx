import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type QuoteProps = {
  children: ReactNode;
  attribution: ReactNode;
  /** What the person did next, which matters more than what they said. */
  consequence?: ReactNode;
  className?: string;
};

/** A pull quote in the display serif. */
export function Quote({ attribution, children, className, consequence }: QuoteProps) {
  return (
    <figure className={cn('max-w-3xl', className)}>
      <blockquote className="text-pretty font-display text-h3 text-textPrimary">
        <p>
          <span aria-hidden="true">“</span>
          {children}
          <span aria-hidden="true">”</span>
        </p>
      </blockquote>
      <figcaption className="mt-5 text-small text-textMuted">{attribution}</figcaption>
      {consequence ? (
        <p className="mt-4 border-t border-surfaceBorder pt-4 text-small font-medium text-textPrimary">
          {consequence}
        </p>
      ) : null}
    </figure>
  );
}
