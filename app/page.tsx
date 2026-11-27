import { CaseWiseFigure } from '@/components/home/CaseWiseFigure';
import { HeroReveal } from '@/components/home/HeroReveal';
import { NumberPin } from '@/components/home/NumberPin';
import { Preloader } from '@/components/home/Preloader';
import { ScrubQuote } from '@/components/home/ScrubQuote';
import { WorkIndex, type WorkItem } from '@/components/home/WorkIndex';
import '@/components/home/home.css';
import { SceneTrigger } from '@/components/canvas/SceneTrigger';
import { LocalTime } from '@/components/layout/LocalTime';
import { Counter } from '@/components/motion/Counter';
import { Magnetic } from '@/components/motion/Magnetic';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Figure } from '@/components/ui/Figure';
import { Eyebrow } from '@/components/ui/Section';
import { bridgePillars, heroCredentials } from '@/lib/data/home';
import { getOrderedProjects } from '@/lib/data/projectCards';
import { recognition } from '@/lib/data/recognition';

const ceo = recognition.leadershipTier.find((person) => person.id === 'ceo');
const cto = recognition.leadershipTier.find((person) => person.id === 'cto');

const SECTION = 'relative py-[clamp(5rem,12vw,11rem)]';

/* ─────────────────────────── 01 Hero ─────────────────────────── */

