import { RevealArticle, RevealDiv } from '@/components/ui/Reveal';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { colorMix, themeColors } from '@/lib/constants/colors';
import type { AccentColor } from '@/lib/constants/colors';
import { SkillLedger } from '@/components/skills/SkillLedger';
import { niches } from '@/lib/data/skillTree';

type PathChapter = {
  body: string;
  color: AccentColor;
  era: string;
  title: string;
};

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
const pathChapters: PathChapter[] = [
  {
    era: '2017 — 2022',
    color: 'cyan',
    title: 'Senior Executive, Operations',
    body: "Aegis Customer Support Services, then Global Dial Services. Operations roles across healthcare, travel, and tech — different industries, the same education. I was the person working the queue, and you learn quickly which steps are real work and which are only habit.",
  },
  {
    era: '2022 — 2024',
    color: 'blue',
    title: 'Clinical Referral Specialist, Workplace Options',
    body: "Then Legal Provider Relations from 2024. Same company, closer to the problem: a team of seven moving roughly 2,700 cases a month, hand-classifying each one against 31 legal issue types and waiting on senior guidance for anything complex. I spent two years watching where the hours actually went before I wrote a line of code against it.",
  },
  {
    era: '2025 — now',
    color: 'purple',
    title: 'Still in the seat, building from inside it',
    body: "CaseWise started as something I built alone, on my own time, for the queue I was sitting in. It earned a CEO-sponsored scholarship, a CTO directive to embed it in the core case management system, and 433 hours a month back for the legal team. I did not move into an AI role and then build this. I built it from an operations seat, which is the entire point.",
  },
];

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

const accentByColor: Record<AccentColor, string> = {
  blue: themeColors.blue,
  green: themeColors.green,
  cyan: themeColors.cyan,
  amber: themeColors.amber,
  purple: themeColors.purple,
};

const statChips = [
  { value: '8+', label: 'Years in Ops, ongoing' },
  { value: '6', label: 'Systems Built' },
  // Deliberately not "6 in production": Genie and Arsen's Lab are infrastructure
  // I depend on, not products with users. Only four serve other people.
  { value: '4', label: 'Used by Other People' },
] as const;

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] font-normal uppercase tracking-[0.16em] text-textMuted">
      {children}
    </p>
  );
}

function SignalIcon({ color }: { color: string }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.45"
      viewBox="0 0 16 16"
    >
      <path d="M2.5 8h3l1.5-3 2 6 1.5-3h3" />
      <path d="M8 2.5v1.2" />
      <path d="M8 12.3v1.2" />
    </svg>
  );
}

