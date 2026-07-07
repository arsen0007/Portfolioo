'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { colorMix, themeColors } from '@/lib/constants/colors';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { delay, duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
});

const stats = [
  { value: '96%', label: 'Time reduction', color: themeColors.blue, glow: themeColors.blueGlow },
  { value: '433h', label: 'Saved per month (Legal)', color: themeColors.purple, glow: themeColors.purpleGlow },
  { value: '2,700', label: 'Cases monthly', color: themeColors.amber, glow: themeColors.amberGlow },
  { value: '~12x', label: 'Estimated ROI', color: themeColors.green, glow: themeColors.greenGlow },
];

const aiPipeline = [
  { step: '01', label: 'Classification', sublabel: 'AI reads the case description and maps it to the correct category and subcategory — no legal expertise required from the intake team.', color: themeColors.blue },
  { step: '02', label: 'Summarization', sublabel: 'Generates a clean structured case summary from messy call notes', color: themeColors.purple },
  { step: '03', label: 'Attorney Outreach', sublabel: 'Produces a ready-to-use outreach draft pulled directly from the case details', color: themeColors.cyan },
];

const endorsements = [
  {
    name: 'Alan King',
    role: 'CEO',
    color: themeColors.amber,
    action: '$5,000 Product School Scholarship',
    quote: 'You blew me away first thing in the morning. Extraordinary dedication to making the organisation better.',
  },
  {
    name: 'Praveen Kodikkambrath',
    role: 'CTO',
    color: themeColors.blue,
    action: 'Integrated into core UCMS',
    quote: 'Paired with Senior System Architect and AI Team Lead for production development.',
  },
  {
    name: 'Arun Raj',
    role: 'CISO',
    color: themeColors.green,
    action: 'Public Endorsement',
    quote: 'The idea is fantastic. It is extraordinary and saves a lot of time.',
  },
];

const stack = [
  'Next.js 14', 'TypeScript', 'LLM API', 'Data Integration',
  'Workflow Engine', 'Supabase', 'Tailwind CSS', 'Framer Motion',
];

