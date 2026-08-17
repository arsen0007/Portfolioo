import Link from 'next/link';
import { RevealArticle, RevealDiv, RevealSection } from '@/components/ui/Reveal';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { colorMix, themeColors } from '@/lib/constants/colors';
import { projects, type Project } from '@/lib/data/projects';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { delay, duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
});

/** Short, scannable card copy — the full story lives on each case study page. */
const cardCopy: Record<string, { line: string; role: string; tag?: string }> = {
  barhunter: {
    role: 'Lead sourcing engine',
    line: 'Attorney profiles scraped from bar registries across the US and Canada — normalized, conflict-checked, and campaign-ready in under 60 seconds.',
  },
  casewise: {
    role: 'AI legal intake',
    line: 'An AI pipeline that replaced manual case processing — CEO-sponsored, CTO-backed for core-system integration.',
  },
  mailmerge: {
    role: 'Outreach preparation',
    line: 'Bulk data cleanup that non-technical teammates can run before every campaign send. Unglamorous, still in daily use.',
  },
  fhoneman: {
    role: 'Client launch',
    line: 'A repair business with no online presence, turned into a live booking workflow with urgent and standard inquiry paths.',
  },
  'arsens-lab': {
    role: 'Self-hosted AI infrastructure',
    line: 'Six MCP servers, agents, workflows, and a control plane — fourteen services on a Raspberry Pi that give an AI model real hardware to work with. Building it was the easy half.',
    tag: 'MCP · systemd · Raspberry Pi',
  },
  genie: {
    role: 'Agent runtime on hardware',
    line: 'Not a wrapper around an API — a complete agent runtime built from scratch. Dispatch pipeline, memory, multi-LLM routing, and 19 voice skills running on a Raspberry Pi.',
    tag: 'Physical build · Raspberry Pi · Open source',
  },
};

function StatusBadge({ project }: { project: Project }) {
  if (project.status === 'active' && !project.confidential) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
        style={{
          borderColor: colorMix(themeColors.cyan, 30),
          background: colorMix(themeColors.cyan, 10),
          color: themeColors.cyan,
        }}
      >
        <span
          aria-hidden="true"
          className="available-pulse h-1.5 w-1.5 rounded-full"
          style={{ background: themeColors.cyan, boxShadow: `0 0 8px ${themeColors.cyan}` }}
        />
        Active
      </span>
    );
  }

  if (project.confidential) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
        style={{
          borderColor: colorMix(themeColors.amber, 30),
          background: colorMix(themeColors.amber, 10),
          color: themeColors.amber,
        }}
      >
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: themeColors.amber, boxShadow: `0 0 8px ${themeColors.amber}` }}
        />
        Confidential · Still in progress
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
      style={{
        borderColor: colorMix(themeColors.green, 30),
        background: colorMix(themeColors.green, 10),
        color: themeColors.green,
      }}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full available-pulse"
        style={{ background: themeColors.green, boxShadow: `0 0 8px ${themeColors.green}` }}
      />
      Live
    </span>
  );
}

