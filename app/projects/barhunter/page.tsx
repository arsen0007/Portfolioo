'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { colorMix, themeColors } from '@/lib/constants/colors';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { delay, duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
});

const barHunterStats = {
  totalLeads: 94363,
  activeMembers: 88739,
  activePercent: 94,
  jurisdictions: 5,
  practiceCategories: 16,
  countries: 2,
};

const jurisdictionList = [
  { name: 'Arizona', code: 'AZ' },
  { name: 'California', code: 'CA' },
  { name: 'Manitoba', code: 'MB' },
  { name: 'Ontario', code: 'ON' },
  { name: 'Washington', code: 'WA' },
];

const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

const stats = [
  { value: formatNumber(barHunterStats.totalLeads), label: 'Total Leads', color: themeColors.green, glow: themeColors.greenGlow },
  { value: `${barHunterStats.activePercent}%`, label: 'Active Members', color: themeColors.cyan, glow: themeColors.cyanGlow },
  { value: `${barHunterStats.practiceCategories}`, label: 'Practice Categories', color: themeColors.amber, glow: themeColors.amberGlow },
  { value: `${jurisdictionList.length}`, label: 'States / Provinces', color: themeColors.blue, glow: themeColors.blueGlow },
];

const stack = [
  'Next.js 14', 'TypeScript', 'Supabase', 'PostgreSQL', 'RLS',
  'Python', 'Vercel',
];

const pipeline = [
  { layer: 'Part 1 - The Scraping Backend', label: 'Source research per jurisdiction', color: themeColors.cyan, sublabel: 'Every state and province runs a different system. The structure of each source is studied before any extraction is written — the source determines the approach.' },
  { layer: 'Part 1 - The Scraping Backend', label: 'Custom extraction per jurisdiction', color: themeColors.amber, sublabel: 'Each jurisdiction gets its own purpose-built extractor. Reliability checks run continuously to detect degraded data before it reaches the database.' },
  { layer: 'Part 1 - The Scraping Backend', label: 'One clean lead schema', color: themeColors.blue, sublabel: `Raw records from every source are normalized into one canonical dataset: ${barHunterStats.practiceCategories} practice categories, standardized fields, and fault-tolerant writes.` },
  { layer: 'Part 2 - The Recruiter Platform', label: 'Secure lead database', color: themeColors.green, sublabel: `${formatNumber(barHunterStats.totalLeads)} leads in a structured database with row-level security. Recruiters see only the data they are authorized to access.` },
  { layer: 'Part 2 - The Recruiter Platform', label: 'Campaign-ready search', color: themeColors.amber, sublabel: 'Filter by state, city, practice category, admission year, and status. A usable campaign list appears in under 60 seconds.' },
  { layer: 'Part 2 - The Recruiter Platform', label: 'Conflict detection before export', color: themeColors.blue, sublabel: 'Selected leads are automatically checked against existing client lists. Conflicts are flagged and removed before the CSV is generated.' },
  { layer: 'Part 2 - The Recruiter Platform', label: 'CSV to outreach workflow', color: themeColors.green, sublabel: 'Clean CSV export ready for mail merge. Downloads are logged so admins know who pulled what and when.' },
];

const pipelineParts = [
  {
    id: 'backend',
    label: 'Part 1',
    title: 'The Scraping Backend',
    steps: pipeline.slice(0, 3),
  },
  {
    id: 'platform',
    label: 'Part 2',
    title: 'The Recruiter Platform',
    steps: pipeline.slice(3),
  },
] as const;

