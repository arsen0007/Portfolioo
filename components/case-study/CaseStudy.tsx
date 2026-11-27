import type { ReactNode } from 'react';
import { SceneIntentOnMount, SceneTrigger } from '@/components/canvas/SceneTrigger';
import { ArchitectureGraph } from '@/components/case-study/ArchitectureGraph';
import { ChapterRail, type Chapter } from '@/components/case-study/ChapterRail';
import { CaseStudyBlockView } from '@/components/case-study/CaseStudyBlocks';
import { DecisionGrid } from '@/components/case-study/DecisionGrid';
import { Em, EmPhrase, taglineEmphasis } from '@/components/case-study/emphasis';
import { NextCase } from '@/components/case-study/NextCase';
import { TrackOnView } from '@/components/analytics/TrackOnView';
import { Magnetic } from '@/components/motion/Magnetic';
import { Reveal } from '@/components/motion/Reveal';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Metric } from '@/components/ui/Metric';
import { Eyebrow } from '@/components/ui/Section';
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

const pad = (n: number) => String(n).padStart(2, '0');

function liveLabel(url: string): string {
  return url.includes('github.com') ? 'View the source on GitHub ↗' : 'Visit the live site ↗';
}

function ChapterSection({
  children,
  id,
  index,
  intensity,
  label,
  title,
  total,
}: {
  id: string;
  index: number;
  total: number;
  label: string;
  title: ReactNode;
  intensity: number;
  children: ReactNode;
}) {
  return (
    <SceneTrigger
      as="section"
      className="scroll-mt-[var(--header-h)] border-t border-surfaceBorder py-[clamp(3.5rem,8vw,7rem)] first:border-t-0 first:pt-0"
      id={id}
      intensity={intensity}
    >
      <Eyebrow index={pad(index)}>
        {label} <span className="text-textMuted">/ {pad(total)}</span>
      </Eyebrow>
      <Reveal as="h2" className="mt-6 max-w-[16ch] text-balance font-display text-h1 font-medium text-textPrimary">
        {title}
      </Reveal>
      <div className="mt-12 md:mt-16">{children}</div>
    </SceneTrigger>
  );
}

/**
 * One layout for every case study. Standard chapters come from the structured
 * `story` data in lib/data/projects.ts; anything specific to a project goes in
 * its `blocks` (lib/data/caseStudies), so adding or editing a case study never
 * means touching layout code.
 */
