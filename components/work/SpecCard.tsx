import type { WorkItem } from '@/components/work/workItems';
import { cn } from '@/lib/utils';

/**
 * The designed stand-in for a screenshot: a mono spec sheet carrying the
 * project's headline metric. Used in the list preview and the grid.
 */
export function SpecCard({ className, item, total }: { item: WorkItem; total: number; className?: string }) {
  return (
    <div
      className={cn(
        'blueprint relative flex h-full w-full flex-col justify-between overflow-hidden bg-surfaceRaised p-5 text-textPrimary',
        className,
      )}
    >
      <div className="label flex items-center justify-between text-textMuted">
        <span>
          Spec <span className="text-accent">{String(item.index).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
        </span>
        <span>{item.kind === 'competition' ? 'Competition' : item.live ? 'Live' : 'Build'}</span>
      </div>
      <div>
        <p className="font-display text-[clamp(2.75rem,5vw,4.25rem)] font-medium leading-none tracking-[-0.05em] tabular-nums">
          {item.metric.value}
        </p>
        <p className="label mt-3 max-w-[22ch] text-textSecondary">{item.metric.label}</p>
      </div>
      <p className="label border-t border-surfaceBorderStrong pt-3 text-textMuted">{item.stack.slice(0, 3).join(' · ')}</p>
    </div>
  );
}
