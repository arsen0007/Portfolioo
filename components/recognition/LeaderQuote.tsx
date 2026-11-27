import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

type LeaderQuoteProps = {
  children: ReactNode;
  attribution: ReactNode;
  /** What the person did next, which matters more than what they said. */
  consequence?: ReactNode;
  size?: 'xl' | 'lg';
  className?: string;
};

/** A leadership quote set in Instrument Serif at display size. */
export function LeaderQuote({ attribution, children, className, consequence, size = 'lg' }: LeaderQuoteProps) {
  return (
    <figure className={className}>
      <Reveal
        as="blockquote"
        className={cn(
          'text-pretty font-serif leading-[1.08] tracking-[-0.015em] text-textPrimary',
          size === 'xl' ? 'text-[clamp(2.2rem,1.1rem+4.6vw,5.5rem)]' : 'text-[clamp(1.6rem,1.1rem+1.9vw,2.8rem)]',
        )}
        mode="fade"
      >
        <p>
          <span aria-hidden="true">“</span>
          {children}
          <span aria-hidden="true">”</span>
        </p>
      </Reveal>
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
