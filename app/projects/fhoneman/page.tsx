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

export default function FhonemanPage() {
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
        <RevealDiv {...fadeUp(0)}>
          <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-textMuted transition-colors hover:text-textPrimary">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 14 14" aria-hidden="true"><path d="M9 2.5 4.5 7 9 11.5" /></svg>
            All projects
          </Link>
        </RevealDiv>

        <RevealDiv className="mt-10" {...fadeUp(0.05)}>
          <span className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ background: colorMix(themeColors.purple, 18), color: themeColors.purple, border: `1px solid ${colorMix(themeColors.purple, 28)}` }}>
            Client Website
          </span>
          <h1 className="mt-5 font-display text-[52px] font-semibold leading-[1.05] tracking-tight text-textPrimary md:text-[72px]">
            Fhoneman
          </h1>
          <p className="mt-4 max-w-[600px] font-body text-[17px] leading-[1.8] text-textSecondary">
            A local phone repair business with no online presence, turned into a working
            booking site with separate paths for urgent and standard repairs. Built on a
            site builder on purpose, so the owner could keep running it without me.
          </p>
        </RevealDiv>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { value: 'Live', label: 'fhoneman.in', color: themeColors.green },
            { value: '2', label: 'Inquiry paths — urgent and standard', color: themeColors.purple },
            { value: '0', label: 'Ongoing maintenance from me', color: themeColors.blue },
          ].map((stat, i) => (
            <RevealDiv key={stat.label} {...fadeUp(0.12 + i * 0.07)}>
              <div className="bento-card relative p-6" style={{ borderColor: colorMix(stat.color, 22), background: `radial-gradient(ellipse 120% 80% at 50% 100%, ${colorMix(stat.color, 18)}, var(--surface))`, minHeight: '110px' }}>
                <div className="bento-shimmer" aria-hidden="true" />
                <span className="about-stat-number stat-pulse" style={{ color: stat.color }}>{stat.value}</span>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-textMuted">{stat.label}</p>
              </div>
            </RevealDiv>
          ))}
        </div>

        <RevealDiv className="mt-4" {...fadeUp(0.18)}>
          <div className="bento-card overflow-hidden" style={{ borderColor: colorMix(themeColors.purple, 18) }}>
            <div className="px-4 pt-4 pb-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: themeColors.purple }}>Live · Doorstep Service, 20 minutes or less</p>
            </div>
            <Image
                alt="Fhoneman hero — doorstep phone repair service"
                className="block h-auto w-full"
                height={889}
                sizes="(min-width: 1024px) 900px, 100vw"
                src="/screenshots/fhoneman.png"
                width={1920}
              />
          </div>
        </RevealDiv>

        <RevealDiv className="mt-4" {...fadeUp(0.22)}>
          <div className="bento-card p-7" style={{ borderColor: colorMix(themeColors.purple, 20) }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: themeColors.purple }}>Stack</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Hostinger Site Builder', 'Custom HTML/CSS', 'Custom Form Logic'].map((t) => (
                <span key={t} className="tech-badge">{t}</span>
              ))}
            </div>
          </div>
        </RevealDiv>

        <RevealDiv className="mt-8 flex flex-wrap gap-3" {...fadeUp(0.28)}>
          <a
            href="https://fhoneman.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] transition-all duration-200"
            style={{ borderColor: colorMix(themeColors.purple, 28), color: themeColors.purple, background: colorMix(themeColors.purple, 8) }}
          >
            View live Fhoneman
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
