import Link from 'next/link';
import { projects } from '@/lib/data/projects';
import { niches } from '@/lib/data/skillTree';

const two = (n: number) => String(n).padStart(2, '0');

/**
 * The skill ledger as a hardware-style spec sheet: dense, mono, tabular. Native
 * <details> keeps it free of client JavaScript, keyboard and screen-reader
 * friendly, and fully readable with scripts disabled. Every skill shows its
 * evidence as visible text; nothing depends on hover.
 */
export function SkillLedger({ defaultOpenCount = 0 }: { defaultOpenCount?: number } = {}) {
  return (
    <div className="border-t border-surfaceBorderStrong font-mono">
      <div
        aria-hidden="true"
        className="label hidden grid-cols-[4.5rem_minmax(0,1.1fr)_minmax(0,1.5fr)_6.5rem] gap-x-6 border-b border-surfaceBorder py-2 text-textMuted lg:grid"
      >
        <span>Ref</span>
        <span>Skill</span>
        <span>Spec / tools / evidence</span>
        <span className="text-right">Status</span>
      </div>

      {niches.map((niche, nicheIndex) => {
        const shipped = niche.skills.filter((skill) => skill.status === 'shipped').length;
        return (
          <details
            className="group border-b border-surfaceBorder"
            key={niche.id}
            open={nicheIndex < defaultOpenCount}
          >
            <summary className="flex min-h-14 cursor-pointer list-none items-center gap-x-6 py-3 transition-colors duration-300 hover:bg-surface [&::-webkit-details-marker]:hidden">
              <span className="label w-10 shrink-0 pl-1 text-accent sm:w-[4.5rem]">{two(nicheIndex + 1)}.00</span>
              <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-5 gap-y-1">
                <span className="font-display text-lg font-medium tracking-[-0.02em] text-textPrimary sm:text-xl">
                  {niche.name}
                </span>
                <span className="label text-textMuted">
                  {two(niche.skills.length)} skills · {two(shipped)} shipped
                </span>
              </span>
              <span
                aria-hidden="true"
                className="pr-2 text-xl leading-none text-textMuted transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>

            <ul className="pb-4">
              {niche.skills.map((skill, skillIndex) => {
                const evidence = projects.filter((project) => skill.evidenceProjectIds?.includes(project.id));
                const isShipped = skill.status === 'shipped';

                return (
                  <li
                    className="grid gap-x-6 gap-y-2 border-t border-dashed border-surfaceBorder py-3 text-[0.8125rem] leading-[1.55] lg:grid-cols-[4.5rem_minmax(0,1.1fr)_minmax(0,1.5fr)_6.5rem]"
                    key={skill.id}
                  >
                    <span aria-hidden="true" className="label pl-1 text-textMuted">
                      {two(nicheIndex + 1)}.{two(skillIndex + 1)}
                    </span>

                    <p className="font-body text-base font-medium leading-snug tracking-[-0.01em] text-textPrimary">
                      {skill.name}
                    </p>

                    <div className="space-y-1.5 text-textSecondary">
                      <p>{skill.note}</p>
                      {skill.tools.length > 0 ? (
                        <p className="text-textMuted">
                          <span className="text-textSecondary">TOOLS</span> {skill.tools.join(' / ')}
                        </p>
                      ) : null}
                      {isShipped && evidence.length > 0 ? (
                        <p className="flex flex-wrap items-center gap-x-4 text-textMuted">
                          <span className="text-textSecondary">EVIDENCE</span>
                          {evidence.map((project) => (
                            <Link
                              className="inline-flex min-h-8 items-center text-textPrimary underline decoration-surfaceBorderStrong underline-offset-4 transition-colors hover:decoration-accent"
                              href={`/projects/${project.id}`}
                              key={project.id}
                            >
                              {project.name} →
                            </Link>
                          ))}
                        </p>
                      ) : null}
                    </div>

                    <p
                      className={
                        isShipped
                          ? 'label flex items-start gap-2 text-textPrimary lg:justify-end'
                          : 'label flex items-start gap-2 text-textMuted lg:justify-end'
                      }
                    >
                      <span
                        aria-hidden="true"
                        className={
                          isShipped
                            ? 'mt-[0.3rem] inline-block h-2 w-2 bg-textPrimary'
                            : 'mt-[0.3rem] inline-block h-2 w-2 border border-textMuted'
                        }
                      />
                      {isShipped ? 'Shipped' : 'Applied'}
                    </p>
                  </li>
                );
              })}
            </ul>
          </details>
        );
      })}
    </div>
  );
}
