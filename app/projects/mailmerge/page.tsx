import Image from 'next/image';
import Link from 'next/link';
import { RevealDiv } from '@/components/ui/Reveal';
import { colorMix, themeColors } from '@/lib/constants/colors';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { delay, duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
});

export default function MailMergePage() {
  return (
    <main className="dot-grid relative min-h-screen pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in srgb, var(--cyan) 14%, transparent), transparent)',
        }}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-28">
        <RevealDiv {...fadeUp(0)}>
          <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-textMuted transition-colors hover:text-textPrimary">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 14 14" aria-hidden="true"><path d="M9 2.5 4.5 7 9 11.5" /></svg>
            All projects
          </Link>
        </RevealDiv>

        <RevealDiv className="mt-10" {...fadeUp(0.05)}>
          <span className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ background: colorMix(themeColors.cyan, 14), color: themeColors.cyan, border: `1px solid ${colorMix(themeColors.cyan, 28)}` }}>
            Outreach Preparation
          </span>
          <h1 className="mt-5 font-display text-[52px] font-semibold leading-[1.05] tracking-tight text-textPrimary md:text-[72px]">
            Mail Merge Tool
          </h1>
          <p className="mt-4 max-w-[600px] font-body text-[17px] leading-[1.8] text-textSecondary">
            Messy spreadsheets were reaching outreach campaigns and causing duplicate sends
            and broken columns. This cleans the data before it gets there — dedupe, split,
            export — with every step visible, so a non-technical teammate can see what
            changed and trust the file before it goes out.
          </p>
        </RevealDiv>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { value: 'Live', label: 'Still in use', color: themeColors.green },
            { value: '3', label: 'Steps — dedupe, split, export', color: themeColors.cyan },
            { value: '0', label: 'Technical setup for the user', color: themeColors.blue },
          ].map((stat, i) => (
            <RevealDiv key={stat.label} {...fadeUp(0.12 + i * 0.07)}>
              <div className="bento-card relative p-6" style={{ borderColor: colorMix(stat.color, 22), background: `radial-gradient(ellipse 120% 80% at 50% 100%, ${colorMix(stat.color, 10)}, var(--surface))`, minHeight: '110px' }}>
                <div className="bento-shimmer" aria-hidden="true" />
                <span className="about-stat-number stat-pulse" style={{ color: stat.color }}>{stat.value}</span>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-textMuted">{stat.label}</p>
              </div>
            </RevealDiv>
          ))}
        </div>

        <RevealDiv className="mt-4" {...fadeUp(0.18)}>
          <div className="bento-card overflow-hidden" style={{ borderColor: colorMix(themeColors.cyan, 18) }}>
            <div className="px-4 pt-4 pb-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: themeColors.cyan }}>Live · Mail Merge Pro · Guided workflow</p>
            </div>
            <Image
                alt="Mail Merge Pro upload step"
                className="block h-auto w-full"
                height={889}
                sizes="(min-width: 1024px) 900px, 100vw"
                src="/screenshots/mailmerge.png"
                width={1920}
              />
          </div>
        </RevealDiv>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <RevealDiv {...fadeUp(0.18)}>
            <div className="bento-card p-7 h-full" style={{ borderColor: colorMix(themeColors.cyan, 20) }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: themeColors.cyan }}>How it works</p>
              <div className="mt-5 space-y-4">
                {['Upload contacts CSV from BarHunter export', 'Define message template with variable slots', 'Preview personalised output per recipient', 'Execute bulk send with audit trail'].map((step, i) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-bold mt-0.5" style={{ background: colorMix(themeColors.cyan, 20), color: themeColors.cyan, border: `1px solid ${colorMix(themeColors.cyan, 35)}` }}>{i + 1}</div>
                    <p className="font-body text-[14px] text-textSecondary leading-snug">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealDiv>
          <RevealDiv {...fadeUp(0.22)}>
            <div className="bento-card p-7 h-full" style={{ borderColor: colorMix(themeColors.blue, 18) }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: themeColors.blue }}>Stack</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['React', 'Vite', 'Flask', 'Python', 'Pandas', 'SQLite', 'Tailwind CSS'].map((t) => (
                  <span key={t} className="tech-badge">{t}</span>
                ))}
              </div>
              <div className="mt-6 rounded-[12px] border p-4" style={{ borderColor: colorMix(themeColors.blue, 20), background: colorMix(themeColors.blue, 6) }}>
                <blockquote>
                  <p className="font-body text-[13px] leading-[1.7] text-textSecondary italic">
                    &quot;Built as the final stage of the BarHunter pipeline — source, filter, contact. One system, end to end.&quot;
                  </p>
                  <footer className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-textMuted not-italic">
                    <cite>BarHunter · Mail Merge Tool</cite>
                  </footer>
                </blockquote>
              </div>
            </div>
          </RevealDiv>
        </div>

        <RevealDiv className="mt-8 flex flex-wrap gap-3" {...fadeUp(0.36)}>
          <a
            href="https://mail-merge-cleaner.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] transition-all duration-200"
            style={{ borderColor: colorMix(themeColors.cyan, 28), color: themeColors.cyan, background: colorMix(themeColors.cyan, 8) }}
          >
            View live Mail Merge
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2.5 9.5l7-7M9.5 2.5H4m5.5 0v5.5" />
            </svg>
          </a>
          <Link href="/projects" className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-textMuted transition-colors hover:text-textPrimary" style={{ borderColor: 'var(--surface-border)' }}>
            See other projects
          </Link>
        </RevealDiv>
      </div>
    </main>
  );
}
