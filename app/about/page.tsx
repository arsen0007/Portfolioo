'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { colorMix, themeColors } from '@/lib/constants/colors';
import type { AccentColor } from '@/lib/constants/colors';

type PathChapter = {
  body: string;
  color: AccentColor;
  era: string;
  title: string;
};

const bioParagraphs = [
  "I have never waited for the right tools, the right environment, or the right moment. As a kid, I was building from scrap, pushing every device I owned past what it was designed for, and going all the way - even when all the way meant frying the house wiring.",
  "Before I had a proper computer, I was already deep in it — running a full Linux environment on a phone because it was the only machine I had. There was a new problem almost every day, and I loved the moment when it finally clicked. When I got my first real laptop, I wasn't starting. I was continuing.",
  "Seven years in operations taught me how systems actually behave under pressure from the inside. That changed how I build. When I see something that should exist but doesn't — I can't move on until it's real.",
  "Today I build AI systems that become part of real operations. Not prototypes. Not demos. Tools people actually use. That instinct is the product.",
] as const;

const pathChapters: PathChapter[] = [
  {
    era: '2017 - 2024',
    color: 'cyan',
    title: 'Seven Years of Seeing the Gap',
    body: "I spent seven years inside real operations — legal intake, clinical operations, and B2B sales across healthcare, travel, and tech. Different industries, same education. I learned what was missing, why it was missing, and why nobody had built it yet. That knowledge doesn't leave you.",
  },
  {
    era: '2024 - 2025',
    color: 'blue',
    title: 'Turning Attention Into Systems',
    body: "Paying close attention stopped being enough. I started building — the same way I had always learned: by doing it until something worked. The problems I chose weren't random. They were the ones I had lived inside for years. That's still how I choose what to build.",
  },
  {
    era: '2025 - Now',
    color: 'purple',
    title: 'Building Into Real Infrastructure',
    body: "The work moved from side projects into real infrastructure. What I build now runs inside actual company systems, used by real people every day. The drive never changed. The systems got bigger. I didn't change how I think. I just got the tools to match.",
  },
];

const accentByColor: Record<AccentColor, string> = {
  blue: themeColors.blue,
  green: themeColors.green,
  cyan: themeColors.cyan,
  amber: themeColors.amber,
  purple: themeColors.purple,
};

const statChips = [
  { value: '7+', label: 'Years in Ops' },
  { value: '4+', label: 'Systems Built' },
  { value: '4', label: 'Live in Production' },
] as const;

const skillDomains = [
  {
    name: 'AI Systems',
    label: 'DOMAIN 01',
    color: themeColors.blue as string,
    skills: [
      { name: 'AI Agents', proof: 'CaseWise' },
      { name: 'Prompt Engineering', proof: 'CaseWise' },
      { name: 'Gemini API', proof: 'CaseWise' },
    ],
  },
  {
    name: 'Engineering',
    label: 'DOMAIN 02',
    color: themeColors.green as string,
    skills: [
      { name: 'Python', proof: 'BarHunter · Mail Merge' },
      { name: 'Next.js', proof: 'CaseWise · BarHunter' },
      { name: 'Web Scraping', proof: 'BarHunter' },
    ],
  },
  {
    name: 'Product',
    label: 'DOMAIN 03',
    color: themeColors.amber as string,
    skills: [
      { name: 'Product Management', proof: '6 Certs · CaseWise' },
      { name: 'Claude Code', proof: 'Certified' },
    ],
  },
] as const;

const stackSkills = [
  'TypeScript', 'PostgreSQL', 'Supabase', 'Flask', 'Pandas',
  'Playwright', 'Tailwind CSS', 'REST APIs', 'Vercel', 'Linux', 'AI Workflows',
];

