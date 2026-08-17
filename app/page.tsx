import Link from 'next/link';
import { HeroOrbit } from '@/components/home/HeroOrbit';
import { FadeIn } from '@/components/ui/FadeIn';
import { colorMix, themeColors } from '@/lib/constants/colors';
import { projects } from '@/lib/data/projects';
import {
  bridgePillars,
  featuredSystems,
  heroCredentials,
  heroMetrics,
  proofPoints,
} from '@/lib/data/home';

function Eyebrow({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <p
      className="font-mono text-[11px] font-medium uppercase tracking-[0.14em]"
      style={{ color: color ?? 'var(--text-muted)' }}
    >
      {children}
    </p>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="13"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 14 14"
      width="13"
    >
      <path d="M2.5 7h9M7.5 3l4 4-4 4" />
    </svg>
  );
}

/* ─────────────────────────── Hero ─────────────────────────── */

function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-14 pt-28 md:pt-32 lg:pb-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <FadeIn>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5"
              style={{
                borderColor: colorMix(themeColors.green, 30),
                background: colorMix(themeColors.green, 9),
              }}
            >
              <span
                aria-hidden="true"
                className="available-pulse h-1.5 w-1.5 rounded-full"
                style={{ background: themeColors.green, boxShadow: `0 0 8px ${themeColors.green}` }}
              />
              <span
                className="font-mono text-[10.5px] uppercase tracking-[0.12em]"
                style={{ color: themeColors.green }}
              >
                Building AI systems in production
                <span className="hidden sm:inline"> · Bengaluru</span>
              </span>
            </span>
          </FadeIn>

          <FadeIn delay={0.06}>
            <h1 className="mt-7 text-balance font-display text-[42px] font-semibold leading-[1.04] tracking-[-0.030em] text-textPrimary sm:text-[52px] lg:text-[58px]">
              I build AI systems for work I used to do by hand.
            </h1>
          </FadeIn>

          <FadeIn delay={0.12}>
            <p className="mt-6 max-w-[560px] font-body text-[16px] leading-[1.75] text-textSecondary md:text-[17px]">
              Years inside clinical, legal, and sales operations taught me where the
              hours actually go. Then I learned to build. Now I ship AI into the tools those
              teams already use — one of them gives a legal team back{' '}
              <strong className="font-semibold text-textPrimary">433 hours a month</strong>{' '}
              and runs inside a public company&apos;s core platform.
            </p>
          </FadeIn>

          <FadeIn delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                className="group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 font-body text-[15px] font-semibold transition-transform duration-200 hover:-translate-y-0.5"
                href="/projects"
                style={{
                  background: themeColors.blue,
                  color: '#ffffff',
                  boxShadow: `0 10px 34px ${colorMix(themeColors.blue, 34)}`,
                }}
              >
                See the systems
                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>

              {/* Résumé CTA intentionally removed until a real PDF exists —
                  see forresume.md. Restore once public/resume.pdf is genuine. */}
              <Link
                className="inline-flex items-center gap-2.5 rounded-full border px-6 py-3.5 font-body text-[15px] font-medium text-textPrimary transition-colors duration-200"
                href="/about"
                style={{ borderColor: 'var(--surface-border-strong)' }}
              >
                How I got here
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.24}>
            <ul
              className="mt-8 grid gap-x-6 gap-y-2.5 border-t pt-6 sm:grid-cols-2"
              style={{ borderColor: 'var(--surface-border)' }}
            >
              {heroCredentials.map((credential) => (
                <li
                  className="flex items-center gap-2.5 font-body text-[12.5px] text-textSecondary"
                  key={credential}
                >
                  <span
                    aria-hidden="true"
                    className="h-1 w-1 shrink-0 rounded-full"
                    style={{ background: themeColors.blue, boxShadow: `0 0 6px ${themeColors.blue}` }}
                  />
                  {credential}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        {/* Deliberately after the copy in source order: on narrow screens the
            headline and the numbers must be what lands first. */}
        <FadeIn delay={0.1}>
          <HeroOrbit projectCount={projects.length} />
        </FadeIn>
      </div>

      {/* Metrics: the four numbers worth remembering. */}
      <FadeIn delay={0.3}>
        <dl className="mt-12 grid grid-cols-2 gap-3 lg:mt-14 lg:grid-cols-4 lg:gap-4">
          {heroMetrics.map((metric) => {
            const accent = themeColors[metric.accent];

            return (
              <div
                className="rounded-[16px] border p-5"
                key={metric.value}
                style={{
                  borderColor: colorMix(accent, 22),
                  background: `radial-gradient(ellipse 100% 70% at 50% 0%, ${colorMix(accent, 10)}, transparent 70%), var(--surface)`,
                }}
              >
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <p
                    className="font-display text-[30px] font-semibold leading-none tracking-[-0.02em] md:text-[34px]"
                    style={{ color: accent }}
                  >
                    {metric.value}
                  </p>
                  <p className="mt-3 font-body text-[12.5px] leading-[1.45] text-textSecondary">
                    {metric.label}
                  </p>
                </dd>
              </div>
            );
          })}
        </dl>
      </FadeIn>
    </section>
  );
}

/* ────────────────────── The bridge (thesis) ────────────────────── */

function Bridge() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <FadeIn className="max-w-2xl">
        <Eyebrow>How I work</Eyebrow>
        <h2 className="mt-4 text-balance font-display text-[34px] font-semibold leading-[1.08] tracking-[-0.025em] text-textPrimary md:text-[48px]">
          Most AI projects die in the handoff.
        </h2>
        <p className="mt-5 max-w-[620px] font-body text-[16px] leading-[1.75] text-textSecondary">
          Engineers build what the brief asks for. Operators write briefs from what they
          already know. The system that would have worked sits in the gap between them, and
          nobody owns that gap. What follows is the same three steps done by one person —
          not because that scales, but because it is the only way I have found to keep the
          problem intact all the way from the queue to production.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {bridgePillars.map((pillar, index) => {
          const accent = themeColors[pillar.accent];

          return (
            <FadeIn delay={0.06 * index} key={pillar.id}>
              <article
                className="relative flex h-full flex-col overflow-hidden rounded-[20px] border p-7"
                style={{
                  borderColor: colorMix(accent, 24),
                  background: `radial-gradient(ellipse 110% 60% at 0% 0%, ${colorMix(accent, 11)}, transparent 62%), var(--surface)`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-[2px]"
                  style={{ background: `linear-gradient(180deg, ${accent}, ${colorMix(accent, 12)})` }}
                />

                <div className="flex items-center gap-2.5">
                  <span
                    className="grid h-7 w-7 place-items-center rounded-full border font-mono text-[10px] font-medium tabular-nums"
                    style={{
                      background: colorMix(accent, 14),
                      borderColor: colorMix(accent, 44),
                      color: accent,
                    }}
                  >
                    {index + 1}
                  </span>
                  <Eyebrow color={accent}>{pillar.role}</Eyebrow>
                </div>

                <h3 className="mt-5 font-display text-[21px] font-semibold leading-tight text-textPrimary">
                  {pillar.claim}
                </h3>
                <p className="mt-3.5 font-body text-[14.5px] leading-[1.75] text-textSecondary">
                  {pillar.body}
                </p>

                <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
                  {pillar.evidence.map((line) => (
                    <li
                      className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em]"
                      key={line}
                      style={{
                        borderColor: colorMix(accent, 26),
                        background: colorMix(accent, 7),
                        color: accent,
                      }}
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </article>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.2}>
        <p className="mx-auto mt-16 max-w-[720px] text-balance text-center font-display text-[21px] font-medium leading-snug text-textSecondary md:mt-20 md:text-[26px]">
          CaseWise exists because I spent years doing legal intake{' '}
          <span className="text-textPrimary">before I ever wrote a line of it.</span>
        </p>
      </FadeIn>
    </section>
  );
}

/* ───────────────────── Featured systems ───────────────────── */

function Systems() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <FadeIn className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <Eyebrow>Selected systems</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-[34px] font-semibold leading-[1.08] tracking-[-0.025em] text-textPrimary md:text-[48px]">
            Four systems, four different kinds of hard.
          </h2>
        </div>
        <Link
          className="group inline-flex shrink-0 items-center gap-2 font-body text-[14px] font-medium text-textSecondary transition-colors duration-200 hover:text-textPrimary"
          href="/projects"
        >
          All {projects.length} case studies
          <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </FadeIn>

      <div className="mt-12 flex flex-col gap-4">
        {featuredSystems.map((system, index) => {
          const accent = themeColors[system.accent];

          return (
            <FadeIn delay={0.05 * index} key={system.id}>
              <Link
                className="group relative block overflow-hidden rounded-[22px] border p-7 transition-transform duration-200 hover:-translate-y-0.5 md:p-9"
                href={`/projects/${system.id}`}
                style={{
                  borderColor: colorMix(accent, 24),
                  background: `radial-gradient(ellipse 70% 90% at 100% 0%, ${colorMix(accent, 12)}, transparent 62%), var(--surface)`,
                }}
              >
                <div className="grid gap-7 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <Eyebrow color={accent}>{system.proves}</Eyebrow>
                      <span
                        className="rounded-full border px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.1em]"
                        style={{
                          borderColor: 'var(--surface-border-strong)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {system.status}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-[32px] font-bold leading-none tracking-[-0.026em] text-textPrimary md:text-[44px]">
                      {system.name}
                    </h3>

                    <p className="mt-4 max-w-[620px] font-body text-[14.5px] leading-[1.8] text-textSecondary">
                      {system.summary}
                    </p>

                    {/* The decision and what it cost. */}
                    <div
                      className="mt-5 max-w-[620px] rounded-[14px] border-l-2 py-1 pl-5"
                      style={{ borderColor: colorMix(accent, 55) }}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-textMuted">
                        The trade-off
                      </p>
                      <p className="mt-2.5 font-body text-[14px] leading-[1.75] text-textSecondary">
                        {system.tradeoff}
                      </p>
                    </div>

                    <span
                      className="mt-6 inline-flex items-center gap-2 font-body text-[14px] font-medium transition-all duration-200 group-hover:gap-3"
                      style={{ color: accent }}
                    >
                      Read the case study
                      <ArrowRight />
                    </span>
                  </div>

                  <div className="flex flex-col gap-5 lg:justify-center">
                    <dl className="grid grid-cols-3 gap-2.5">
                      {system.metrics.map((metric) => (
                        <div
                          className="rounded-[12px] border p-3.5"
                          key={metric.label}
                          style={{
                            borderColor: colorMix(accent, 18),
                            background: colorMix(accent, 6),
                          }}
                        >
                          <dt className="sr-only">{metric.label}</dt>
                          <dd>
                            <p
                              className="font-display text-[19px] font-semibold leading-none tracking-[-0.01em]"
                              style={{ color: accent }}
                            >
                              {metric.value}
                            </p>
                            <p className="mt-2 font-body text-[11.5px] leading-tight text-textMuted">
                              {metric.label}
                            </p>
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <ul className="flex flex-wrap gap-1.5">
                      {system.stack.map((tech) => (
                        <li className="tech-badge" key={tech}>
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}

/* ──────────────────────── Proof ──────────────────────── */

function Proof() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <FadeIn className="max-w-2xl">
        <Eyebrow>What happened next</Eyebrow>
        <h2 className="mt-4 text-balance font-display text-[34px] font-semibold leading-[1.08] tracking-[-0.025em] text-textPrimary md:text-[48px]">
          The proof isn&apos;t the praise. It&apos;s what they did after.
        </h2>
        <p className="mt-5 max-w-[580px] font-body text-[16px] leading-[1.75] text-textSecondary">
          Anyone can collect a compliment. These are the decisions leadership made once the
          system was in front of them.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {proofPoints.map((point, index) => {
          const accent = themeColors[point.accent];

          return (
            <FadeIn delay={0.06 * index} key={point.id}>
              <figure
                className="flex h-full flex-col rounded-[20px] border p-7"
                style={{ borderColor: colorMix(accent, 22), background: 'var(--surface)' }}
              >
                <Eyebrow color={accent}>{point.label}</Eyebrow>
                <blockquote className="mt-5 flex-1">
                  <p className="font-body text-[15px] leading-[1.75] text-textPrimary">
                    &ldquo;{point.quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-5 font-mono text-[10px] uppercase tracking-[0.1em] text-textMuted">
                  {point.attribution}
                </figcaption>
                <p
                  className="mt-5 border-t pt-4 font-body text-[13px] font-medium leading-snug"
                  style={{ borderColor: colorMix(accent, 20), color: accent }}
                >
                  {point.consequence}
                </p>
              </figure>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.2}>
        <div className="mt-6 flex justify-center">
          <Link
            className="group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-body text-[14px] font-medium text-textSecondary transition-colors duration-200 hover:text-textPrimary"
            href="/recognition"
            style={{ borderColor: 'var(--surface-border-strong)' }}
          >
            See the full record
            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}

/* ──────────────────────── Closing ──────────────────────── */

function Closing() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-8 lg:pb-28">
      <FadeIn>
        <div
          className="relative overflow-hidden rounded-[26px] border px-7 py-12 text-center md:px-12 md:py-16"
          style={{
            borderColor: colorMix(themeColors.blue, 26),
            background: [
              `radial-gradient(ellipse 60% 90% at 50% 0%, ${colorMix(themeColors.blue, 15)}, transparent 66%)`,
              `radial-gradient(ellipse 50% 70% at 100% 100%, ${colorMix(themeColors.cyan, 10)}, transparent 60%)`,
              'var(--surface)',
            ].join(', '),
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-12 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${colorMix(themeColors.blue, 70)}, transparent)`,
            }}
          />

          <h2 className="mx-auto max-w-[680px] text-balance font-display text-[30px] font-semibold leading-[1.12] tracking-[-0.026em] text-textPrimary md:text-[42px]">
            If your team is doing something by hand that a system should own, that is my
            favourite kind of problem.
          </h2>
          <p className="mx-auto mt-5 max-w-[480px] font-body text-[15.5px] leading-[1.7] text-textSecondary">
            Tell me what the work looks like today. I will tell you honestly whether AI is
            the right answer for it.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              className="group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 font-body text-[15px] font-semibold transition-transform duration-200 hover:-translate-y-0.5"
              href="/contact"
              style={{
                background: themeColors.blue,
                color: '#ffffff',
                boxShadow: `0 10px 34px ${colorMix(themeColors.blue, 32)}`,
              }}
            >
              Start a conversation
              <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <a
              className="inline-flex items-center gap-2.5 rounded-full border px-6 py-3.5 font-body text-[15px] font-medium text-textPrimary"
              href="mailto:tousifarsen@gmail.com"
              style={{ borderColor: 'var(--surface-border-strong)' }}
            >
              tousifarsen@gmail.com
            </a>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

/* ──────────────────────── Page ──────────────────────── */

export default function HomePage() {
  return (
    <main className="dot-grid relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[900px]"
        style={{
          background: [
            'radial-gradient(ellipse 60% 50% at 70% 0%, color-mix(in srgb, var(--blue) 16%, transparent), transparent 70%)',
            'radial-gradient(ellipse 45% 40% at 5% 12%, color-mix(in srgb, var(--cyan) 10%, transparent), transparent 65%)',
          ].join(', '),
        }}
      />

      <Hero />
      <Bridge />
      <Systems />
      <Proof />
      <Closing />
    </main>
  );
}
