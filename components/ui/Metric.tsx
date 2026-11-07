import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type MetricProps = {
  value: string;
  caption: ReactNode;
  /** `hero` is the one big number on a screen; `inline` sits in a row of facts. */
  size?: 'hero' | 'inline';
  /** The single accent-coloured figure on a screen. */
  emphasis?: boolean;
  className?: string;
};

/**
 * A number set in the display serif with its denominator underneath. A number
 * without a denominator ("40% faster") is unfalsifiable, so the caption is
 * required.
 */
export function Metric({ caption, className, emphasis = false, size = 'inline', value }: MetricProps) {
  return (
    <div className={className}>
      <p
        className={cn(
          'font-display font-medium tabular-nums leading-none',
          size === 'hero' ? 'text-display' : 'text-h2',
          emphasis ? 'text-accent' : 'text-textPrimary',
        )}
      >
        {value}
      </p>
      <p className={cn('mt-3 text-textSecondary', size === 'hero' ? 'max-w-sm text-small' : 'max-w-[16rem] text-small')}>
        {caption}
      </p>
    </div>
  );
}
