import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type QuoteProps = {
  children: ReactNode;
  attribution: ReactNode;
  /** What the person did next, which matters more than what they said. */
  consequence?: ReactNode;
  className?: string;
};

/** A pull quote in Instrument Serif: the human voice of the system. */
export function Quote({ attribution, children, className, consequence }: QuoteProps) {
  return (
    <figure className={cn('max-w-4xl', className)}>
      <blockquote className="text-pretty font-serif text-[clamp(1.6rem,1.2rem+1.6vw,2.6rem)] leading-[1.15] tracking-[-0.01em] text-textPrimary">
        <p>
          <span aria-hidden="true">“</span>
          {children}
          <span aria-hidden="true">”</span>
        </p>
      </blockquote>
      <figcaption className="label mt-6 text-textMuted">— {attribution}</figcaption>
      {consequence ? (
        <p className="mt-5 flex items-start gap-3 border-t border-surfaceBorder pt-5 text-small font-medium text-textPrimary">
          <span aria-hidden="true" className="live-dot mt-1.5 shrink-0" />
          {consequence}
        </p>
      ) : null}
    </figure>
  );
}
