import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Section';
import { ProjectRow } from '@/components/work/ProjectRow';
import { getOrderedProjects, type OrderedProject } from '@/lib/data/projectCards';

type Group = {
  id: string;
  title: string;
  note?: string;
  items: OrderedProject[];
};

export default function ProjectsPage() {
  const ordered = getOrderedProjects();

  const groups: Group[] = [
    {
      id: 'systems',
      title: 'Systems',
      items: ordered.filter(({ project }) => project.tier === 1 && !project.kind),
    },
    {
      id: 'competition',
      title: 'Competitions and challenges',
      note: 'A winning entry in a time-boxed competition or challenge is a different kind of thing from a production system, so these are shown on their own.',
      items: ordered.filter(({ project }) => project.kind === 'competition'),
    },
    {
      id: 'also-shipped',
      title: 'Also shipped',
      items: ordered.filter(({ project }) => project.tier > 1 && !project.kind),
    },
  ].filter((group) => group.items.length > 0);

  // Numbering runs across the groups so every project has one stable number.
  let position = 0;

  return (
    <main className="pb-[clamp(3.5rem,9vw,7.5rem)]">
      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { label: 'Projects' },
        ]}
      />

      <Container className="pt-8 md:pt-12">
        <header className="max-w-3xl">
          <Eyebrow>Work · {ordered.length} case studies</Eyebrow>
          <h1 className="mt-4 text-balance font-display text-h1 text-textPrimary">
            Built to be used. Not demoed.
          </h1>
          <p className="mt-6 text-lead text-textSecondary">
            Each case study covers the problem, the product decisions, what those decisions
            cost, and the measured outcome.
          </p>
        </header>

        {groups.map((group) => (
          <section aria-labelledby={`group-${group.id}`} className="mt-16 md:mt-20" key={group.id}>
            <h2 className="text-small font-medium text-textMuted" id={`group-${group.id}`}>
              {group.title}
            </h2>
            {group.note ? <p className="mt-2 max-w-xl text-small text-textMuted">{group.note}</p> : null}

            <ol className="mt-4">
              {group.items.map(({ card, project }) => {
                position += 1;

                return (
                  <ProjectRow
                    card={card}
                    index={position}
                    key={project.id}
                    project={project}
                    variant="full"
                  />
                );
              })}
            </ol>
          </section>
        ))}

        <div className="mt-20 border-t border-surfaceBorder pt-10">
          <p className="font-display text-h3 text-textPrimary">
            Have a workflow that should be a system?
          </p>
          <ButtonLink className="mt-5" href="/contact" size="lg">
            Let&apos;s talk
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}