export default function CaseWisePage() {
  return (
    <main className="dot-grid relative min-h-screen pb-24">
      {/* Atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            'radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--blue) 14%, transparent), transparent)',
            'radial-gradient(ellipse 50% 40% at 0% 55%, color-mix(in srgb, var(--purple) 13%, transparent), transparent)',
            'radial-gradient(ellipse 50% 40% at 100% 80%, color-mix(in srgb, var(--cyan) 12%, transparent), transparent)',
          ].join(', '),
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-28">

        {/* Back */}
        <motion.div {...fadeUp(0)}>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-textMuted transition-colors hover:text-textPrimary"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M9 2.5 4.5 7 9 11.5" />
            </svg>
            All projects
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div className="mt-10" {...fadeUp(0.05)}>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ background: colorMix(themeColors.blue, 14), color: themeColors.blue, border: `1px solid ${colorMix(themeColors.blue, 28)}` }}
            >
              AI Legal Intake System
            </span>
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ background: colorMix(themeColors.amber, 10), color: themeColors.amber, border: `1px solid ${colorMix(themeColors.amber, 24)}` }}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: themeColors.amber, boxShadow: `0 0 8px ${themeColors.amber}` }} />
              Company Innovation Feature
            </span>
          </div>
          <h1 className="font-display text-[52px] font-semibold leading-[1.05] tracking-tight text-textPrimary md:text-[72px]">
            CaseWise
          </h1>
          <p className="mt-4 max-w-[620px] font-body text-[17px] leading-[1.8] text-textSecondary">
            An AI pipeline that replaced manual legal case processing — built in-house, adopted at the company level.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} {...fadeUp(0.1 + i * 0.07)}>
              <div
                className="bento-card relative flex flex-col justify-between p-6"
                style={{
                  borderColor: colorMix(stat.color, 24),
                  background: `radial-gradient(ellipse 120% 80% at 50% 100%, ${colorMix(stat.color, 12)}, var(--surface))`,
                  minHeight: '120px',
                }}
              >
                <div aria-hidden="true" className="bento-shimmer" />
                <span className="about-stat-number stat-pulse" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-textMuted">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Pipeline + Problem side by side */}
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.4fr]">

          {/* Problem */}
          <motion.div {...fadeUp(0.16)}>
            <div
              className="bento-card h-full p-7"
              style={{ borderColor: colorMix(themeColors.purple, 20) }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: themeColors.purple }}>
                The Problem
              </p>
              <h2 className="mt-4 font-display text-[22px] font-medium leading-snug text-textPrimary">
                Operations absorbing what systems should own.
              </h2>
              <p className="mt-4 font-body text-[14px] leading-[1.85] text-textSecondary">
                The legal team was handling approximately 2,700 cases per month. Each case required manual classification, summarization, and attorney outreach preparation — a process that took 5 to 15 minutes per case.
              </p>
              <p className="mt-3 font-body text-[14px] leading-[1.85] text-textSecondary">
                The process depended heavily on legal knowledge many team members didn&apos;t have. Complex cases required waiting for senior guidance. The intake team faced the same classification challenge at scale.
              </p>

              {/* Timeline */}
              <div className="mt-6 space-y-3">
                {[
                  { event: 'Built internal prototype · CEO-sponsored Product School · Public company blog feature', when: '2025', color: themeColors.green },
                  { event: 'CTO integrating into core system (ongoing)', when: '2026', color: themeColors.blue },
                ].map((item) => (
                  <div key={item.event} className="flex items-center gap-3">
                    <span
                      className="shrink-0 rounded-full h-1.5 w-1.5"
                      style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }}
                    />
                    <span className="font-mono text-[10px]" style={{ color: item.color }}>{item.when}</span>
                    <span className="font-body text-[13px] text-textSecondary">{item.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* AI Pipeline */}
          <motion.div {...fadeUp(0.2)}>
            <div
              className="bento-card h-full p-7"
              style={{ borderColor: colorMix(themeColors.blue, 18) }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: themeColors.blue }}>
                AI Pipeline
              </p>
              <h2 className="mt-4 font-display text-[20px] font-medium text-textPrimary">
                Three-stage intelligent workflow
              </h2>
              <div className="mt-6 space-y-2">
                {aiPipeline.map((step, i) => (
                  <div
                    key={step.step}
                    className="flex items-start gap-3 rounded-[10px] border p-3"
                    style={{
                      borderColor: colorMix(step.color, 20),
                      background: colorMix(step.color, 8),
                    }}
                  >
                    <div className="flex flex-col items-center pt-1 gap-1">
                      <div
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-bold"
                        style={{ background: colorMix(step.color, 20), color: step.color, border: `1px solid ${colorMix(step.color, 35)}` }}
                      >
                        {step.step}
                      </div>
                      {i < aiPipeline.length - 1 && (
                        <div className="w-px min-h-[14px]" style={{ background: colorMix(step.color, 20) }} />
                      )}
                    </div>
                    <div>
                      <p className="font-display text-[13px] font-medium text-textPrimary">{step.label}</p>
                      <p className="mt-0.5 font-body text-[11px] leading-[1.5] text-textMuted">{step.sublabel}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 font-body text-[12px] leading-[1.7] text-textMuted">
                Human review built in — edit classifications and summaries before committing.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Leadership endorsements — full width, 3 cards */}
        <motion.div className="mt-4" {...fadeUp(0.22)}>
          <div
            className="bento-card p-7"
            style={{
              borderColor: colorMix(themeColors.amber, 24),
              background: `radial-gradient(ellipse 60% 80% at 0% 50%, ${colorMix(themeColors.amber, 7)}, transparent 55%), var(--surface)`,
            }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: themeColors.amber }}>
              C-Suite Response
            </p>
            <h2 className="mt-3 font-display text-[22px] font-medium text-textPrimary">
              They didn&apos;t just say it was good. They acted on it.
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {endorsements.map((e) => (
                <div
                  key={e.name}
                  className="relative flex flex-col rounded-[14px] border p-5"
                  style={{
                    borderColor: colorMix(e.color, 20),
                    background: colorMix(e.color, 7),
                  }}
                >
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: e.color }}>{e.role}</p>
                    <p className="mt-1 font-display text-[15px] font-semibold text-textPrimary">{e.name}</p>
                    <p className="mt-0.5 font-mono text-[10px]" style={{ color: e.color }}>{e.action}</p>
                  </div>
                  <blockquote className="mt-4 border-l-2 pl-3" style={{ borderColor: colorMix(e.color, 35) }}>
                    <p className="font-body text-[12px] italic leading-[1.8] text-textSecondary">
                      &ldquo;{e.quote}&rdquo;
                    </p>
                    <footer className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] not-italic" style={{ color: colorMix(e.color, 70) }}>
                      <cite>{e.name}, {e.role}</cite>
                    </footer>
                  </blockquote>
                </div>
              ))}
            </div>

            {/* Public record link */}
            <div className="mt-6 flex items-center gap-3 rounded-[12px] border p-4" style={{ borderColor: colorMix(themeColors.amber, 22), background: colorMix(themeColors.amber, 6) }}>
              <div
                aria-hidden="true"
                className="h-2 w-2 rounded-full shrink-0"
                style={{ background: themeColors.amber, boxShadow: `0 0 8px ${themeColors.amber}` }}
              />
              <div className="flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: themeColors.amber }}>Public Record · Workplace Options Blog · July 2025</p>
                <p className="mt-0.5 font-body text-[13px] text-textSecondary">
                  &quot;Pitch-It Summer 2025: Innovation from the Inside Out&quot; — featured as a company innovation story.
                </p>
              </div>
              <a
                href="https://www.workplaceoptions.com/blog/pitch-it-summer-2025-innovation-from-the-inside-out/"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] transition-opacity hover:opacity-60"
                style={{ color: themeColors.amber }}
              >
                Read →
              </a>
            </div>
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div className="mt-4" {...fadeUp(0.26)}>
          <div className="bento-card p-7" style={{ borderColor: colorMix(themeColors.blue, 22) }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: themeColors.blue }}>Tech Stack</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {stack.map((tech) => (
                <span key={tech} className="tech-badge">{tech}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA row */}
        <motion.div className="mt-8 flex flex-wrap gap-3" {...fadeUp(0.3)}>
          <Link
            href="/architecture"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] transition-all duration-200"
            style={{ borderColor: colorMix(themeColors.blue, 28), color: themeColors.blue, background: colorMix(themeColors.blue, 8) }}
          >
            View full system architecture
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2.5 9.5l7-7M9.5 2.5H4m5.5 0v5.5" />
            </svg>
          </Link>
          <Link
            href="/recognition"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] transition-all duration-200"
            style={{ borderColor: colorMix(themeColors.amber, 28), color: themeColors.amber, background: colorMix(themeColors.amber, 6) }}
          >
            See the recognition
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-textMuted transition-colors hover:text-textPrimary"
            style={{ borderColor: 'var(--surface-border)' }}
          >
            Other projects
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
