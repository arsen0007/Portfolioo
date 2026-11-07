import Link from 'next/link';
import { projects } from '@/lib/data/projects';
import { niches } from '@/lib/data/skillTree';

/**
 * A plain ledger of skills grouped by area, using native <details> so it needs
 * no client JavaScript, works with a keyboard and a screen reader out of the
 * box, and is fully readable with scripts disabled. Each skill shows its
 * evidence as visible text; nothing depends on hover.
 */
export function SkillLedger({ defaultOpenCount = 0 }: { defaultOpenCount?: number } = {}) {
  return (
    <div className="border-t border-surfaceBorder">
      {niches.map((niche, nicheIndex) => (
        <details
          className="group border-b border-surfaceBorder"
          key={niche.id}
          open={nicheIndex < defaultOpenCount}
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
            <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-display text-xl text-textPrimary">{niche.name}</span>
              <span className="text-small text-textMuted">{niche.skills.length} skills</span>
            </span>
            <span
              aria-hidden="true"
              className="text-xl leading-none text-textMuted transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>

          <ul className="pb-6">
            {niche.skills.map((skill) => {
              const evidence = projects.filter((project) => skill.evidenceProjectIds?.includes(project.id));

              return (
                <li
                  className="grid gap-x-8 gap-y-1 border-t border-surfaceBorder py-4 sm:grid-cols-[1fr_auto]"
                  key={skill.id}
                >
                  <div>
                    <p className="font-medium text-textPrimary">{skill.name}</p>
                    <p className="mt-1 max-w-prose text-small text-textSecondary">{skill.note}</p>
                    {skill.tools.length > 0 ? (
                      <p className="mt-1 text-small text-textMuted">{skill.tools.join(' · ')}</p>
                    ) : null}
                    {skill.status === 'shipped' && evidence.length > 0 ? (
                      <p className="mt-1 text-small text-textMuted">
                        Evidence:{' '}
                        {evidence.map((project, index) => (
                          <span key={project.id}>
                            {index > 0 ? ', ' : null}
                            <Link
                              className="inline-flex min-h-11 items-center text-textPrimary underline decoration-surfaceBorderStrong underline-offset-4 hover:decoration-accent"
                              href={`/projects/${project.id}`}
                            >
                              {project.name}
                            </Link>
                          </span>
                        ))}
                      </p>
                    ) : null}
                  </div>

                  <p
                    className={
                      skill.status === 'shipped'
                        ? 'text-small font-medium text-textPrimary sm:text-right'
                        : 'text-small text-textMuted sm:text-right'
                    }
                  >
                    <span aria-hidden="true">{skill.status === 'shipped' ? '● ' : '○ '}</span>
                    {skill.status === 'shipped' ? 'Shipped' : 'Applied'}
                  </p>
                </li>
              );
            })}
          </ul>
        </details>
      ))}
    </div>
  );
}