function ProjectCard({ project, featured, delay }: { project: Project; featured: boolean; delay: number }) {
  const accent = themeColors[project.color];
  const copy = cardCopy[project.id];
  const metrics = project.impact.slice(0, featured ? 4 : 2);
  const stack = project.techStack.slice(0, featured ? 6 : 4);

  return (
    <RevealArticle className="h-full" {...fadeUp(delay)}>
      <Link
        aria-label={`${project.name} case study`}
        className="bento-card group flex h-full flex-col p-7 transition-transform duration-200 hover:-translate-y-0.5 md:p-8"
        href={`/projects/${project.id}`}
        style={{
          borderColor: colorMix(accent, 24),
          background: `radial-gradient(ellipse 90% 55% at 50% 0%, ${colorMix(accent, featured ? 12 : 9)}, transparent 70%), var(--surface)`,
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: accent }}>
            {copy.role}
          </span>
          <StatusBadge project={project} />
        </div>

        <h2
          className={`mt-5 font-display font-semibold leading-tight text-textPrimary ${
            featured ? 'text-[30px] md:text-[36px]' : 'text-[24px]'
          }`}
        >
          {project.name}
        </h2>
        {copy.tag ? (
          <p
            className="mt-2.5 font-mono text-[9px] uppercase tracking-[0.14em]"
            style={{ color: colorMix(accent, 72) }}
          >
            {copy.tag}
          </p>
        ) : null}
        <p className="mt-3 max-w-[560px] font-body text-[14px] leading-[1.8] text-textSecondary">
          {copy.line}
        </p>

        <div className={`mt-6 grid gap-3 ${featured ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'}`}>
          {metrics.map((metric) => (
            <div
              className="rounded-[12px] border p-3.5"
              key={metric.label}
              style={{ borderColor: colorMix(accent, 18), background: colorMix(accent, 6) }}
            >
              <p className="font-display text-[20px] font-semibold leading-none" style={{ color: accent }}>
                {metric.value}
              </p>
              <p className="mt-2 font-mono text-[9.5px] uppercase leading-snug tracking-[0.08em] text-textMuted">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <div className="mt-6 flex flex-wrap gap-1.5">
            {stack.map((tech) => (
              <span className="tech-badge" key={tech}>
                {tech}
              </span>
            ))}
          </div>

          <div
            className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-all duration-200 group-hover:gap-3"
            style={{ color: accent }}
          >
            Read case study
            <svg
              aria-hidden="true"
              fill="none"
              height="12"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
              viewBox="0 0 12 12"
              width="12"
            >
              <path d="M2 6h8M6 2l4 4-4 4" />
            </svg>
          </div>
        </div>
      </Link>
    </RevealArticle>
  );
}

export default function ProjectsPage() {
  const featured = projects.filter((project) => project.tier === 1 && !project.kind);
  const competition = projects.find((project) => project.kind === 'competition');
  const supporting = projects.filter((project) => project.tier > 1 && !project.kind);

  return (
    <main className="dot-grid relative min-h-screen overflow-hidden pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 70% 36% at 50% 0%, color-mix(in srgb, var(--green) 13%, transparent), transparent)',
            'radial-gradient(ellipse 44% 40% at 4% 55%, color-mix(in srgb, var(--blue) 11%, transparent), transparent)',
            'radial-gradient(ellipse 44% 40% at 96% 85%, color-mix(in srgb, var(--purple) 10%, transparent), transparent)',
          ].join(', '),
        }}
      />

      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { label: 'Projects' },
        ]}
      />

      <section className="relative mx-auto max-w-6xl px-6 pt-12">
        <RevealDiv className="max-w-2xl" {...fadeUp(0)}>
          <p className="font-mono text-[10px] font-normal uppercase tracking-[0.16em] text-textMuted">
            Systems · {projects.length} case studies
          </p>
          <h1 className="mt-4 text-balance font-display text-[34px] font-medium leading-tight text-textPrimary md:text-[44px]">
            Built to be used. Not demoed.
          </h1>
          <p className="mt-5 max-w-[560px] font-body text-[15px] leading-[1.8] text-textSecondary md:text-base">
            Every system here runs in production, inside a real workflow, with real users. Each case
            study covers the problem, the product decisions, and the measured outcome.
          </p>
        </RevealDiv>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {featured.map((project, index) => (
            <ProjectCard delay={0.08 + index * 0.08} featured key={project.id} project={project} />
          ))}
        </div>

        {/* Competition — a 24h build is a different kind of thing from a
            production system, so it is presented separately rather than
            ranked against one. */}
        {competition ? (
          <RevealSection className="mt-4" {...fadeUp(0.2)}>
            <Link
              className="group relative block overflow-hidden rounded-[18px] border p-7 transition-transform duration-200 hover:-translate-y-0.5 md:p-8"
              href={`/projects/${competition.id}`}
              style={{
                borderColor: colorMix(themeColors.amber, 26),
                background: `radial-gradient(ellipse 60% 100% at 100% 0%, ${colorMix(themeColors.amber, 13)}, transparent 62%), var(--surface)`,
              }}
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-[640px]">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                      style={{
                        borderColor: colorMix(themeColors.amber, 34),
                        background: colorMix(themeColors.amber, 11),
                        color: themeColors.amber,
                      }}
                    >
                      Global winner
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-textMuted">
                      ClearRoute x Le Mans 24h Hackathon
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-[26px] font-semibold leading-tight text-textPrimary md:text-[30px]">
                    {competition.name}
                  </h2>
                  <p className="mt-3 font-body text-[14px] leading-[1.8] text-textSecondary">
                    Real-time failure prediction for endurance racing, built in 24 hours by
                    a team of five. It won because of the output, not the model: it predicts{' '}
                    <strong className="font-semibold text-textPrimary">
                      laps-to-failure
                    </strong>{' '}
                    rather than a probability — a lap count is already a decision.
                  </p>
                </div>

                <span
                  className="inline-flex shrink-0 items-center gap-2 font-body text-[14px] font-medium transition-all duration-200 group-hover:gap-3"
                  style={{ color: themeColors.amber }}
                >
                  Read the case study
                  <svg
                    aria-hidden="true"
                    fill="none"
                    height="13"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                    viewBox="0 0 13 13"
                    width="13"
                  >
                    <path d="M2.5 6.5h8M6.5 2.5l4 4-4 4" />
                  </svg>
                </span>
              </div>
            </Link>
          </RevealSection>
        ) : null}

        {/* Also shipped — real work, deliberately not invited into comparison
            with the systems above. */}
        <RevealSection className="mt-12" {...fadeUp(0.24)}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-textMuted">
            Also shipped
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {supporting.map((project) => {
              const accent = themeColors[project.color];

              return (
                <Link
                  className="group flex items-center justify-between gap-4 rounded-[14px] border px-5 py-4 transition-colors duration-200"
                  href={`/projects/${project.id}`}
                  key={project.id}
                  style={{
                    borderColor: 'var(--surface-border)',
                    background: 'color-mix(in srgb, var(--surface) 60%, transparent)',
                  }}
                >
                  <span>
                    <span className="block font-display text-[15px] font-semibold text-textPrimary">
                      {project.name}
                    </span>
                    <span className="mt-1 block font-body text-[12.5px] leading-snug text-textMuted">
                      {cardCopy[project.id]?.role}
                    </span>
                  </span>
                  <svg
                    aria-hidden="true"
                    className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                    fill="none"
                    height="13"
                    stroke={accent}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                    viewBox="0 0 13 13"
                    width="13"
                  >
                    <path d="M2.5 6.5h8M6.5 2.5l4 4-4 4" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </RevealSection>

        <RevealDiv className="mt-10" {...fadeUp(0.3)}>
          <Link
            className="group inline-flex items-center gap-3 rounded-full border px-5 py-3 font-body text-[14px] font-medium text-textSecondary transition-colors duration-200 hover:text-textPrimary"
            href="/contact"
            style={{ borderColor: 'var(--surface-border)', background: 'color-mix(in srgb, var(--surface) 70%, transparent)' }}
          >
            <span
              aria-hidden="true"
              className="grid h-6 w-6 place-items-center rounded-full border"
              style={{ borderColor: colorMix(themeColors.green, 34), background: colorMix(themeColors.green, 10) }}
            >
              <span
                className="available-pulse h-1.5 w-1.5 rounded-full"
                style={{ background: themeColors.green, boxShadow: `0 0 8px ${themeColors.green}` }}
              />
            </span>
            Have a workflow that should be a system? Let&apos;s talk
            <svg
              aria-hidden="true"
              fill="none"
              height="12"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
              viewBox="0 0 12 12"
              width="12"
            >
              <path d="M2 6h8M6 2l4 4-4 4" />
            </svg>
          </Link>
        </RevealDiv>
      </section>
    </main>
  );
}
