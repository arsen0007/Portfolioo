import { Belief } from '@/components/about/Belief';
import { PathScroll } from '@/components/about/PathScroll';
import { PortraitFrame } from '@/components/about/PortraitFrame';
import { SceneTrigger } from '@/components/canvas/SceneTrigger';
import { Reveal } from '@/components/motion/Reveal';
import { SkillLedger } from '@/components/skills/SkillLedger';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Metric } from '@/components/ui/Metric';
import { Eyebrow, Section } from '@/components/ui/Section';
import { Counter } from '@/components/motion/Counter';
import { certs } from '@/lib/data/certifications';
import { projects } from '@/lib/data/projects';
import { niches } from '@/lib/data/skillTree';

const bioParagraphs = [
  "I have never waited for the right tools, the right environment, or the right moment. As a kid I built from scrap, pushed every device I owned past what it was designed for, and went all the way — even when all the way meant frying the house wiring.",
  "Before I had a proper computer I was already deep in it, running a full Linux environment on a phone because it was the only machine I had. There was a new problem almost every day, and I loved the moment it finally clicked. When I got my first real laptop, I wasn't starting. I was continuing.",
  "That has not changed. There is a Raspberry Pi under my desk running fourteen services, and the reason it exists is the same reason the phone did: I wanted to know how the layer underneath actually works, and the only way to find out was to be responsible for it.",
] as const;

/**
 * Each era carries an artifact or a number. A timeline of job titles is a
 * résumé and the reader already has LinkedIn for that — what makes an era
 * worth reading is the thing that came out of it.
 */
const pathChapters = [
  {
    era: '2017 — 2022',
    title: 'Senior Executive, Operations',
    body: "Aegis Customer Support Services, then Global Dial Services. Operations roles across healthcare, travel, and tech — different industries, the same education. I was the person working the queue, and you learn quickly which steps are real work and which are only habit.",
  },
  {
    era: '2022 — 2024',
    title: 'Clinical Referral Specialist, Workplace Options',
    body: "Then Legal Provider Relations from 2024. Same company, closer to the problem: a team of seven moving roughly 2,700 cases a month, hand-classifying each one against 31 legal issue types and waiting on senior guidance for anything complex. I spent two years watching where the hours actually went before I wrote a line of code against it.",
  },
  {
    era: '2025 — now',
    title: 'Still in the seat, building from inside it',
    body: "CaseWise started as something I built alone, on my own time, for the queue I was sitting in. It earned a CEO-sponsored scholarship, a CTO directive to embed it in the core case management system, and 433 hours a month back for the legal team. I did not move into an AI role and then build this. I built it from an operations seat, which is the entire point.",
  },
] as const;

/** Opinions, owned as opinions. Each one is a position I have actually acted on. */
const beliefs = [
  {
    claim: 'Anyone can type. That stopped being the skill.',
    body: "AI can build almost anything now, so building is not the bottleneck any more — understanding what you are building is. Which decisions to make, what architecture the product actually needs, and where the generic answer is wrong. That judgement is the job now, and it does not come out of a prompt.",
  },
  {
    claim: 'The useful question is never "can AI do this".',
    body: "It is which part of this is actually the work. Most of what looks like a task is habit, handoff, or waiting — and automating those is how you end up with an expensive system nobody uses.",
  },
  {
    claim: 'A prototype nobody uses is a hobby.',
    body: "Getting something adopted is not a phase that happens after the building. It is most of the job, and it is the part that decides whether any of the rest mattered.",
  },
  {
    claim: 'A silent wrong answer is worse than an error.',
    body: "An error gets investigated. A plausible wrong answer gets believed, and the system keeps producing them until someone notices by accident. This is the thing I check for first.",
  },
  {
    claim: 'What a model outputs is a product decision.',
    body: "A failure probability and a lap count can come from the same model. Only one of them is usable by someone under pressure. Choosing which to emit is not a modelling problem.",
  },
] as const;

/**
 * Not a weakness list. The honest thing about how he works, including what it
 * costs — which is more useful to a reader than three performed flaws.
 */
const howIWork = [
  {
    title: 'I get obsessed',
    body: "That is the real answer. Once I am invested in a problem I do not stop until it is solved — I lose sleep over it, and time stops being a factor. It is why things get finished. It is also why I start more at once than any sane person should.",
  },
  {
    title: 'I enjoy the hard part, not just the result',
    body: "Most people like it when the thing works. I like how difficult it was to make it work. That is why I wrote an agent runtime from scratch instead of wiring up a framework, and why the bugs I remember are the ones that took days.",
  },
  {
    title: 'I do not stop at how',
    body: "How something works is where most people finish. I keep going to why it was built that way, what the people who built it were trading off, and what I would do differently. It is slower. It is also the only reason I can make the call when the answer is not in a tutorial.",
  },
] as const;