function Hero() {
  return (
    <SceneTrigger as="section" className="relative" layout="full" shape="noise" signal={0.06} turbulence={0.8}>
      <div className="flex min-h-[100svh] flex-col pt-[calc(var(--header-h)+1.5rem)]">
        <Container className="flex flex-1 flex-col">
          <HeroReveal as="div" mode="fade">
            <div className="label flex flex-wrap items-center gap-x-6 gap-y-2 text-textMuted">
              <span className="text-accent">01</span>
              <span className="text-textPrimary">AI systems builder</span>
              <span>Bengaluru</span>
              <LocalTime />
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="live-dot" /> Available 2026
              </span>
            </div>
          </HeroReveal>

          <div className="flex flex-1 flex-col justify-end pb-10 pt-12 lg:pb-14">
            <h1 className="sr-only">I build AI systems for work I used to do by hand.</h1>
            <HeroReveal
              as="p"
              className="max-w-[16ch] text-balance font-display text-display font-medium text-textPrimary sm:max-w-[18ch] lg:max-w-[15ch] xl:max-w-[17ch]"
            >
              <span aria-hidden="true">
                I build AI systems for work I used to do{' '}
                <em className="font-serif font-normal italic tracking-[-0.03em]">by hand.</em>
              </span>
            </HeroReveal>

            <div className="mt-10 grid items-end gap-8 lg:mt-14 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <HeroReveal as="p" className="max-w-[34rem] text-lead text-textSecondary" delay={0.25} mode="fade">
                  Years inside clinical, legal and sales operations taught me where the hours actually go.
                  Then I learned to build. Now I ship AI into the tools those teams already use.
                </HeroReveal>
                <HeroReveal as="div" className="mt-7 flex flex-col gap-3 sm:flex-row" delay={0.4} mode="fade">
                  <Magnetic>
                    <ButtonLink href="/projects" size="lg">
                      See the work
                    </ButtonLink>
                  </Magnetic>
                  <ButtonLink href="/contact" size="lg" variant="secondary">
                    Contact
                  </ButtonLink>
                </HeroReveal>
              </div>

              <div className="flex items-end justify-between gap-6 lg:col-span-4 lg:col-start-9 lg:justify-end lg:gap-10">
                <p className="label max-w-[19rem] text-textMuted">
                  <span className="hidden md:inline">Each point is one of 94,363 attorney leads BarHunter has sourced.</span>
                  <span className="md:hidden">A sample of the 94,363 attorney leads BarHunter has sourced.</span>
                </p>
                <div aria-hidden="true" className="scroll-cue hidden shrink-0 sm:block" />
              </div>
            </div>
          </div>
        </Container>

        <div className="border-t border-surfaceBorder py-4">
          <div className="ticker label text-textMuted">
            <ul className="ticker__group">
              {heroCredentials.map((c) => (
                <li className="ticker__item" key={c}>
                  {c}
                </li>
              ))}
            </ul>
            <ul aria-hidden="true" className="ticker__group">
              {heroCredentials.map((c) => (
                <li className="ticker__item" key={c}>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SceneTrigger>
  );
}

/* ───────────────────────── 02 The number ───────────────────────── */

function TheNumber() {
  return (
    <SceneTrigger as="section" id="number" layout="center" scrub shape="text:433" signal={0.7}>
      <NumberPin>
        <div className="flex min-h-[100svh] flex-col justify-between py-[clamp(5rem,9vw,8rem)]">
          <Container>
            <Eyebrow index="02">The number</Eyebrow>
          </Container>

          <Container className="relative">
            <p
              className="bignum font-display font-medium tabular-nums text-textPrimary"
              data-bignum=""
              style={{ transformOrigin: '0% 50%' }}
            >
              <Counter value="433" />
              <span className="ml-[0.08em] align-baseline font-serif text-[0.22em] font-normal italic tracking-normal text-accent">
                h
              </span>
            </p>
          </Container>

          <Container>
            <div className="grid gap-6 border-t border-surfaceBorder pt-6 lg:grid-cols-12 lg:items-baseline" data-number-late="">
              <p className="label text-textMuted lg:col-span-3">Hours / month · CaseWise</p>
              <p className="text-lead text-textPrimary lg:col-span-5">
                hours a month given back to a seven-person legal team.
              </p>
              <p className="flex items-start gap-3 text-small text-textSecondary lg:col-span-4">
                <span aria-hidden="true" className="live-dot mt-1.5 shrink-0" />
                <span>The CTO has backed building it into the company&apos;s core platform.</span>
              </p>
            </div>
          </Container>
        </div>
      </NumberPin>

      <Container className="pb-[clamp(5rem,12vw,11rem)] pt-4">
        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-9 lg:col-start-4">
            <CaseWiseFigure />
          </div>
        </div>
      </Container>
    </SceneTrigger>
  );
}

/* ────────────────────── 03 The handoff (thesis) ────────────────────── */

function Handoff() {
  return (
    <SceneTrigger as="section" className={SECTION} id="approach" layout="right" shape="bridge" signal={0.3}>
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
              <Eyebrow index="03">How I work</Eyebrow>
              <Reveal as="h2" className="mt-6 text-balance font-display text-h1 font-medium text-textPrimary">
                Most AI projects die in <em className="font-serif font-normal italic">the handoff.</em>
              </Reveal>
              <Reveal as="p" className="mt-8 max-w-[34rem] text-lead text-textSecondary" mode="fade">
                Engineers build what the brief asks for. Operators write briefs from what they already know. The
                system that would have worked sits in the gap between them, and nobody owns that gap. What follows
                is the same three steps done by one person. Not because that scales, but because it is the only way
                I have found to keep the problem intact all the way from the queue to production.
              </Reveal>
            </div>
          </div>

          <ol className="border-t border-surfaceBorder lg:col-span-6 lg:col-start-7">
            {bridgePillars.map((pillar, index) => (
              <li className="grid gap-4 border-b border-surfaceBorder py-10 sm:grid-cols-[5rem_1fr] md:py-14" key={pillar.id}>
                <p className="font-display text-h2 font-medium leading-none tabular-nums tracking-[-0.04em] text-textMuted">
                  0{index + 1}
                </p>
                <div>
                  <p className="label text-accent">{pillar.role}</p>
                  <Reveal as="h3" className="mt-3 font-display text-h2 font-medium text-textPrimary">
                    {pillar.claim}
                  </Reveal>
                  <p className="mt-5 max-w-[34rem] text-textSecondary">{pillar.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <Reveal
          as="p"
          className="mt-[clamp(5rem,10vw,9rem)] max-w-[22ch] text-balance font-display text-display font-medium leading-[0.98] text-textMuted sm:max-w-[26ch]"
        >
          CaseWise exists because I spent years doing legal intake{' '}
          <em className="font-serif font-normal italic text-textPrimary">before I ever wrote a line of it.</em>
        </Reveal>
      </Container>
    </SceneTrigger>
  );
}

/* ─────────────────────────── 04 The system ─────────────────────────── */

const gates = [
  {
    id: 'classify',
    name: 'Classification',
    stat: '31+',
    suffix: '',
    unit: 'legal issue types',
    body: 'Each case is read and sorted into a taxonomy of 31+ legal issue types.',
  },
  {
    id: 'summarize',
    name: 'Summarization',
    stat: '5–15',
    suffix: 'min',
    unit: 'per case, by hand',
    body: 'Structured summaries from messy call notes, without the read-think-write cycle.',
  },
  {
    id: 'outreach',
    name: 'Attorney outreach',
    stat: '30',
    suffix: 'sec',
    unit: 'of review per case',
    body: 'Ready-to-use outreach templates, drafted for the person who owns the case.',
  },
] as const;

function TheSystem() {
  return (
    <SceneTrigger as="section" className={SECTION} id="system" layout="full" scrub shape="pipeline" signal={0.5}>
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Eyebrow index="04">The system</Eyebrow>
            <Reveal as="h2" className="mt-6 max-w-[16ch] text-balance font-display text-h1 font-medium text-textPrimary">
              Three stages, with a <em className="font-serif font-normal italic">person</em> at the end.
            </Reveal>
          </div>
          <p className="label text-textMuted lg:text-right">
            In: <span className="text-textPrimary">2,700</span> cases a month
          </p>
        </div>

        <div className="mt-16 lg:mt-24">
          <div aria-hidden="true" className="gate-flow hidden lg:block" />
          <ol className="grid gap-px lg:grid-cols-4 lg:gap-0">
            {gates.map((gate, i) => (
              <li className="relative border-t border-surfaceBorder pb-10 pt-6 lg:border-t-0 lg:pr-8" key={gate.id}>
                <span
                  aria-hidden="true"
                  className="absolute -top-[5px] left-0 hidden h-[11px] w-[11px] border border-textPrimary bg-canvas lg:block"
                />
                <p className="label text-textMuted lg:mt-6">Gate 0{i + 1}</p>
                <h3 className="mt-3 font-display text-h3 font-medium text-textPrimary">{gate.name}</h3>
                <p className="mt-10 font-display text-h1 font-medium leading-none tabular-nums tracking-[-0.05em] text-textPrimary">
                  {gate.stat}
                  {gate.suffix ? (
                    <span className="ml-2 font-serif text-[0.4em] font-normal italic tracking-normal text-textSecondary">
                      {gate.suffix}
                    </span>
                  ) : null}
                </p>
                <p className="label mt-3 text-textMuted">{gate.unit}</p>
                <p className="mt-6 max-w-[18rem] text-small text-textSecondary">{gate.body}</p>
              </li>
            ))}
            <li className="relative border-t border-surfaceBorder pb-10 pt-6 lg:border-t-0">
              <span
                aria-hidden="true"
                className="absolute -top-[6px] left-0 hidden lg:block"
              >
                <span className="live-dot" />
              </span>
              <p className="label text-accent lg:mt-6">The end</p>
              <h3 className="mt-3 font-display text-h3 font-medium text-textPrimary">
                A <em className="font-serif font-normal italic">person</em> decides
              </h3>
              <p className="mt-10 max-w-[18rem] text-textSecondary">
                The AI writes the first draft. The agent keeps final authority before anything is committed to the
                core system.
              </p>
            </li>
          </ol>
        </div>
      </Container>
    </SceneTrigger>
  );
}

/* ───────────────────────── 05 Selected work ───────────────────────── */

const screenshots: Record<string, { src: string; width: number; height: number; alt: string }> = {
  barhunter: { src: '/screenshots/barhunter-overview.webp', width: 1600, height: 479, alt: 'BarHunter dashboard' },
  fhoneman: { src: '/screenshots/fhoneman.webp', width: 1600, height: 741, alt: 'Fhoneman website' },
  mailmerge: { src: '/screenshots/mailmerge.webp', width: 1600, height: 865, alt: 'Mail Merge Tool' },
};

function Work() {
  const ordered = getOrderedProjects();
  const items: WorkItem[] = ordered.map(({ card, project }) => ({
    slug: project.id,
    name: project.name,
    role: card.role,
    statusLabel: card.statusLabel,
    live: card.statusTone === 'live',
    metric: project.impact.find((m) => m.value !== 'Live' && m.value !== 'V2') ?? project.impact[0],
    image: screenshots[project.id],
  }));

  return (
    <SceneTrigger as="section" className={SECTION} id="work" layout="right" shape="clusters" signal={0.35}>
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow index="05">Selected work</Eyebrow>
            <Reveal as="h2" className="mt-6 max-w-[18ch] text-balance font-display text-h1 font-medium text-textPrimary">
              Every one of these runs in a <em className="font-serif font-normal italic">real workflow.</em>
            </Reveal>
          </div>
          <ButtonLink className="self-start md:self-end" href="/projects" variant="link">
            All {ordered.length} case studies →
          </ButtonLink>
        </div>

        <div className="mt-14 lg:mt-20">
          <WorkIndex items={items} />
        </div>

        <Figure
          alt="BarHunter dashboard: 94,363 attorney records across 5 states and provinces, with filters for state, city, practice category, admission date and status."
          caption="BarHunter, live in production: 94,363 attorney records across five states and provinces, filterable by state, city and practice category."
          className="mt-20 lg:ml-[25%]"
          height={479}
          src="/screenshots/barhunter-overview.webp"
          width={1600}
        />
      </Container>
    </SceneTrigger>
  );
}

/* ──────────────────────────── 06 Proof ──────────────────────────── */

function Proof() {
  if (!ceo) return null;

  return (
    <SceneTrigger as="section" className={SECTION} id="proof" intensity={0.4} layout="left" shape="grid" signal={0.2}>
      <Container>
        <Eyebrow index="06">What happened next</Eyebrow>
        <h2 className="sr-only">The proof isn&apos;t the praise. It&apos;s what they did after.</h2>

        <div className="mt-12 lg:mt-16">
          <ScrubQuote text={ceo.quote} />
        </div>

        <div className="mt-12 grid gap-8 border-t border-surfaceBorder pt-6 lg:grid-cols-12">
          <p className="label text-textMuted lg:col-span-4">
            {ceo.name}, {ceo.role}
          </p>
          <div className="lg:col-span-5">
            <p className="flex items-start gap-3 text-lead text-textPrimary">
              <span aria-hidden="true" className="live-dot mt-2.5 shrink-0" />
              <span>{ceo.highlight}</span>
            </p>
            {cto ? (
              <p className="mt-4 pl-[1.4rem] text-small text-textSecondary">
                {cto.highlight}.
              </p>
            ) : null}
          </div>
          <div className="lg:col-span-3 lg:text-right">
            <ButtonLink href="/recognition" variant="link">
              See the full record →
            </ButtonLink>
          </div>
        </div>
      </Container>
    </SceneTrigger>
  );
}

/* ─────────────────────────── 07 Closing ─────────────────────────── */

function Closing() {
  return (
    <SceneTrigger as="section" className="relative" id="contact-cta" layout="center" shape="text:TOUSIF ALI" signal={0.8}>
      <Container className="flex min-h-[100svh] flex-col justify-between py-[clamp(5rem,10vw,9rem)]">
        <div>
          <Eyebrow index="07">Let&apos;s talk</Eyebrow>
          <Reveal as="h2" className="mt-6 max-w-[26ch] text-balance font-display text-h1 font-medium text-textPrimary">
            If your team is doing something <em className="font-serif font-normal italic">by hand</em> that a system
            should own, that is my favourite kind of problem.
          </Reveal>
        </div>

        <div className="mt-24 grid items-end gap-10 lg:grid-cols-12">
          <p className="max-w-[28rem] text-lead text-textSecondary lg:col-span-5">
            Tell me what the work looks like today. I will tell you honestly whether AI is the right answer for it.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:col-span-6 lg:col-start-7 lg:justify-end">
            <Magnetic strength={22}>
              <ButtonLink href="/contact" size="lg">
                Start a conversation
              </ButtonLink>
            </Magnetic>
            <ButtonLink href="mailto:tousifarsen@gmail.com" size="lg" variant="secondary">
              tousifarsen@gmail.com
            </ButtonLink>
          </div>
        </div>
      </Container>
    </SceneTrigger>
  );
}

/* ──────────────────────────── Page ──────────────────────────── */

export default function HomePage() {
  return (
    <main>
      <Preloader />
      <Hero />
      <TheNumber />
      <Handoff />
      <TheSystem />
      <Work />
      <Proof />
      <Closing />
    </main>
  );
}
