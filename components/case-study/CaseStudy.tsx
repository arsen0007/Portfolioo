import Link from 'next/link';
import type { ReactNode } from 'react';
import { CaseStudyBlockView } from '@/components/case-study/CaseStudyBlocks';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Metric } from '@/components/ui/Metric';
import { Eyebrow, Section } from '@/components/ui/Section';
import { Split } from '@/components/ui/Split';
import type { CaseStudyContent } from '@/lib/data/caseStudies';
import type { Project } from '@/lib/data/projects';
import { getOrderedProjects, type ProjectCard } from '@/lib/data/projectCards';
import { cn } from '@/lib/utils';

type CaseStudyProps = {
  project: Project;
  card: ProjectCard;
  content: CaseStudyContent;
  /** Project-specific dynamic content (e.g. live figures), rendered after the blocks. */
  extras?: ReactNode;
};

function liveLabel(url: string): string {
  return url.includes('github.com') ? 'View the source on GitHub ↗' : 'Visit the live site ↗';
}

/**
 * One layout for every case study. Standard sections come from the structured
 * `story` data in lib/data/projects.ts; anything specific to a project goes in
 * its `blocks` (lib/data/caseStudies), so adding or editing a case study never
 * means touching layout code.
 */
export function CaseStudy({ card, content, extras, project }: CaseStudyProps) {
  const { story } = project;
  const ordered = getOrderedProjects();
  const position = ordered.findIndex((item) => item.project.id === project.id);
  const next = ordered[(position + 1) % ordered.length];

  return (
    <main className="pb-[clamp(2rem,5vw,4rem)]">
      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { href: '/projects', label: 'Work' },
          { label: project.name },
        ]}
      />

      <Container className="pt-8 md:pt-12">
        <header className="max-w-4xl">
          <Eyebrow>{card.role}</Eyebrow>
          <h1 className="mt-4 text-balance font-display text-display text-textPrimary">
            {project.name}
          </h1>
          <p className="mt-6 max-w-3xl text-lead text-textSecondary">{project.tagline}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-2 text-small text-textSecondary">
              <span
                aria-hidden="true"
                className={cn(
                  'h-2 w-2 rounded-full',
                  card.statusTone === 'live' ? 'bg-success' : 'bg-surfaceBorderStrong',
                )}
              />
              {card.statusLabel}
            </span>
            {project.liveUrl ? (
              <ButtonLink href={project.liveUrl} variant="link">
                {liveLabel(project.liveUrl)}
              </ButtonLink>
            ) : null}
          </div>
        </header>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-surfaceBorder pt-8 lg:grid-cols-4">
          {project.impact.map((metric) => (
            <Metric caption={metric.label} key={metric.label} value={metric.value} />
          ))}
        </div>
      </Container>

      <div className="mt-[clamp(3.5rem,9vw,7.5rem)]">
        <Split eyebrow="Overview" title="Role and scope">
          <dl className="border-t border-surfaceBorder">
            {[
              ['Role', story.role],
              ['Scope', story.scope],
              ['Stack', project.techStack.join(' · ')],
            ].map(([label, value]) => (
              <div
                className="grid gap-1 border-b border-surfaceBorder py-4 sm:grid-cols-[8rem_1fr] sm:gap-8"
                key={label}
              >
                <dt className="text-small font-medium text-textMuted">{label}</dt>
                <dd className="text-textSecondary">{value}</dd>
              </div>
            ))}
          </dl>
        </Split>

        <Split eyebrow="Problem" title="Why it needed building">
          <div className="max-w-prose space-y-5 text-textSecondary">
            <p>{project.problem}</p>
            <p>{story.context}</p>
          </div>
          <div className="mt-10 max-w-prose border-t border-surfaceBorder pt-6">
            <h3 className="text-small font-medium text-textMuted">The product move</h3>
            <p className="mt-2 font-display text-h3 text-textPrimary">{story.productMove}</p>
          </div>
        </Split>

        <Split eyebrow="Build" title="What I built">
          <p className="max-w-prose text-textSecondary">{project.whatIBuilt}</p>
          <ol className="mt-8 border-t border-surfaceBorder">
            {project.architecture.map((step, index) => (
              <li
                className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-surfaceBorder py-4"
                key={step}
              >
                <span className="text-small tabular-nums text-textMuted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-textPrimary">{step}</span>
              </li>
            ))}
          </ol>
        </Split>

        {content.blocks.map((block, index) => (
          <CaseStudyBlockView block={block} key={`${block.type}-${index}`} />
        ))}

        {extras}

        <Split eyebrow="Decisions" title="What I decided, and what it cost">
          <ul className="border-t border-surfaceBorder">
            {story.decisions.map((decision) => (
              <li className="border-b border-surfaceBorder py-6" key={decision.title}>
                <h3 className="font-display text-h3 text-textPrimary">{decision.title}</h3>
                <p className="mt-3 max-w-prose text-textSecondary">{decision.body}</p>
              </li>
            ))}
          </ul>
        </Split>

        <Split eyebrow="Constraints" title="What I had to work within">
          <ul className="max-w-prose list-disc space-y-3 pl-5 text-textSecondary marker:text-textMuted">
            {story.constraints.map((constraint) => (
              <li key={constraint}>{constraint}</li>
            ))}
          </ul>
        </Split>

        <Split eyebrow="Outcome" title="What happened">
          <p className="max-w-prose text-lead text-textPrimary">{story.outcome}</p>
          <ul className="mt-8 max-w-prose list-disc space-y-3 pl-5 text-textSecondary marker:text-textMuted">
            {project.proof.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </Split>

        <Section ruled>
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            {next && next.project.id !== project.id ? (
              <div>
                <p className="text-small text-textMuted">Next case study</p>
                <Link
                  className="mt-2 inline-flex min-h-11 items-center gap-3 font-display text-h2 text-textPrimary hover:text-accent"
                  href={`/projects/${next.project.id}`}
                >
                  {next.project.name}
                  <span aria-hidden="true">→</span>
                </Link>
                <p className="max-w-md text-textSecondary">{next.card.role}</p>
              </div>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/projects" size="lg" variant="secondary">
                All case studies
              </ButtonLink>
              <ButtonLink href="/contact" size="lg">
                Start a conversation
              </ButtonLink>
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