export default function BarHunterPage() {
  const [activePipelinePart, setActivePipelinePart] = useState<0 | 1>(0);
  const [isPipelinePaused, setIsPipelinePaused] = useState(false);
  const currentPipelinePart = pipelineParts[activePipelinePart];
  const nextPipelinePart = pipelineParts[activePipelinePart === 0 ? 1 : 0];

  useEffect(() => {
    if (isPipelinePaused) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActivePipelinePart((current) => (current === 0 ? 1 : 0));
    }, 8500);

    return () => window.clearInterval(intervalId);
  }, [isPipelinePaused]);

  return (
    <main className="dot-grid relative min-h-screen pb-24">
      {/* Atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            'radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--green) 16%, transparent), transparent)',
            'radial-gradient(ellipse 50% 40% at 0% 60%, color-mix(in srgb, var(--cyan) 12%, transparent), transparent)',
            'radial-gradient(ellipse 50% 40% at 100% 80%, color-mix(in srgb, var(--blue) 12%, transparent), transparent)',
          ].join(', '),
        }}
      />

      {/* Back nav */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-28">
        <motion.div {...fadeUp(0)}>
          <Link
            href="/?orbit=projects"
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
              style={{ background: colorMix(themeColors.green, 14), color: themeColors.green, border: `1px solid ${colorMix(themeColors.green, 28)}` }}
            >
              Lead Sourcing Engine
            </span>
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ background: colorMix(themeColors.green, 8), color: themeColors.green, border: `1px solid ${colorMix(themeColors.green, 20)}` }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: themeColors.green, boxShadow: `0 0 8px ${themeColors.green}` }} />
              Live · Production
            </span>
          </div>
          <h1 className="font-display text-[52px] font-semibold leading-[1.05] tracking-tight text-textPrimary md:text-[72px]">
            BarHunter
          </h1>
          <p className="mt-4 max-w-[600px] font-body text-[17px] leading-[1.8] text-textSecondary">
            A full-stack lead sourcing platform built for legal recruiters — attorney profiles scraped from state bar databases across the US and Canada, normalized, and searchable in one place.
          </p>
        </motion.div>

        {/* Stats bento row */}
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} {...fadeUp(0.1 + i * 0.07)}>
              <div
                className="bento-card relative flex flex-col justify-between p-6"
                style={{
                  borderColor: colorMix(stat.color, 22),
                  background: `radial-gradient(ellipse 120% 80% at 50% 100%, ${colorMix(stat.color, 10)}, var(--surface))`,
                  minHeight: '120px',
                }}
              >
                <div className="bento-shimmer" />
                <span
                  className="about-stat-number stat-pulse"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </span>
                <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-textMuted">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Two-col: problem + pipeline */}
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.6fr]">

          {/* The problem */}
          <motion.div {...fadeUp(0.15)}>
            <div
              className="bento-card h-full p-7"
              style={{ borderColor: colorMix(themeColors.amber, 20) }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: themeColors.amber }}>
                The Problem
              </p>
              <h2 className="mt-4 font-display text-[22px] font-medium leading-snug text-textPrimary">
                Manual sourcing was the default. Nobody questioned it.
              </h2>
              <p className="mt-4 font-body text-[14px] leading-[1.85] text-textSecondary">
                Legal recruiters had no system. To find attorney leads they were going to state bar websites one by one, searching manually, and copy-pasting individual profiles into spreadsheets — name, contact, practice area, status — by hand. No bulk export. No filter. Just copy, paste, repeat.
              </p>
              <p className="mt-3 font-body text-[14px] leading-[1.85] text-textSecondary">
                Getting 100 leads could take days. Across every US state and Canadian province, each site built completely differently, the process was endless. I started automating it — and I&apos;m still going.
              </p>
              <div
                className="mt-6 rounded-[12px] border p-4"
                style={{
                  borderColor: colorMix(themeColors.amber, 20),
                  background: colorMix(themeColors.amber, 6),
                }}
              >
                <p className="font-mono text-[11px] italic text-textSecondary">
                  &quot;What used to take hours of manual work now takes under 60 seconds.&quot;
                </p>
              </div>
            </div>
          </motion.div>

          {/* Pipeline */}
          <motion.div {...fadeUp(0.2)}>
            <div
              className="bento-card h-full p-7"
              onFocus={() => setIsPipelinePaused(true)}
              onBlur={() => setIsPipelinePaused(false)}
              onMouseEnter={() => setIsPipelinePaused(true)}
              onMouseLeave={() => setIsPipelinePaused(false)}
              style={{ borderColor: colorMix(themeColors.green, 18) }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: themeColors.green }}>
                How it&apos;s built
              </p>
              <h2 className="mt-4 font-display text-[20px] font-medium text-textPrimary">
                {currentPipelinePart.title}
              </h2>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div
                  className="inline-flex rounded-full border p-1"
                  style={{
                    background: colorMix(themeColors.green, 5),
                    borderColor: colorMix(themeColors.green, 18),
                  }}
                >
                  {pipelineParts.map((part, index) => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => setActivePipelinePart(index as 0 | 1)}
                      className="rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] transition-colors duration-200"
                      style={{
                        background: activePipelinePart === index ? colorMix(themeColors.green, 16) : 'transparent',
                        color: activePipelinePart === index ? themeColors.green : 'var(--text-muted)',
                      }}
                    >
                      {part.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActivePipelinePart((current) => (current === 0 ? 1 : 0))}
                  className="font-mono text-[9px] uppercase tracking-[0.12em] text-textMuted transition-colors duration-200 hover:text-textPrimary"
                >
                  Flip to {nextPipelinePart.label}
                </button>
              </div>

              <div className="mt-6 [perspective:1200px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPipelinePart.id}
                    initial={{ opacity: 0, rotateY: activePipelinePart === 0 ? -12 : 12, x: activePipelinePart === 0 ? -10 : 10 }}
                    animate={{ opacity: 1, rotateY: 0, x: 0 }}
                    exit={{ opacity: 0, rotateY: activePipelinePart === 0 ? 12 : -12, x: activePipelinePart === 0 ? 10 : -10 }}
                    transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-2 [transform-style:preserve-3d]"
                  >
                    {currentPipelinePart.steps.map((step, index) => {
                      const stepNumber = activePipelinePart === 0 ? index + 1 : index + 4;

                      return (
                        <div
                          key={step.label}
                          className="flex items-start gap-3 rounded-[10px] border p-3 transition-colors duration-200 hover:border-opacity-60"
                          style={{
                            borderColor: colorMix(step.color, 20),
                            background: colorMix(step.color, 5),
                          }}
                        >
                          <div className="flex flex-col items-center pt-1 gap-1">
                            <div
                              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-mono font-semibold"
                              style={{ background: colorMix(step.color, 20), color: step.color, border: `1px solid ${colorMix(step.color, 35)}` }}
                            >
                              {String(stepNumber).padStart(2, '0')}
                            </div>
                            {index < currentPipelinePart.steps.length - 1 && (
                              <div aria-hidden="true" className="w-px flex-1 min-h-[16px]" style={{ background: colorMix(step.color, 20) }} />
                            )}
                          </div>
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: step.color }}>{step.layer}</p>
                            <p className="mt-0.5 font-display text-[13px] font-medium text-textPrimary">{step.label}</p>
                            <p className="mt-0.5 font-body text-[11px] leading-[1.5] text-textMuted">{step.sublabel}</p>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-textMuted">
                  {currentPipelinePart.label} of 2
                </p>
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: isPipelinePaused ? themeColors.amber : themeColors.green,
                    boxShadow: `0 0 8px ${isPipelinePaused ? themeColors.amber : themeColors.green}`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom row: tech stack + coverage */}
        <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_1fr]">

          {/* Tech stack */}
          <motion.div {...fadeUp(0.22)}>
            <div
              className="bento-card p-7"
              style={{ borderColor: colorMix(themeColors.blue, 18) }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: themeColors.blue }}>
                Tech Stack
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {stack.map((tech) => (
                  <span key={tech} className="tech-badge">{tech}</span>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-[10px] border p-4" style={{ borderColor: colorMix(themeColors.green, 20), background: colorMix(themeColors.green, 6) }}>
                  <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-textMuted">Database</p>
                  <p className="mt-1.5 font-display text-sm font-semibold" style={{ color: themeColors.green }}>Supabase</p>
                  <p className="mt-0.5 font-body text-[11px] text-textMuted">Row-level security · indexed</p>
                </div>
                <div className="rounded-[10px] border p-4" style={{ borderColor: colorMix(themeColors.amber, 20), background: colorMix(themeColors.amber, 6) }}>
                  <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-textMuted">Extraction</p>
                  <p className="mt-1.5 font-display text-sm font-semibold" style={{ color: themeColors.amber }}>Python</p>
                  <p className="mt-0.5 font-body text-[11px] text-textMuted">Custom per source · monitored</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Coverage */}
          <motion.div {...fadeUp(0.26)}>
            <div
              className="bento-card relative overflow-hidden p-7"
              style={{
                borderColor: colorMix(themeColors.green, 30),
                background: `radial-gradient(ellipse 100% 120% at 50% 100%, ${colorMix(themeColors.green, 12)}, var(--surface))`,
              }}
            >
              <div className="scan-line" style={{ background: `linear-gradient(90deg, transparent, ${colorMix(themeColors.green, 60)}, transparent)` }} />
              <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: themeColors.green }}>
                Coverage
              </p>
              <div className="mt-5 space-y-4">
                {jurisdictionList.map((item) => (
                  <div key={item.code} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 shrink-0 rounded-full h-1.5 w-1.5"
                      style={{ background: themeColors.green, boxShadow: `0 0 6px ${themeColors.green}`, marginTop: '7px' }}
                    />
                    <div>
                      <span className="font-display text-[15px] font-semibold" style={{ color: themeColors.green }}>{item.code}</span>
                      <span className="ml-2 font-body text-[13px] text-textSecondary">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="mt-8 rounded-[12px] border p-4"
                style={{
                  borderColor: colorMix(themeColors.green, 28),
                  background: colorMix(themeColors.green, 8),
                }}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-textMuted mb-1">Product Outcome</p>
                <p className="font-body text-[13px] leading-[1.7] text-textSecondary">
                  A recruiter can go from zero to a campaign-ready CSV in under 60 seconds. Live in production. Currently covers {jurisdictionList.map((item) => item.code).join(', ')} - more jurisdictions being added.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Architecture link */}
        <motion.div className="mt-8 flex flex-wrap gap-3" {...fadeUp(0.3)}>
          <a
            href="https://barhunter.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] transition-all duration-200"
            style={{
              borderColor: colorMix(themeColors.green, 28),
              color: themeColors.green,
              background: colorMix(themeColors.green, 8),
            }}
          >
            View live BarHunter
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2.5 9.5l7-7M9.5 2.5H4m5.5 0v5.5" />
            </svg>
          </a>
          <Link
            href="/?orbit=projects"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-textMuted transition-colors hover:text-textPrimary"
            style={{ borderColor: 'var(--surface-border)' }}
          >
            See other projects
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
