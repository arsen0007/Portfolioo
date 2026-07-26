import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';
import { colorMix, themeColors } from '@/lib/constants/colors';
import { projects } from '@/lib/data/projects';

const project = projects.find((p) => p.id === 'le-mans-t2')!;
const accent = themeColors.amber;

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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 text-balance font-display text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-textPrimary md:text-[32px]">
      {children}
    </h2>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 grid max-w-[680px] gap-4 font-body text-[15px] leading-[1.85] text-textSecondary">
      {children}
    </div>
  );
}

export default function LeMansT2Page() {
  return (
    <main className="dot-grid relative overflow-hidden pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[760px]"
        style={{
          background: [
            `radial-gradient(ellipse 70% 44% at 50% 0%, ${colorMix(accent, 15)}, transparent 70%)`,
            `radial-gradient(ellipse 44% 38% at 92% 24%, ${colorMix(themeColors.green, 9)}, transparent 65%)`,
          ].join(', '),
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 pt-28">
        <FadeIn>
          <Link
            className="group inline-flex items-center gap-2 font-body text-[13px] text-textSecondary transition-colors duration-200 hover:text-textPrimary"
            href="/projects"
          >
            <svg
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
              fill="none"
              height="12"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
              viewBox="0 0 12 12"
              width="12"
            >
              <path d="M9.5 6h-7M5.5 2.5L2 6l3.5 3.5" />
            </svg>
            All projects
          </Link>
        </FadeIn>

        {/* Hero */}
        <FadeIn delay={0.05}>
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
              style={{
                borderColor: colorMix(accent, 34),
                background: colorMix(accent, 11),
                color: accent,
              }}
            >
              Global winner · ClearRoute x Le Mans 24h Hackathon
            </span>
            <span
              className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-textMuted"
              style={{ borderColor: 'var(--surface-border-strong)' }}
            >
              Competition build · 24 hours
            </span>
          </div>

          <h1 className="mt-6 text-balance font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] text-textPrimary md:text-[60px]">
            Le Man&apos;s T2
          </h1>

          <p className="mt-5 max-w-[660px] text-balance font-display text-[20px] font-medium leading-[1.35] text-textPrimary md:text-[24px]">
            We did not win with a better model. We won by changing what the model
            outputs.
          </p>

          <p className="mt-5 max-w-[680px] font-body text-[15.5px] leading-[1.8] text-textSecondary">
            ClearRoute runs an annual motorsport hackathon in partnership with United
            Autosports — a 24-hour build synchronised with the 24 Hours of Le Mans, run
            simultaneously across four international offices. Our team of five in Bangalore
            entered a real-time failure prediction system and took the global title. I
            originated the idea and engineered the architecture.
          </p>
        </FadeIn>

        {/* Metrics */}
        <FadeIn delay={0.1}>
          <dl className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {project.impact.map((metric) => (
              <div
                className="rounded-[14px] border p-5"
                key={metric.label}
                style={{
                  borderColor: colorMix(accent, 20),
                  background: `radial-gradient(ellipse 100% 70% at 50% 0%, ${colorMix(accent, 9)}, transparent 70%), var(--surface)`,
                }}
              >
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <p
                    className="font-display text-[28px] font-semibold leading-none tracking-[-0.02em]"
                    style={{ color: accent }}
                  >
                    {metric.value}
                  </p>
                  <p className="mt-2.5 font-body text-[12px] leading-[1.45] text-textMuted">
                    {metric.label}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>

        {/* Problem */}
        <FadeIn delay={0.05}>
          <section className="mt-20">
            <Eyebrow>The problem</Eyebrow>
            <SectionTitle>A car tells you it is failing. Nobody is listening in time.</SectionTitle>
            <Prose>
              <p>
                Endurance racing runs cars flat out for twenty-four hours, and components
                fail mid-race. Engineers find out after the damage rather than before. A
                retirement costs a team money and championship position.
              </p>
              <p>
                The signal was already there in the telemetry. Nothing was turning it into
                something a person could act on <em>while the race was still running</em>.
                That gap — between data that exists and a decision someone can make — was
                the actual problem, and it is not a modelling problem.
              </p>
            </Prose>
          </section>
        </FadeIn>

        {/* The decision that won */}
        <FadeIn delay={0.05}>
          <section className="mt-20">
            <div
              className="relative overflow-hidden rounded-[22px] border p-8 md:p-10"
              style={{
                borderColor: colorMix(accent, 28),
                background: `radial-gradient(ellipse 70% 80% at 100% 0%, ${colorMix(accent, 13)}, transparent 64%), var(--surface)`,
              }}
            >
              <Eyebrow color={accent}>The decision that won it</Eyebrow>
              <SectionTitle>Predict laps, not probability.</SectionTitle>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div
                  className="rounded-[16px] border p-6"
                  style={{
                    borderColor: 'var(--surface-border-strong)',
                    background: 'color-mix(in srgb, var(--surface-raised) 60%, transparent)',
                  }}
                >
                  <Eyebrow>What a model usually says</Eyebrow>
                  <p className="mt-4 font-display text-[22px] font-semibold text-textMuted">
                    73% chance of failure
                  </p>
                  <p className="mt-3 font-body text-[13.5px] leading-[1.7] text-textMuted">
                    Technically correct, and it hands the hard part back to a person who is
                    already busy. Seventy-three percent of what, by when, and do I pit now?
                  </p>
                </div>

                <div
                  className="rounded-[16px] border p-6"
                  style={{
                    borderColor: colorMix(accent, 40),
                    background: colorMix(accent, 9),
                  }}
                >
                  <Eyebrow color={accent}>What we shipped</Eyebrow>
                  <p
                    className="mt-4 font-display text-[22px] font-semibold"
                    style={{ color: accent }}
                  >
                    9 laps remaining
                  </p>
                  <p className="mt-3 font-body text-[13.5px] leading-[1.7] text-textSecondary">
                    Same underlying prediction. But a lap count is already a decision — it
                    lines up with pit windows, stint planning, and the way a race engineer
                    thinks under pressure.
                  </p>
                </div>
              </div>

              <Prose>
                <p>
                  Most teams reach for a better model. The thing that made ours useful was
                  not the algorithm — it was choosing an output contract that matched how
                  the user already works. A probability is a number you have to interpret. A
                  lap count is a number you can act on.
                </p>
                <p>
                  The judging reflected that. Entries were assessed on impact to real team
                  performance rather than demo polish, and that is the difference between a
                  model that is impressive and a model that gets used.
                </p>
              </Prose>
            </div>
          </section>
        </FadeIn>

        {/* What we built */}
        <FadeIn delay={0.05}>
          <section className="mt-20">
            <Eyebrow>What we built</Eyebrow>
            <SectionTitle>A complete pipeline, inside the window.</SectionTitle>
            <Prose>
              <p>
                Simulated sensor telemetry fed a Python and Flask backend running the failure
                model. Predictions streamed over WebSockets to a React and TypeScript
                frontend, which rendered a 3D view of the car showing which components were
                at risk and how much longer they had.
              </p>
              <p>
                Three smaller decisions followed from the first one.{' '}
                <strong className="font-semibold text-textPrimary">Streaming, not polling</strong>{' '}
                — race data is only useful while the race is happening, so the dashboard had
                to show the current state of the car rather than the state at the last
                refresh.{' '}
                <strong className="font-semibold text-textPrimary">A 3D view, not a table</strong>{' '}
                — someone under pressure reads a picture of the car faster than a list of
                component names. And{' '}
                <strong className="font-semibold text-textPrimary">simulated sensors</strong>{' '}
                — real telemetry was not available, and simulating it was the honest way to
                prove the pipeline end to end instead of faking the demo with fixed values.
              </p>
            </Prose>

            <div className="mt-8 flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span className="tech-badge" key={tech}>
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Constraints + outcome */}
        <FadeIn delay={0.05}>
          <section className="mt-20 grid gap-4 md:grid-cols-2">
            <div
              className="rounded-[18px] border p-7"
              style={{ borderColor: 'var(--surface-border-strong)', background: 'var(--surface)' }}
            >
              <Eyebrow>Constraints</Eyebrow>
              <ul className="mt-5 grid gap-3">
                {project.story.constraints.map((constraint) => (
                  <li
                    className="flex gap-3 font-body text-[14px] leading-[1.7] text-textSecondary"
                    key={constraint}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1 w-1 shrink-0 rounded-full"
                      style={{ background: accent }}
                    />
                    {constraint}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-[18px] border p-7"
              style={{
                borderColor: colorMix(themeColors.green, 24),
                background: colorMix(themeColors.green, 6),
              }}
            >
              <Eyebrow color={themeColors.green}>Where it was going</Eyebrow>
              <p className="mt-5 font-body text-[14px] leading-[1.8] text-textSecondary">
                The roadmap we presented — driver radio sentiment analysis, historical data
                to sharpen accuracy, and proactive alerting straight to engineers — all
                pointed the same direction: move the system further toward{' '}
                <strong className="font-semibold text-textPrimary">
                  making the decision
                </strong>{' '}
                rather than reporting the data.
              </p>
            </div>
          </section>
        </FadeIn>

        {/* Honest note */}
        <FadeIn delay={0.05}>
          <p className="mt-16 max-w-[680px] font-body text-[13.5px] leading-[1.75] text-textMuted">
            Worth being clear about what this is: a twenty-four hour competition build by a
            team of five, not a production system with users. The idea and the architecture
            were mine; four other people built it with me. What it demonstrates is a
            decision made under time pressure and judged by other people — which is the part
            that does not transfer from a portfolio.
          </p>
        </FadeIn>

        {/* Next */}
        <FadeIn delay={0.05}>
          <nav
            aria-label="More projects"
            className="mt-12 flex flex-wrap gap-3 border-t pt-10"
            style={{ borderColor: 'var(--surface-border)' }}
          >
            <Link
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 font-body text-[14px] font-medium text-textPrimary transition-colors duration-200"
              href="/recognition"
              style={{ borderColor: colorMix(accent, 34) }}
            >
              The rest of the record
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 font-body text-[14px] font-medium text-textSecondary transition-colors duration-200 hover:text-textPrimary"
              href="/projects"
              style={{ borderColor: 'var(--surface-border-strong)' }}
            >
              All projects
            </Link>
          </nav>
        </FadeIn>
      </div>
    </main>
  );
}
