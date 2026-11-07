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
 *
 * It is a one-item description list (term = caption, details = value), which
 * is valid on its own and reads correctly to a screen reader ("Time reduction,
 * 96%"). The value is shown above the caption with flex-col-reverse, so the
 * markup order and the visual order can differ without breaking either.
 * Place it in a plain div or grid, never inside another <dl>.
 */
export function Metric({ caption, className, emphasis = false, size = 'inline', value }: MetricProps) {
  return (
    <dl className={className}>
      <div className="flex flex-col-reverse">
        <dt
          className={cn(
            'mt-3 text-small text-textSecondary',
            size === 'hero' ? 'max-w-sm' : 'max-w-[16rem]',
          )}
        >
          {caption}
        </dt>
        <dd
          className={cn(
            'font-display font-medium tabular-nums leading-none',
            size === 'hero' ? 'text-display' : 'text-h2',
            emphasis ? 'text-accent' : 'text-textPrimary',
          )}
        >
          {value}
        </dd>
      </div>
    </dl>
  );
}