export default function AboutPage() {
  const allSkills = niches.flatMap((niche) => niche.skills);
  const shippedCount = allSkills.filter((skill) => skill.status === 'shipped').length;
  const appliedCount = allSkills.filter((skill) => skill.status === 'applied').length;

  // A competition build is not a production system, so it is not counted here.
  const systemsBuilt = projects.filter((project) => !project.kind).length;

  const completedCerts = certs.filter((cert) => cert.status === 'completed').length;
  const inProgressCerts = certs.filter((cert) => cert.status === 'in-progress').length;

  return (
    <main className="pb-[clamp(3.5rem,9vw,7.5rem)]">
      {/* 01 · Intro. The particle field forms a halftone portrait to the right. */}
      <SceneTrigger as="div" intensity={0.8} layout="right" shape="portrait" signal={0.25}>
        <Breadcrumb
          items={[
            { href: '/', label: 'Tousif Ali' },
            { label: 'About' },
          ]}
        />

        <Container className="pb-[clamp(4rem,9vw,8rem)] pt-10 md:pt-16">
          <Eyebrow index="01">About</Eyebrow>
          <Reveal
            as="h1"
            className="mt-6 max-w-[16ch] text-balance font-display text-display font-medium text-textPrimary lg:max-w-[12ch]"
            immediate
          >
            I see what&apos;s missing. Then I <em className="font-serif font-normal italic tracking-[-0.03em]">build it.</em>
          </Reveal>

          <div className="mt-14 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-7">
              <Reveal as="p" className="text-h3 text-textPrimary" mode="lines">
                I&apos;m Tousif. I build AI systems for the work I have spent since 2017 doing by
                hand: clinical referrals, legal intake, operations. The closest name for it is{' '}
                <strong className="font-medium text-accent">AI product builder</strong>, which is a
                description rather than a title.
              </Reveal>
              <div className="mt-10 max-w-[60ch] space-y-6 text-lead text-textSecondary">
                <p>
                  I still read a workflow the way an operator does, and that is the only real
                  advantage I have over someone who has only ever been an engineer.
                </p>
                {bioParagraphs.map((paragraph, index) => (
                  <p className={index === bioParagraphs.length - 1 ? 'text-textPrimary' : undefined} key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 grid gap-14 lg:mt-28 lg:grid-cols-12 lg:gap-12">
            <PortraitFrame className="max-w-sm lg:col-span-4" />

            <div className="flex flex-col justify-end lg:col-span-7 lg:col-start-6">
              <blockquote className="max-w-3xl text-pretty font-serif text-[clamp(1.6rem,1.2rem+1.6vw,2.6rem)] leading-[1.15] text-textPrimary">
                <p>
                  <span aria-hidden="true">“</span>
                  Inside operations since 2017 — the gap between what exists and what should exist is
                  always visible. I just can&apos;t walk past it.
                  <span aria-hidden="true">”</span>
                </p>
                <footer className="label mt-5 not-italic text-textMuted">— Field note</footer>
              </blockquote>

              <div className="mt-14 grid gap-8 border-t border-surfaceBorder pt-8 sm:grid-cols-3">
                <Metric caption="in operations, and still in the seat" value="8+ years" />
                <Metric
                  caption="systems built, not counting the 24-hour competition"
                  value={String(systemsBuilt)}
                />
                {/* Deliberately not "in production": Genie and Arsen's Lab are
                    infrastructure I depend on, not products with users. */}
                <Metric caption="of them used by other people" value="4" />
              </div>
            </div>
          </div>
        </Container>
      </SceneTrigger>

      {/* 02 · Path. Pinned horizontal scroll on desktop, stacked everywhere else. */}
      <SceneTrigger as="section" className="border-t border-surfaceBorder" intensity={0.4} layout="full" shape="pipeline" signal={0.5}>
        <PathScroll chapters={pathChapters} />
      </SceneTrigger>

      {/* 03 · Beliefs. */}
      <SceneTrigger as="section" className="border-t border-surfaceBorder" intensity={0.3} layout="right" shape="grid" signal={0.6}>
        <Container className="pt-[clamp(4.5rem,11vw,9rem)]">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Eyebrow index="03">Opinions</Eyebrow>
              <Reveal as="h2" className="mt-5 text-balance font-display text-h1 font-medium text-textPrimary">
                Five things I <em className="font-serif font-normal italic tracking-[-0.02em]">actually</em> believe.
              </Reveal>
            </div>
            <p className="text-textSecondary lg:col-span-3 lg:col-start-10">
              Each one is a position I have acted on, not a principle I admire.
            </p>
          </div>
          <ol className="mt-12 divide-y divide-surfaceBorder border-t border-surfaceBorder">
            {beliefs.map((belief, index) => (
              <Belief
                body={belief.body}
                claim={belief.claim}
                index={String(index + 1).padStart(2, '0')}
                key={belief.claim}
                strike={index === 1 ? 'can AI do this' : undefined}
              />
            ))}
          </ol>
        </Container>
      </SceneTrigger>

      {/* 04 · How I work. */}
      <SceneTrigger as="section" intensity={0.3} layout="left" shape="clusters" signal={0.35}>
        <Container className="border-t border-surfaceBorder pt-[clamp(4.5rem,11vw,9rem)]">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-9">
              <Eyebrow index="04">How I work</Eyebrow>
              <Reveal as="h2" className="mt-5 text-balance font-display text-h1 font-medium text-textPrimary">
                I get <em className="font-serif font-normal italic tracking-[-0.02em]">obsessed.</em> That is the whole thing.
              </Reveal>
            </div>
          </div>
          <div className="mt-12 grid border-l border-t border-surfaceBorderStrong md:grid-cols-2">
            {howIWork.map((item, index) => (
              <article className="border-b border-r border-surfaceBorderStrong p-6 sm:p-10" key={item.title}>
                <p className="label text-accent">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-6 font-display text-h3 font-medium text-textPrimary">{item.title}</h3>
                <p className="mt-4 max-w-[52ch] text-textSecondary">{item.body}</p>
              </article>
            ))}
            <div className="flex items-end border-b border-r border-surfaceBorderStrong p-6 sm:p-10">
              <p className="label max-w-[34ch] leading-relaxed text-textMuted">
                Useful if you are deciding whether to work with me, including the part that costs
                something.
              </p>
            </div>
          </div>
        </Container>
      </SceneTrigger>

      {/* 05 · Skills as a spec sheet. */}
      <SceneTrigger as="section" intensity={0.25} layout="right" shape="grid" signal={0.8}>
        <Container className="pt-[clamp(4.5rem,11vw,9rem)]">
          <div className="border-t border-surfaceBorder pt-[clamp(4.5rem,11vw,9rem)]">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <Eyebrow index="05">Skills · spec sheet</Eyebrow>
                <Reveal as="h2" className="mt-5 text-balance font-display text-h1 font-medium text-textPrimary">
                  Every tool has a project <em className="font-serif font-normal italic tracking-[-0.02em]">behind it.</em>
                </Reveal>
              </div>
              <p className="font-mono text-small text-textSecondary lg:col-span-4">
                <span className="tabular-nums text-textPrimary">{allSkills.length}</span> skills ·{' '}
                <span className="tabular-nums text-textPrimary">{shippedCount}</span> shipped ·{' '}
                <span className="tabular-nums text-textPrimary">{appliedCount}</span> applied. No filler:
                what&apos;s here got used on something real.
              </p>
            </div>

            <div className="mt-12">
              <SkillLedger defaultOpenCount={1} />
            </div>

            <p className="mt-8 max-w-prose text-small text-textMuted">
              <strong className="font-medium text-textSecondary">Shipped</strong> means it is
              load-bearing in something running today, and the projects it links to are the
              evidence. <strong className="font-medium text-textSecondary">Applied</strong> means I
              have used it for real but it has not carried a system yet. Nothing here is listed
              because I read about it.
            </p>
          </div>
        </Container>
      </SceneTrigger>

      {/* 06 · Credentials. */}
      <Section ruled>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow index="06">Credentials · Product School</Eyebrow>
            <h2 className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-2">
              <span className="font-display text-mega font-medium leading-[0.8] tracking-[-0.06em] tabular-nums text-textPrimary">
                <Counter value={String(completedCerts)} />
              </span>
              <span className="pb-2 font-serif text-h2 font-normal italic text-textPrimary lg:pb-4">
                certifications earned.
              </span>
            </h2>
            <p className="mt-6 text-textSecondary">
              CEO sponsored.
              {inProgressCerts > 0 && ` ${inProgressCerts} more in progress.`}
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:justify-self-end">
            <ButtonLink href="/certifications" size="lg" variant="secondary">
              See the certifications
            </ButtonLink>
          </div>
        </div>
      </Section>
    </main>
  );
}