const exploringSkills = ['Voice AI', 'LangChain', 'Multi-Agent Architecture', 'RAG', 'n8n'];

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
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionLabel>MY STORY</SectionLabel>
          <h1 className="mt-4 text-balance font-display text-[34px] font-medium leading-tight text-textPrimary md:text-[44px]">
            I see what&apos;s missing. Then I build it.
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] font-body text-[15px] leading-[1.8] text-textSecondary md:text-base">
            The gap between what exists and what should exist has always been the most visible thing in any room.
          </p>
        </motion.div>

        <motion.div
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
                  Seven years inside real operations — the gap between what exists and what should exist is always visible. I just can&apos;t walk past it.
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
        </motion.div>
      </section>

      <section className="relative mx-auto mt-20 max-w-6xl px-6">
        <motion.div
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
                <motion.div
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
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto mt-20 max-w-6xl px-6">
        <motion.div
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
            Seven years of seeing what should exist. Then building exactly that.
          </p>
        </motion.div>

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
              <motion.article
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
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Skill Tree */}
      <section className="relative mx-auto mt-20 max-w-6xl px-6">
        <motion.div
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

              {/* ── CORE SKILLS ── */}
              <p className="mb-6 font-mono text-[9px] uppercase tracking-[0.18em] text-textMuted">Core — proof-backed</p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {skillDomains.flatMap((domain) =>
                  domain.skills.map((skill, si) => (
                    <motion.div
                      key={skill.name}
                      className="group relative overflow-hidden rounded-[14px] border p-4"
                      initial={{ opacity: 0, y: 10 }}
                      transition={{ delay: si * 0.05, duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true }}
                      whileInView={{ opacity: 1, y: 0 }}
                      style={{
                        borderColor: colorMix(domain.color, 22),
                        background: `radial-gradient(ellipse 100% 80% at 50% 120%, ${colorMix(domain.color, 13)}, var(--surface))`,
                      }}
                    >
                      <div aria-hidden="true" className="absolute left-0 top-0 h-full w-[2px]" style={{ background: `linear-gradient(180deg, ${domain.color}, ${colorMix(domain.color, 30)})` }} />
                      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, ${colorMix(domain.color, 50)}, transparent)` }} />
                      <p className="font-mono text-[8px] uppercase tracking-[0.14em]" style={{ color: domain.color }}>{domain.name}</p>
                      <p className="mt-1.5 font-display text-[15px] font-semibold leading-snug text-textPrimary">{skill.name}</p>
                      <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: colorMix(domain.color, 70) }}>{skill.proof}</p>
                    </motion.div>
                  ))
                )}
              </div>

              {/* ── SEPARATOR ── */}
              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1" style={{ background: colorMix(themeColors.blue, 12) }} />
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-textMuted">Supporting stack</span>
                <div className="h-px flex-1" style={{ background: colorMix(themeColors.blue, 12) }} />
              </div>

              {/* ── SUPPORTING SKILLS ── */}
              <div className="flex flex-wrap gap-2">
                {stackSkills.map((s) => (
                  <span key={s} className="tech-badge">{s}</span>
                ))}
              </div>

              {/* ── BUILDING TOWARD ── */}
              <div className="mt-6 flex items-center gap-4">
                <div className="h-px flex-1" style={{ background: colorMix(themeColors.cyan, 10) }} />
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-textMuted">Building toward</span>
                <div className="h-px flex-1" style={{ background: colorMix(themeColors.cyan, 10) }} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {exploringSkills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em]"
                    style={{
                      border: `1px dashed ${colorMix(themeColors.cyan, 28)}`,
                      color: colorMix(themeColors.cyan, 55),
                      background: colorMix(themeColors.cyan, 5),
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </motion.div>
      </section>

      {/* Certifications CTA */}
      <section className="relative mx-auto mt-16 max-w-6xl px-6">
        <motion.div
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
                6 certifications earned.
              </h2>
              <p className="mt-2 font-body text-[14px] leading-[1.7] text-textSecondary">
                CEO sponsored. 4 more in progress.
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
        </motion.div>
      </section>
    </main>
  );
}
