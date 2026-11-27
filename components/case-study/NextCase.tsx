import { TransitionLink } from '@/components/motion/TransitionLink';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import type { OrderedProject } from '@/lib/data/projectCards';

type NextCaseProps = { next: OrderedProject; position: number; total: number };

/**
 * A full-height "next case" section. The whole thing is one link; the signal
 * colour wipes up from below on hover and focus. The project name carries its
 * view-transition name so it morphs into the next page's title.
 */
export function NextCase({ next, position, total }: NextCaseProps) {
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section aria-label="Next case study" className="relative mt-[clamp(4rem,9vw,8rem)] border-t border-surfaceBorder">
      <TransitionLink
        className="group relative flex min-h-[78svh] items-end overflow-hidden pb-[clamp(2.5rem,6vw,5rem)] pt-24"
        data-cursor="view"
        data-cursor-label="Next"
        href={`/projects/${next.project.id}`}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 translate-y-full bg-accent transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
        />
        <Container className="relative z-10 transition-colors duration-500 group-hover:text-accentFg group-focus-visible:text-accentFg">
          <div className="label flex items-center justify-between gap-6 text-textMuted transition-colors duration-500 group-hover:text-accentFg group-focus-visible:text-accentFg">
            <span>Next case</span>
            <span className="tabular-nums">
              {pad(position)} / {pad(total)}
            </span>
          </div>
          <span
            className="mt-10 block text-balance font-display text-mega font-medium text-textPrimary transition-colors duration-500 group-hover:text-accentFg group-focus-visible:text-accentFg"
            style={{ viewTransitionName: `project-title-${next.project.id}` }}
          >
            {next.project.name}
          </span>
          <span className="mt-8 flex items-end justify-between gap-6">
            <span className="max-w-md text-lead text-textSecondary transition-colors duration-500 group-hover:text-accentFg group-focus-visible:text-accentFg">
              {next.card.role}
            </span>
            <span
              aria-hidden="true"
              className="font-display text-display leading-none transition-transform duration-700 ease-out group-hover:translate-x-3"
            >
              →
            </span>
          </span>
        </Container>
      </TransitionLink>

      <Container className="flex flex-col gap-3 border-t border-surfaceBorder py-8 sm:flex-row sm:justify-between">
        <ButtonLink href="/projects" size="lg" variant="secondary">
          All case studies
        </ButtonLink>
        <ButtonLink href="/contact" size="lg">
          Start a conversation
        </ButtonLink>
      </Container>
    </section>
  );
}
