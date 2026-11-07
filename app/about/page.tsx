import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Figure } from '@/components/ui/Figure';
import { Metric } from '@/components/ui/Metric';
import { Quote } from '@/components/ui/Quote';
import { Eyebrow, Section } from '@/components/ui/Section';
import { Split } from '@/components/ui/Split';
import { SkillLedger } from '@/components/skills/SkillLedger';
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
      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { label: 'About' },
        ]}
      />

      <Container className="pt-8 md:pt-12">
        <header className="max-w-3xl">
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-4 text-balance font-display text-h1 text-textPrimary">
            I see what&apos;s missing. Then I build it.
          </h1>
          <p className="mt-6 text-lead text-textSecondary">
            I&apos;m Tousif. I build AI systems for the work I have spent since 2017 doing by hand
            — clinical referrals, legal intake, operations. The closest name for it is{' '}
            <strong className="font-medium text-textPrimary">AI product builder</strong>, which is
            a description rather than a title. I still read a workflow the way an operator does,
            and that is the only real advantage I have over someone who has only ever been an
            engineer.
          </p>
        </header>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12">
          <Figure
            alt="Portrait of Tousif Ali"
            className="max-w-sm lg:col-span-4"
            height={1280}
            priority
            sizes="(min-width: 1024px) 352px, (min-width: 384px) 384px, 100vw"
            src="/profile.webp"
            width={960}
          />

          <div className="lg:col-span-7 lg:col-start-6">
            <Quote attribution="Field note">
              Inside operations since 2017 — the gap between what exists and what should exist is
              always visible. I just can&apos;t walk past it.
            </Quote>

            <div className="mt-10 space-y-5">
              {bioParagraphs.map((paragraph, index) => (
                <p
                  className={
                    index === bioParagraphs.length - 1
                      ? 'text-textPrimary'
                      : 'text-textSecondary'
                  }
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 grid gap-8 border-t border-surfaceBorder pt-8 sm:grid-cols-3">
              <Metric caption="in operations, and still in the seat" value="8+ years" />
              <Metric caption="systems built, not counting the 24-hour competition" value={String(systemsBuilt)} />
              {/* Deliberately not "in production": Genie and Arsen's Lab are
                  infrastructure I depend on, not products with users. */}
              <Metric caption="of them used by other people" value="4" />
            </div>
          </div>
        </div>
      </Container>

      <Split eyebrow="Path" intro="Years of seeing what should exist. Then building exactly that, without leaving the seat." title="From attention to infrastructure.">
        <ol className="border-t border-surfaceBorder">
          {pathChapters.map((chapter) => (
            <li
              className="grid gap-3 border-b border-surfaceBorder py-8 sm:grid-cols-[9rem_1fr] sm:gap-8"
              key={chapter.era}
            >
              <p className="text-small font-medium text-textMuted">{chapter.era}</p>
              <div>
                <h3 className="font-display text-h3 text-textPrimary">{chapter.title}</h3>
                <p className="mt-3 text-textSecondary">{chapter.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Split>

      <Split eyebrow="Opinions" intro="Each one is a position I have acted on, not a principle I admire." title="Five things I actually believe.">
        <ul className="border-t border-surfaceBorder">
          {beliefs.map((belief) => (
            <li className="border-b border-surfaceBorder py-8" key={belief.claim}>
              <h3 className="font-display text-h3 text-textPrimary">{belief.claim}</h3>
              <p className="mt-3 text-textSecondary">{belief.body}</p>
            </li>
          ))}
        </ul>
      </Split>

      <Split eyebrow="How I work" intro="Useful if you are deciding whether to work with me, including the part that costs something." title="I get obsessed. That is the whole thing.">
        <div className="border-t border-surfaceBorder">
          {howIWork.map((item) => (
            <details className="group border-b border-surfaceBorder" key={item.title}>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                <span className="font-display text-xl text-textPrimary">{item.title}</span>
                <span
                  aria-hidden="true"
                  className="text-xl leading-none text-textMuted transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-prose pb-6 text-textSecondary">{item.body}</p>
            </details>
          ))}
        </div>
      </Split>

      <Section ruled>
        <div className="max-w-3xl">
          <Eyebrow>Skills</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-h2 text-textPrimary">
            Every tool has a project behind it.
          </h2>
          <p className="mt-4 text-textSecondary">
            {allSkills.length} skills · {shippedCount} shipped · {appliedCount} applied. No filler:
            what&apos;s here got used on something real.
          </p>
        </div>

        <div className="mt-10">
          <SkillLedger defaultOpenCount={1} />
        </div>

        <p className="mt-8 max-w-prose text-small text-textMuted">
          <strong className="font-medium text-textSecondary">Shipped</strong> means it is
          load-bearing in something running today, and the projects it links to are the evidence.{' '}
          <strong className="font-medium text-textSecondary">Applied</strong> means I have used it
          for real but it has not carried a system yet. Nothing here is listed because I read about
          it.
        </p>
      </Section>

      <Section ruled>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Credentials · Product School</Eyebrow>
            <h2 className="mt-4 font-display text-h2 text-textPrimary">
              {completedCerts} certifications earned.
            </h2>
            <p className="mt-3 text-textSecondary">
              CEO sponsored.
              {inProgressCerts > 0 && ` ${inProgressCerts} more in progress.`}
            </p>
          </div>
          <ButtonLink href="/recognition#certifications" size="lg" variant="secondary">
            See the certifications
          </ButtonLink>
        </div>
      </Section>
    </main>
  );
}
