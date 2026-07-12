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

const coreSkills = [
  { name: 'AI Agents', proof: 'CaseWise', color: themeColors.blue },
  { name: 'Prompt Engineering', proof: 'CaseWise', color: themeColors.purple },
  { name: 'Gemini API', proof: 'CaseWise', color: themeColors.cyan },
  { name: 'Python', proof: 'BarHunter · Mail Merge', color: themeColors.green },
  { name: 'Next.js', proof: 'CaseWise · BarHunter · Portfolio', color: themeColors.blue },
  { name: 'Web Scraping', proof: 'BarHunter', color: themeColors.amber },
  { name: 'Product Management', proof: '6 Certs · CaseWise', color: themeColors.amber },
  { name: 'Claude Code', proof: 'Certified', color: themeColors.purple },
];

const supportingSkills = [
  'TypeScript', 'PostgreSQL', 'Supabase', 'Flask',
  'Pandas', 'Playwright', 'Tailwind CSS', 'REST APIs',
  'Vercel', 'Linux', 'AI Workflows',
];

const exploringSkills = [
  'Voice AI', 'LangChain', 'Multi-Agent Architecture', 'RAG', 'n8n',
];

export default function SkillsPage() {
  return (
    <main className="dot-grid relative min-h-screen pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in srgb, var(--purple) 14%, transparent), transparent)',
        }}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-28">

        {/* Hero */}
        <motion.div {...fadeUp(0)}>
          <span
            className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{
              background: colorMix(themeColors.purple, 14),
              color: themeColors.purple,
              border: `1px solid ${colorMix(themeColors.purple, 28)}`,
            }}
          >
            Skill Tree
          </span>
          <h1 className="mt-5 font-display text-[48px] font-semibold leading-[1.05] tracking-tight text-textPrimary md:text-[68px]">
            I ship systems.<br />Even when I don&apos;t<br className="hidden md:block" /> know how yet.
          </h1>
          <p className="mt-5 max-w-[560px] font-body text-[16px] leading-[1.85] text-textSecondary">
            Not a resume dump. This is what I&apos;ve actually built with — curated into what I&apos;m strong at,
            what I reach for, and what I&apos;m actively picking up.
          </p>
        </motion.div>

        {/* Tier 1 — What I build with */}
        <motion.div className="mt-16" {...fadeUp(0.08)}>
          <div className="mb-6 flex items-center gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: themeColors.purple }}>
              What I build with
            </p>
            <div className="h-px flex-1" style={{ background: colorMix(themeColors.purple, 18) }} />
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-textMuted">
              Proof-backed
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {coreSkills.map((skill, i) => (
              <motion.div key={skill.name} {...fadeUp(0.1 + i * 0.04)}>
                <div
                  className="bento-card relative p-5 h-full"
                  style={{
                    borderColor: colorMix(skill.color, 24),
                    background: `radial-gradient(ellipse 120% 80% at 50% 110%, ${colorMix(skill.color, 12)}, var(--surface))`,
                  }}
                >
                  <div className="bento-shimmer" aria-hidden="true" />
                  <p className="font-display text-[15px] font-semibold text-textPrimary leading-snug">
                    {skill.name}
                  </p>
                  <p
                    className="mt-2.5 font-mono text-[9px] uppercase tracking-[0.12em]"
                    style={{ color: skill.color }}
                  >
                    {skill.proof}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tier 2 — What I reach for */}
        <motion.div className="mt-14" {...fadeUp(0.16)}>
          <div className="mb-5 flex items-center gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-textSecondary">
              What I reach for
            </p>
            <div className="h-px flex-1" style={{ background: 'var(--surface-border)' }} />
          </div>
          <div className="flex flex-wrap gap-2">
            {supportingSkills.map((skill) => (
              <span key={skill} className="tech-badge">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Tier 3 — Building toward */}
        <motion.div className="mt-10" {...fadeUp(0.22)}>
          <div className="mb-5 flex items-center gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-textMuted">
              Building toward
            </p>
            <div className="h-px flex-1" style={{ background: colorMix(themeColors.cyan, 12) }} />
          </div>
          <div className="flex flex-wrap gap-2">
            {exploringSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em]"
                style={{
                  border: `1px dashed ${colorMix(themeColors.cyan, 30)}`,
                  color: colorMix(themeColors.cyan, 55),
                  background: colorMix(themeColors.cyan, 5),
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Footnote */}
        <motion.p
          className="mt-10 font-body text-[13px] italic leading-relaxed text-textMuted"
          {...fadeUp(0.26)}
        >
          Also touched: Raspberry Pi, Stable Diffusion, AUTOMATIC1111, Render, Railway
        </motion.p>

        {/* CTA */}
        <motion.div className="mt-12 flex flex-wrap gap-3" {...fadeUp(0.3)}>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] transition-all duration-200"
            style={{
              borderColor: colorMix(themeColors.purple, 28),
              color: themeColors.purple,
              background: colorMix(themeColors.purple, 8),
            }}
          >
            See what I&apos;ve built
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2.5 9.5l7-7M9.5 2.5H4m5.5 0v5.5" />
            </svg>
          </Link>
          <Link
            href="/certifications"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-textMuted transition-colors hover:text-textPrimary"
            style={{ borderColor: 'var(--surface-border)' }}
          >
            View certifications
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