export function CaseStudy({ card, content, extras, project }: CaseStudyProps) {
  const { story } = project;
  const ordered = getOrderedProjects();
  const position = ordered.findIndex((item) => item.project.id === project.id);
  const next = ordered[(position + 1) % ordered.length];

  const chapters: Chapter[] = [
    { id: 'problem', label: 'Problem' },
    { id: 'build', label: 'What I built' },
    { id: 'decisions', label: 'Decisions' },
    { id: 'constraints', label: 'Constraints' },
    { id: 'outcome', label: 'Outcome' },
  ];
  const total = chapters.length;
  const short = project.name.length <= 10;

  const spec: { label: string; value: string; span: string }[] = [
    { label: 'Role', value: story.role, span: 'md:col-span-3' },
    { label: 'Scope', value: story.scope, span: 'md:col-span-4' },
    { label: 'Stack', value: project.techStack.join(' · '), span: 'md:col-span-5' },
  ];

  return (
    <main className="pb-0">
      <SceneIntentOnMount layout="right" shape={`project:${project.id}`} signal={0.5} />
      <TrackOnView event="case_study_view" params={{ project: project.id }} when="mount" />

      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { href: '/projects', label: 'Work' },
          { label: project.name },
        ]}
      />

      <Container className="pt-8 md:pt-12">
        <header>
          <div className="label flex items-center justify-between gap-6 border-b border-surfaceBorder pb-4 text-textMuted">
            <span className="tabular-nums">
              <span className="text-accent">Case {pad(position + 1)}</span> / {pad(ordered.length)}
            </span>
            <span>{card.role}</span>
          </div>

          <h1
            className={cn(
              'mt-10 text-balance font-display font-medium text-textPrimary md:mt-14',
              short ? 'text-mega' : 'text-display',
            )}
            style={{ viewTransitionName: `project-title-${project.id}` }}
          >
            {project.name}
          </h1>

          <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:gap-x-12">
            <Reveal
              as="p"
              className="text-lead text-textSecondary md:col-span-7"
              delay={0.2}
              immediate
              mode="fade"
            >
              <EmPhrase phrase={taglineEmphasis[project.id]} text={project.tagline} />
            </Reveal>

            <div className="flex flex-col items-start gap-5 md:col-span-4 md:col-start-9">
              <span className="label inline-flex items-center gap-3 text-textSecondary">
                {card.statusTone === 'live' ? (
                  <span aria-hidden="true" className="live-dot shrink-0" />
                ) : (
                  <span aria-hidden="true" className="h-[7px] w-[7px] shrink-0 rounded-full border border-textMuted" />
                )}
                {card.statusLabel}
              </span>
              {project.liveUrl ? (
                <Magnetic>
                  <ButtonLink href={project.liveUrl} size="lg">
                    {liveLabel(project.liveUrl)}
                  </ButtonLink>
                </Magnetic>
              ) : null}
            </div>
          </div>

          <dl className="mt-14 grid border-t border-surfaceBorder md:mt-20 md:grid-cols-12">
            {spec.map((item) => (
              <div className={cn('border-b border-surfaceBorder py-5 md:py-6 md:pr-8', item.span)} key={item.label}>
                <dt className="label text-textMuted">{item.label}</dt>
                <dd className="mt-2 text-small text-textPrimary md:text-base">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div
            className={cn(
              'grid grid-cols-2 border-b border-surfaceBorder',
              project.impact.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
            )}
          >
            {project.impact.map((metric, i) => (
              <div
                className={cn(
                  'py-8 md:py-10',
                  i % 2 === 1 && 'border-l border-surfaceBorder pl-5',
                  i > 0 && 'lg:border-l lg:border-surfaceBorder lg:pl-8',
                  i >= 2 && 'border-t border-surfaceBorder lg:border-t-0',
                  i % 2 === 0 && i > 0 && 'pl-0',
                )}
                key={metric.label}
              >
                <Metric caption={metric.label} value={metric.value} />
              </div>
            ))}
          </div>
        </header>
      </Container>

      <Container className="mt-[clamp(4rem,9vw,8rem)]">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <aside className="hidden lg:col-span-2 lg:block">
            <ChapterRail chapters={chapters} />
          </aside>

          <div className="lg:col-span-9 lg:col-start-4">
            <ChapterSection
              id="problem"
              index={1}
              intensity={0.35}
              label="Problem"
              title={
                <>
                  Why it needed <Em>building</Em>
                </>
              }
              total={total}
            >
              <div className="max-w-prose space-y-6 text-lead text-textSecondary">
                <p className="text-textPrimary">{project.problem}</p>
                <p>{story.context}</p>
              </div>
              <div className="mt-14 border-t border-surfaceBorder pt-8 md:mt-20">
                <p className="label text-accent">The product move</p>
                <p className="mt-5 max-w-[34ch] text-balance font-display text-h3 font-medium text-textPrimary">
                  {story.productMove}
                </p>
              </div>
            </ChapterSection>

            <ChapterSection
              id="build"
              index={2}
              intensity={0.4}
              label="What I built"
              title={
                <>
                  What I <Em>built</Em>
                </>
              }
              total={total}
            >
              <p className="max-w-prose text-lead text-textSecondary">{project.whatIBuilt}</p>

              <div className="mt-16 md:mt-20">
                <p className="label mb-8 text-textMuted">Architecture</p>
                <ArchitectureGraph steps={project.architecture} />
              </div>

              {content.blocks.map((block, index) => (
                <CaseStudyBlockView block={block} key={`${block.type}-${index}`} />
              ))}

              {extras}
            </ChapterSection>

            <ChapterSection
              id="decisions"
              index={3}
              intensity={0.35}
              label="Decisions"
              title={
                <>
                  What I decided, and what it <Em>cost</Em>
                </>
              }
              total={total}
            >
              <DecisionGrid decisions={story.decisions} />
            </ChapterSection>

            <ChapterSection
              id="constraints"
              index={4}
              intensity={0.35}
              label="Constraints"
              title={
                <>
                  What I had to work <Em>within</Em>
                </>
              }
              total={total}
            >
              <ul className="border-t border-surfaceBorder">
                {story.constraints.map((constraint, i) => (
                  <li
                    className="grid grid-cols-[2.75rem_1fr] gap-x-4 border-b border-surfaceBorder py-6 md:grid-cols-[4rem_1fr] md:gap-x-8"
                    key={constraint}
                  >
                    <span className="label pt-1 tabular-nums text-textMuted">C.{pad(i + 1)}</span>
                    <span className="max-w-prose text-lead text-textSecondary">{constraint}</span>
                  </li>
                ))}
              </ul>
            </ChapterSection>

            <ChapterSection
              id="outcome"
              index={5}
              intensity={0.6}
              label="Outcome"
              title={
                <>
                  What <Em>happened</Em>
                </>
              }
              total={total}
            >
              <p className="max-w-[34ch] text-balance font-display text-h3 font-medium text-textPrimary">
                {story.outcome}
              </p>
              <ul className="mt-14 border-t border-surfaceBorder">
                {project.proof.map((line, i) => (
                  <li
                    className="grid grid-cols-[2.75rem_1fr] gap-x-4 border-b border-surfaceBorder py-6 md:grid-cols-[4rem_1fr] md:gap-x-8"
                    key={line}
                  >
                    <span className="label pt-1 tabular-nums text-accent">{pad(i + 1)}</span>
                    <span className="max-w-prose text-textSecondary">{line}</span>
                  </li>
                ))}
              </ul>
            </ChapterSection>
          </div>
        </div>
      </Container>

      {/* Reaching the end of the story counts as a full read. */}
      <TrackOnView event="case_study_complete" params={{ project: project.id }} />
      {next && next.project.id !== project.id ? (
        <NextCase next={next} position={((position + 1) % ordered.length) + 1} total={ordered.length} />
      ) : null}
    </main>
  );
}
