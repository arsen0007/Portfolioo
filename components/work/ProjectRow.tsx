import Link from 'next/link';
import type { Project } from '@/lib/data/projects';
import type { ProjectCard } from '@/lib/data/projectCards';
import { cn } from '@/lib/utils';

type ProjectRowProps = {
  /** 1-based position, shown as a two-digit index. */
  index: number;
  project: Project;
  card: ProjectCard;
  /** `compact` for the home page, `full` adds metrics and stack. */
  variant?: 'compact' | 'full';
};

function StatusText({ card }: { card: ProjectCard }) {
  return (
    <span className="inline-flex items-center gap-2 text-small text-textSecondary">
      <span
        aria-hidden="true"
        className={cn(
          'h-2 w-2 shrink-0 rounded-full',
          card.statusTone === 'live' ? 'bg-success' : 'bg-surfaceBorderStrong',
        )}
      />
      {card.statusLabel}
    </span>
  );
}

/**
 * One project in a ruled list. The whole row is the link, so the tap target is
 * the full width of the row rather than a small arrow.
 */
export function ProjectRow({ card, index, project, variant = 'compact' }: ProjectRowProps) {
  const metrics = project.impact.slice(0, 3);
  const stack = project.techStack.slice(0, 5);

  return (
    <li className="border-t border-surfaceBorder last:border-b">
      <Link
        className="group grid grid-cols-[2rem_1fr] gap-x-4 gap-y-3 py-7 sm:grid-cols-[3rem_1fr_auto] sm:gap-x-6 md:py-9"
        href={`/projects/${project.id}`}
      >
        <span className="pt-2 text-small tabular-nums text-textMuted">
          {String(index).padStart(2, '0')}
        </span>

        <div className="min-w-0">
          <h3 className="font-display text-h3 text-textPrimary transition-colors duration-200 group-hover:text-accent">
            {project.name}
          </h3>
          <p className="mt-1 text-small text-textMuted">{card.role}</p>
          <p className="mt-3 max-w-prose text-textSecondary">{card.line}</p>

          {variant === 'full' ? (
            <>
              <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                {metrics.map((metric) => (
                  <div className="flex flex-col-reverse" key={metric.label}>
                    <dt className="mt-1 text-small text-textMuted">{metric.label}</dt>
                    <dd className="font-display text-xl font-medium tabular-nums text-textPrimary">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-small text-textMuted">{stack.join(' · ')}</p>
            </>
          ) : null}
        </div>

        <div className="col-start-2 flex items-center gap-4 sm:col-start-3 sm:flex-col sm:items-end sm:gap-6 sm:pt-2">
          <StatusText card={card} />
          <span
            aria-hidden="true"
            className="text-textMuted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent"
          >
            →
          </span>
        </div>
      </Link>
    </li>
  );
}