export default function AboutPage() {
  const allSkills = niches.flatMap((niche) => niche.skills);
  const shippedCount = allSkills.filter((skill) => skill.status === 'shipped').length;
  const appliedCount = allSkills.filter((skill) => skill.status === 'applied').length;

  return (
    <main className="dot-grid relative min-h-screen overflow-hidden pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 65% 34% at 50% 6%, color-mix(in srgb, var(--blue) 16%, transparent), transparent)',
            'radial-gradient(ellipse 42% 38% at 8% 42%, color-mix(in srgb, var(--cyan) 13%, transparent), transparent)',
            'radial-gradient(ellipse 42% 38% at 92% 78%, color-mix(in srgb, var(--purple) 13%, transparent), transparent)',
          ].join(', '),
        }}
      />

      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { label: 'About' },
        ]}
      />

      <section className="relative mx-auto max-w-6xl px-6 pt-12">
        <RevealDiv
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionLabel>ABOUT</SectionLabel>
          <h1 className="mt-4 text-balance font-display text-[34px] font-medium leading-tight text-textPrimary md:text-[44px]">
            I see what&apos;s missing. Then I build it.
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] font-body text-[16px] leading-[1.8] text-textSecondary">
            I&apos;m Tousif. I build AI systems for the work I have spent since 2017 doing by
            hand — clinical referrals, legal intake, operations. The closest name for it is{' '}
            <strong className="font-semibold text-textPrimary">AI product builder</strong>,
            which is a description rather than a title. I still read a workflow the way an
            operator does, and that is the only real advantage I have over someone who has
            only ever been an engineer.
          </p>
        </RevealDiv>

        <RevealDiv
          animate={{ opacity: 1, y: 0 }}
          className="panel-shadow theme-node-border relative mt-12 overflow-hidden rounded-[32px] border bg-surface p-2"
          initial={{ opacity: 0, y: 18 }}
          style={{
            borderColor: colorMix(themeColors.blue, 28),
            background: [
              'radial-gradient(ellipse 58% 44% at 18% 10%, color-mix(in srgb, var(--blue) 16%, transparent), transparent 64%)',
              'radial-gradient(ellipse 62% 42% at 100% 0%, color-mix(in srgb, var(--cyan) 18%, transparent), transparent 68%)',
              'var(--surface)',
            ].join(', '),
            boxShadow: `0 0 0 1px ${colorMix(themeColors.blue, 14)}, 0 28px 90px rgba(0,0,0,0.35)`,
          }}
          transition={{ delay: 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, color-mix(in srgb, var(--blue) 70%, transparent), color-mix(in srgb, var(--cyan) 60%, transparent), transparent)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-8 left-[43.5%] top-8 hidden w-px lg:block"
            style={{
              background:
                'linear-gradient(180deg, transparent, color-mix(in srgb, var(--blue) 48%, transparent), color-mix(in srgb, var(--cyan) 56%, transparent), transparent)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[43.5%] top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
          >
            <span
              className="grid h-12 w-12 place-items-center rounded-full border bg-surface"
              style={{
                borderColor: colorMix(themeColors.cyan, 52),
                boxShadow: `0 0 36px ${colorMix(themeColors.cyan, 36)}`,
              }}
            >
              <SignalIcon color={themeColors.cyan} />
            </span>
          </div>

          <div className="relative grid overflow-hidden rounded-[26px] lg:grid-cols-[0.78fr_1fr]">
            <div
              className="relative min-h-[520px] overflow-hidden rounded-[24px] lg:rounded-r-none"
              style={{ background: 'var(--canvas)' }}
            >
              <Image
                alt="Portrait of Tousif Ali"
                className="object-cover object-[50%_18%]"
                fill
                priority
                sizes="(min-width: 1024px) 37vw, 100vw"
                src="/profile.png"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 42%, color-mix(in srgb, var(--canvas) 82%, transparent) 100%)',
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-6 top-6 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, color-mix(in srgb, var(--blue) 70%, transparent), transparent)',
                }}
              />
              <div
                className="absolute bottom-5 left-5 right-5 rounded-[18px] border bg-surface/80 p-4 backdrop-blur-xl"
                style={{ borderColor: colorMix(themeColors.blue, 24) }}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-textMuted">
                  How I see it
                </p>
                <p className="mt-2 font-body text-[14px] leading-[1.55] text-textPrimary">
                  I read the business. I find the gap. I build the system.
                </p>
              </div>
            </div>

            <div className="relative flex min-h-[520px] flex-col justify-between p-7 md:p-10 lg:pl-12">
              <div
                aria-hidden="true"
                className="absolute left-0 top-8 hidden h-[calc(100%-4rem)] w-[3px] lg:block"
                style={{ background: themeColors.cyan }}
              />
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
                  style={{
                    borderColor: colorMix(themeColors.cyan, 32),
                    background: colorMix(themeColors.cyan, 10),
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: themeColors.cyan, boxShadow: `0 0 10px ${themeColors.cyan}` }}
                  />
                  <SectionLabel>FIELD NOTE</SectionLabel>
                </div>
                <div aria-hidden="true" className="mt-6 font-display text-[64px] leading-none text-textMuted opacity-20 select-none">
                  &ldquo;
                </div>
                <blockquote className="-mt-2 max-w-[680px] text-pretty font-display text-[26px] font-normal leading-[1.2] tracking-[-0.02em] text-textPrimary md:text-[32px]">
                  Inside operations since 2017 — the gap between what exists and what should exist is always visible. I just can&apos;t walk past it.
                </blockquote>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-3">
                {statChips.map(({ value, label }) => (
                  <div
                    className="rounded-[14px] border bg-surfaceRaised/60 p-4"
                    key={label}
                    style={{ borderColor: 'var(--surface-border)' }}
                  >
                    <p className="font-display text-[24px] font-medium leading-none text-textPrimary">
                      {value}
                    </p>
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-textMuted">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealDiv>
      </section>

      <section className="relative mx-auto mt-20 max-w-6xl px-6">
        <RevealDiv
          className="grid gap-8 lg:grid-cols-[260px_1fr]"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ amount: 0.2, once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionLabel>ABOUT - BIO</SectionLabel>
            <h2 className="mt-4 font-display text-[28px] font-medium leading-tight text-textPrimary">
              The instinct came before the tools.
            </h2>
          </div>

          <div
            className="panel-shadow theme-node-border relative overflow-hidden rounded-[24px] border bg-surface p-6 md:p-8"
            style={{ borderColor: colorMix(themeColors.blue, 20) }}
          >
            <div className="grid gap-5">
              {bioParagraphs.map((paragraph, index) => (
                <RevealDiv
                  className="relative rounded-[12px] border-l-2 bg-surfaceRaised/40 p-5"
                  initial={{ opacity: 0, y: 10 }}
                  key={index}
                  style={{
                    borderColor: index === bioParagraphs.length - 1 ? themeColors.purple : themeColors.cyan,
                    background: index === bioParagraphs.length - 1
                      ? `linear-gradient(135deg, ${colorMix(themeColors.purple, 8)}, transparent), var(--surface-raised)`
                      : undefined,
                  }}
                  transition={{ delay: index * 0.06, duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-4 font-mono text-[11px] tabular-nums text-textMuted opacity-40"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p
                    className="font-body text-[15px] leading-[1.9] pr-6"
                    style={{ color: index === bioParagraphs.length - 1 ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  >
                    {paragraph}
                  </p>
                </RevealDiv>
              ))}
            </div>
          </div>
        </RevealDiv>
      </section>

      <section className="relative mx-auto mt-20 max-w-6xl px-6">
        <RevealDiv
          className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"
          initial={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.12, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ amount: 0.3, once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div>
            <SectionLabel>ABOUT - PATH</SectionLabel>
            <h2 className="mt-4 font-display text-[30px] font-medium leading-tight text-textPrimary md:text-[36px]">
              From attention to infrastructure.
            </h2>
          </div>
          <p className="max-w-[440px] text-pretty font-body text-[14px] leading-[1.7] text-textSecondary">
            Years of seeing what should exist. Then building exactly that, without leaving the seat.
          </p>
        </RevealDiv>

        <div className="relative grid gap-4 lg:grid-cols-3">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-[38px] hidden h-px lg:block"
            style={{
              background:
                'linear-gradient(90deg, color-mix(in srgb, var(--cyan) 52%, transparent), color-mix(in srgb, var(--blue) 58%, transparent), color-mix(in srgb, var(--purple) 52%, transparent))',
            }}
          />
          {pathChapters.map((chapter, index) => {
            const accent = accentByColor[chapter.color];

            return (
              <RevealArticle
                className="panel-shadow theme-node-border relative overflow-hidden rounded-[22px] border bg-surface p-6"
                initial={{ opacity: 0, y: 16 }}
                key={chapter.era}
                style={{
                  borderColor: colorMix(accent, 26),
                  background: `radial-gradient(ellipse 90% 58% at 50% 0%, ${colorMix(accent, 14)}, transparent 68%), var(--surface)`,
                }}
                transition={{ delay: index * 0.08, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ amount: 0.2, once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-full border"
                    style={{
                      background: colorMix(accent, 14),
                      borderColor: colorMix(accent, 56),
                      boxShadow: `0 0 28px ${colorMix(accent, 32)}`,
                    }}
                  >
                    <SignalIcon color={accent} />
                  </span>
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.14em]"
                    style={{ color: accent }}
                  >
                    {chapter.era}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-[21px] font-medium leading-snug text-textPrimary">
                  {chapter.title}
                </h3>
                <p className="mt-4 font-body text-[15px] leading-[1.9] text-textSecondary">
                  {chapter.body}
                </p>
              </RevealArticle>
            );
          })}
        </div>
      </section>

      {/* What I believe — opinions, owned as opinions */}
      <section className="relative mx-auto mt-20 max-w-6xl px-6">
        <RevealDiv
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ amount: 0.15, once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <SectionLabel>ABOUT · OPINIONS</SectionLabel>
              <h2 className="mt-4 font-display text-[30px] font-medium leading-tight text-textPrimary md:text-[36px]">
                Five things I actually believe.
              </h2>
            </div>
            <p className="max-w-[380px] text-pretty font-body text-[14px] leading-[1.7] text-textSecondary">
              Each one is a position I have acted on, not a principle I admire.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {beliefs.map((belief, index) => (
              <RevealArticle
                className="relative overflow-hidden rounded-[18px] border p-6"
                initial={{ opacity: 0, y: 12 }}
                key={belief.claim}
                style={{
                  borderColor: colorMix(themeColors.blue, 20),
                  background: `radial-gradient(ellipse 110% 60% at 0% 0%, ${colorMix(themeColors.blue, 8)}, transparent 62%), var(--surface)`,
                }}
                transition={{ delay: index * 0.05, duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <p className="font-display text-[18px] font-semibold leading-snug text-textPrimary md:text-[19px]">
                  {belief.claim}
                </p>
                <p className="mt-3 font-body text-[14px] leading-[1.8] text-textSecondary">
                  {belief.body}
                </p>
              </RevealArticle>
            ))}
          </div>
        </RevealDiv>
      </section>

      {/* Limits — operational, useful to a collaborator */}
      <section className="relative mx-auto mt-20 max-w-6xl px-6">
        <RevealDiv
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ amount: 0.2, once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="mb-10">
            <SectionLabel>ABOUT · HOW I WORK</SectionLabel>
            <h2 className="mt-4 font-display text-[30px] font-medium leading-tight text-textPrimary md:text-[36px]">
              I get obsessed. That is the whole thing.
            </h2>
            <p className="mt-4 max-w-[560px] font-body text-[14px] leading-[1.7] text-textSecondary">
              Useful if you are deciding whether to work with me — including the part that
              costs something.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {howIWork.map((limit, index) => (
              <RevealArticle
                className="rounded-[18px] border p-6"
                initial={{ opacity: 0, y: 12 }}
                key={limit.title}
                style={{
                  borderColor: colorMix(themeColors.amber, 20),
                  background: colorMix(themeColors.amber, 5),
                }}
                transition={{ delay: index * 0.05, duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h3 className="font-display text-[16px] font-semibold leading-snug text-textPrimary">
                  {limit.title}
                </h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.75] text-textSecondary">
                  {limit.body}
                </p>
              </RevealArticle>
            ))}
          </div>
        </RevealDiv>
      </section>

      {/* Skill Tree */}
      <section className="relative mx-auto mt-20 max-w-6xl px-6">
        <RevealDiv
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ amount: 0.1, once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <SectionLabel>ABOUT · SKILLS</SectionLabel>
              <h2 className="mt-4 font-display text-[30px] font-medium leading-tight text-textPrimary md:text-[36px]">
                Every tool has a project behind it.
              </h2>
            </div>
            <p className="max-w-[380px] text-pretty font-body text-[14px] leading-[1.7] text-textSecondary">
              No filler. What&apos;s here got used on something real.
            </p>
          </div>

          <div
            className="relative overflow-hidden rounded-[24px] border bg-surface"
            style={{
              borderColor: colorMix(themeColors.blue, 18),
              background: [
                `radial-gradient(ellipse 55% 35% at 15% 0%, ${colorMix(themeColors.blue, 9)}, transparent 55%)`,
                `radial-gradient(ellipse 45% 35% at 85% 100%, ${colorMix(themeColors.green, 7)}, transparent 50%)`,
                'var(--surface)',
              ].join(', '),
            }}
          >
            {/* Top glow line */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${colorMix(themeColors.blue, 55)}, ${colorMix(themeColors.green, 45)}, transparent)` }} />

            <div className="p-6 md:p-10">
              <div className="mb-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-textMuted">
                  Skill tree — proof-backed
                </p>
                <p className="font-mono text-[11px] tracking-[0.08em] text-textSecondary">
                  {allSkills.length} skills &middot;{' '}
                  <span style={{ color: themeColors.green }}>{shippedCount} shipped</span>{' '}
                  &middot; {appliedCount} applied
                </p>
              </div>

              {/* Proportion of shipped vs applied, at a glance */}
              <div
                aria-hidden="true"
                className="mb-8 flex h-1.5 w-full overflow-hidden rounded-full"
                style={{ background: 'var(--surface-raised)' }}
              >
                <span
                  style={{
                    background: themeColors.green,
                    width: `${(shippedCount / allSkills.length) * 100}%`,
                  }}
                />
                <span
                  style={{
                    background: colorMix(themeColors.blue, 45),
                    width: `${(appliedCount / allSkills.length) * 100}%`,
                  }}
                />
              </div>

              <SkillLedger defaultOpenCount={2} />

              <p className="mt-8 font-body text-[13px] leading-[1.7] text-textMuted">
                <strong className="font-semibold text-textSecondary">Shipped</strong> means it
                is load-bearing in something running today, and the projects it links to are
                the evidence.{' '}
                <strong className="font-semibold text-textSecondary">Applied</strong> means I
                have used it for real but it has not carried a system yet. Nothing here is
                listed because I read about it.
              </p>
            </div>
          </div>
        </RevealDiv>
      </section>

      {/* Certifications CTA */}
      <section className="relative mx-auto mt-16 max-w-6xl px-6">
        <RevealDiv
          className="relative overflow-hidden rounded-[24px] border bg-surface p-8 md:p-10"
          initial={{ opacity: 0, y: 16 }}
          style={{
            borderColor: colorMix(themeColors.amber, 24),
            background: [
              `radial-gradient(ellipse 70% 60% at 100% 0%, ${colorMix(themeColors.amber, 14)}, transparent 68%)`,
              `radial-gradient(ellipse 50% 50% at 0% 100%, ${colorMix(themeColors.blue, 10)}, transparent 60%)`,
              'var(--surface)',
            ].join(', '),
            boxShadow: `0 0 0 1px ${colorMix(themeColors.amber, 10)}, 0 20px 60px rgba(0,0,0,0.28)`,
          }}
          transition={{ delay: 0.1, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ amount: 0.3, once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${colorMix(themeColors.amber, 60)}, transparent)`,
            }}
          />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.16em]"
                style={{ color: themeColors.amber }}
              >
                CREDENTIALS · PRODUCT SCHOOL
              </p>
              <h2 className="mt-3 font-display text-[26px] font-medium leading-tight text-textPrimary md:text-[30px]">
                7 certifications earned.
              </h2>
              <p className="mt-2 font-body text-[14px] leading-[1.7] text-textSecondary">
                CEO sponsored. 3 more in progress.
              </p>
            </div>
            <Link
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-all duration-200 hover:gap-3"
              href="/certifications"
              style={{
                borderColor: colorMix(themeColors.amber, 40),
                background: colorMix(themeColors.amber, 12),
                color: themeColors.amber,
              }}
            >
              Explore Certifications
              <svg
                aria-hidden="true"
                fill="none"
                height="12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 12 12"
                width="12"
              >
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </RevealDiv>
      </section>
    </main>
  );
}
