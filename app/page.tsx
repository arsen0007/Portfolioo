import { CaseWiseFigure } from '@/components/home/CaseWiseFigure';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Figure } from '@/components/ui/Figure';
import { Metric } from '@/components/ui/Metric';
import { Quote } from '@/components/ui/Quote';
import { Eyebrow, Section } from '@/components/ui/Section';
import { ProjectRow } from '@/components/work/ProjectRow';
import { bridgePillars, heroCredentials } from '@/lib/data/home';
import { getOrderedProjects } from '@/lib/data/projectCards';
import { recognition } from '@/lib/data/recognition';

const ceo = recognition.leadershipTier.find((person) => person.id === 'ceo');

/* ─────────────────────────── Hero ─────────────────────────── */

function Hero() {
  return (
    <section className="pb-[clamp(3.5rem,9vw,7.5rem)] pt-[calc(var(--header-h)+2.5rem)] md:pt-[calc(var(--header-h)+4rem)]">
      <Container>
        <Eyebrow>AI product builder · Bengaluru</Eyebrow>

        <h1 className="mt-5 max-w-4xl text-balance font-display text-display text-textPrimary">
          I build AI systems for work I used to do by hand.
        </h1>

        {/* Source order is the mobile order: the promise, the actions, then the
            proof. On desktop the number sits beside the copy. */}
        <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="max-w-prose text-lead text-textSecondary">
              Years inside clinical, legal and sales operations taught me where the hours
              actually go. Then I learned to build. Now I ship AI into the tools those teams
              already use.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/projects" size="lg">
                See the work
              </ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="secondary">
                Contact
              </ButtonLink>
            </div>
          </div>

          <Metric
            caption="hours a month saved for a seven-person legal team. The CTO has backed building it into the company's core platform."
            className="lg:col-span-5 lg:col-start-8"
            emphasis
            size="hero"
            value="433"
          />
        </div>

        <div className="mt-14 lg:mt-20">
          <CaseWiseFigure />
        </div>

        <ul className="mt-14 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          {heroCredentials.map((credential) => (
            <li
              className="border-t border-surfaceBorder pt-4 text-small text-textSecondary"
              key={credential}
            >
              {credential}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ────────────────────── The handoff (thesis) ────────────────────── */

function Handoff() {
  return (
    <Section id="approach" ruled>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow>How I work</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-h2 text-textPrimary">
            Most AI projects die in the handoff.
          </h2>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <p className="text-lead text-textSecondary">
            Engineers build what the brief asks for. Operators write briefs from what they
            already know. The system that would have worked sits in the gap between them, and
            nobody owns that gap. What follows is the same three steps done by one person. Not
            because that scales, but because it is the only way I have found to keep the
            problem intact all the way from the queue to production.
          </p>

          <ol className="mt-12 border-t border-surfaceBorder">
            {bridgePillars.map((pillar, index) => (
              <li
                className="grid gap-3 border-b border-surfaceBorder py-8 sm:grid-cols-[9rem_1fr] sm:gap-8"
                key={pillar.id}
              >
                <p className="text-small font-medium text-textMuted">
                  {index + 1}. {pillar.role}
                </p>
                <div>
                  <h3 className="font-display text-h3 text-textPrimary">{pillar.claim}</h3>
                  <p className="mt-3 text-textSecondary">{pillar.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="mt-16 max-w-3xl text-balance font-display text-h2 text-textSecondary lg:mt-24">
        CaseWise exists because I spent years doing legal intake{' '}
        <span className="text-textPrimary">before I ever wrote a line of it.</span>
      </p>
    </Section>
  );
}

/* ───────────────────────── Selected work ───────────────────────── */

function Work() {
  const ordered = getOrderedProjects();

  return (
    <Section id="work" ruled>
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <Eyebrow>Selected work</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-h2 text-textPrimary">
            Every one of these runs in a real workflow.
          </h2>
          <p className="mt-4 text-lead text-textSecondary">
            Open a case study for the problem, the decisions I made, what each cost, and the
            measured outcome.
          </p>
        </div>
        <ButtonLink className="self-start" href="/projects" variant="link">
          All {ordered.length} case studies →
        </ButtonLink>
      </div>

      <ol className="mt-12">
        {ordered.map(({ card, project }, index) => (
          <ProjectRow card={card} index={index + 1} key={project.id} project={project} />
        ))}
      </ol>

      <Figure
        alt="BarHunter dashboard: 94,363 attorney records across 5 states and provinces, with filters for state, city, practice category, admission date and status."
        caption="BarHunter, live in production: 94,363 attorney records across five states and provinces, filterable by state, city and practice category."
        className="mt-16"
        height={479}
        src="/screenshots/barhunter-overview.webp"
        width={1600}
      />
    </Section>
  );
}

/* ──────────────────────────── Proof ──────────────────────────── */

function Proof() {
  if (!ceo) return null;

  return (
    <Section ruled>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow>What happened next</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-h2 text-textPrimary">
            The proof isn&apos;t the praise. It&apos;s what they did after.
          </h2>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <Quote attribution={`${ceo.name}, ${ceo.role}`} consequence={ceo.highlight}>
            {ceo.quote}
          </Quote>
          <ButtonLink className="mt-8" href="/recognition" variant="link">
            See the full record →
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────── Closing ─────────────────────────── */

function Closing() {
  return (
    <Section ruled>
      <h2 className="max-w-3xl text-balance font-display text-h1 text-textPrimary">
        If your team is doing something by hand that a system should own, that is my favourite
        kind of problem.
      </h2>
      <p className="mt-6 max-w-xl text-lead text-textSecondary">
        Tell me what the work looks like today. I will tell you honestly whether AI is the
        right answer for it.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/contact" size="lg">
          Start a conversation
        </ButtonLink>
        <ButtonLink href="mailto:tousifarsen@gmail.com" size="lg" variant="secondary">
          tousifarsen@gmail.com
        </ButtonLink>
      </div>
    </Section>
  );
}

/* ──────────────────────────── Page ──────────────────────────── */

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Handoff />
      <Work />
      <Proof />
      <Closing />
    </main>
  );
}
