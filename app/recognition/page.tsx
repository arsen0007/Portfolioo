'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { colorMix, themeColors } from '@/lib/constants/colors';
import { recognition } from '@/lib/data/recognition';
import type { CredentialRecognition, LeadershipRecognition } from '@/lib/data/recognition';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
});

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-5 font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-textMuted">
      {children}
    </p>
  );
}

function ExternalArrow() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="11"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      viewBox="0 0 12 12"
      width="11"
    >
      <path d="M2.5 9.5l7-7M9.5 2.5H4m5.5 0v5.5" />
    </svg>
  );
}

/* ─── Section 1: Public Record ─── */
function PublicRecord() {
  const { topTier } = recognition;
  const accent = themeColors.amber;

  return (
    <motion.div {...fadeUp(0.05)}>
      <div
        className="panel-shadow theme-node-border relative overflow-hidden rounded-panel border bg-surface"
        style={{
          borderColor: colorMix(accent, 32),
          background: `radial-gradient(ellipse 70% 120% at 0% 50%, ${colorMix(accent, 14)}, transparent 65%), var(--surface)`,
        }}
      >
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-[3px]"
          style={{ background: accent }}
        />
        <div className="p-6 pl-8 md:p-8 md:pl-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: accent }}>
            PUBLIC RECORD · {topTier.source} · {topTier.date}
          </p>
          <h2 className="mt-3 font-display text-2xl font-medium leading-tight text-textPrimary">
            {topTier.title}
          </h2>
          <blockquote
            className="mt-5 border-l-2 pl-5"
            style={{ borderColor: colorMix(accent, 38) }}
          >
            <p className="font-body text-[14px] italic leading-[1.8] text-textSecondary">
              &ldquo;{topTier.quote}&rdquo;
            </p>
            <footer className="mt-3 font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: colorMix(accent, 60) }}>
              <cite>{topTier.source} · {topTier.date}</cite>
            </footer>
          </blockquote>
          <a
            className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-opacity hover:opacity-60"
            href={topTier.link}
            rel="noopener noreferrer"
            style={{ color: accent }}
            target="_blank"
          >
            Read on Workplace Options
            <ExternalArrow />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Fernando: full-width kudo image card ─── */
function KudoCard({ item }: { item: LeadershipRecognition }) {
  const accent = themeColors.green;

  return (
    <motion.div {...fadeUp(0.15)}>
      <div
        className="panel-shadow theme-node-border overflow-hidden rounded-node border bg-surface"
        style={{ borderColor: colorMix(accent, 22) }}
      >
        <div className="p-5 pb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: accent }}>
            {item.role}
          </p>
          <p className="mt-1 font-display text-base font-medium text-textPrimary">{item.name}</p>
          <p className="mt-0.5 font-body text-[11px] text-textMuted">{item.highlight}</p>
        </div>

        {/* Image — natural aspect ratio, framed as document */}
        <div className="px-5 pb-6">
          <div
            className="kudo-image-wrapper overflow-hidden rounded-[8px]"
            style={{ border: `1px solid ${colorMix(accent, 18)}` }}
          >
            <Image
              alt="Excellence recognition from Fernando Figueiredo"
              height={480}
              src={item.kudoImage!}
              style={{ height: 'auto', width: '100%', display: 'block' }}
              width={960}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── CEO / CISO quote cards ─── */
function QuoteCard({ item, delay }: { item: LeadershipRecognition; delay: number }) {
  const accent = themeColors.amber;

  return (
    <motion.div className="h-full" {...fadeUp(delay)}>
      <div
        className="panel-shadow theme-node-border flex h-full flex-col rounded-node border bg-surface p-5"
        style={{ borderColor: colorMix(accent, 18) }}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: accent }}>
            {item.role}
          </p>
          <p className="mt-1 font-display text-base font-medium text-textPrimary">{item.name}</p>
          <p className="mt-0.5 font-body text-[11px] text-textMuted">{item.highlight}</p>
        </div>
        <blockquote
          className="mt-4 flex-1 border-l pl-4"
          style={{ borderColor: colorMix(accent, 28) }}
        >
          <p className="font-body text-[13px] italic leading-[1.8] text-textSecondary">
            &ldquo;{item.quote}&rdquo;
          </p>
          <footer className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-textMuted not-italic">
            <cite>{item.name}, {item.role}</cite>
          </footer>
        </blockquote>
      </div>
    </motion.div>
  );
}

/* ─── CTO: full-width action/pipeline card ─── */
function ActionCard({ item }: { item: LeadershipRecognition }) {
  const accent = themeColors.blue;

  return (
    <motion.div {...fadeUp(0.1)}>
      <div
        className="panel-shadow theme-node-border rounded-node border bg-surface p-6"
        style={{
          borderColor: colorMix(accent, 22),
          background: `radial-gradient(ellipse 55% 120% at 100% 50%, ${colorMix(accent, 13)}, transparent 65%), var(--surface)`,
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: accent }}>
              {item.role}
            </p>
            <p className="mt-1 font-display text-base font-medium text-textPrimary">{item.name}</p>
          </div>
          <span
            className="rounded-[4px] border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-textMuted"
            style={{ borderColor: 'var(--surface-border)' }}
          >
            Proof through action
          </span>
        </div>

        {/* Pipeline flow */}
        <div className="mt-6 flex flex-col items-stretch gap-3 md:flex-row md:items-center">
          <div
            className="flex-1 rounded-[8px] border p-4"
            style={{
              borderColor: colorMix(accent, 22),
              background: colorMix(accent, 13),
            }}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-textMuted">Origin</p>
            <p className="mt-1.5 font-display text-sm font-medium" style={{ color: accent }}>
              CaseWise
            </p>
            <p className="mt-0.5 font-body text-[11px] text-textMuted">Internal prototype</p>
          </div>

          <div className="flex items-center justify-center gap-2 md:flex-col md:gap-1">
            <div aria-hidden="true" className="h-px w-8 md:h-8 md:w-px" style={{ background: colorMix(accent, 30) }} />
            <p className="font-mono text-[9px] text-textMuted">CTO directive</p>
            <div aria-hidden="true" className="h-px w-8 md:h-8 md:w-px" style={{ background: colorMix(accent, 30) }} />
          </div>

          <div
            className="flex-1 rounded-[8px] border p-4"
            style={{
              borderColor: colorMix(accent, 40),
              background: colorMix(accent, 13),
            }}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-textMuted">Outcome</p>
            <p className="mt-1.5 font-display text-sm font-medium" style={{ color: accent }}>
              Core System
            </p>
            <p className="mt-0.5 font-body text-[11px] text-textMuted">Company-wide integration</p>
          </div>
        </div>

        <p className="mt-5 font-body text-[12px] leading-[1.7] text-textMuted">
          No quote needed. The CTO directing production integration is the endorsement.
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Credentials ─── */
function HackathonCard({ item }: { item: CredentialRecognition }) {
  const accent = themeColors[item.color];

  return (
    <motion.div {...fadeUp(0.05)}>
      <div
        className="panel-shadow theme-node-border relative overflow-hidden rounded-node border bg-surface p-5"
        style={{
          borderColor: colorMix(accent, 28),
          background: `radial-gradient(ellipse 100% 100% at 0% 100%, ${colorMix(accent, 15)}, transparent 65%), var(--surface)`,
        }}
      >
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-[2px]"
          style={{ background: accent }}
        />
        <div className="pl-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: accent }}>
            Global Hackathon Winner
          </p>
          <p className="mt-2 font-display text-lg font-medium leading-snug text-textPrimary">
            {item.subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ProductSchoolCard({ item }: { item: CredentialRecognition }) {
  const accent = themeColors[item.color];
  const completed = item.courses?.filter((c) => c.completed) ?? [];
  const upcoming = item.courses?.filter((c) => !c.completed) ?? [];

  const levelColor: Record<string, string> = {
    Intermediate: themeColors.cyan,
    Advanced: themeColors.blue,
    Expert: themeColors.purple,
  };

  return (
    <motion.div {...fadeUp(0.1)}>
      <div
        className="panel-shadow theme-node-border rounded-node border bg-surface p-5"
        style={{ borderColor: colorMix(accent, 22) }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: accent }}>
              {item.title}
            </p>
            <p className="mt-1 font-body text-[12px] text-textMuted">{item.subtitle}</p>
          </div>
          <span
            className="shrink-0 rounded-[4px] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]"
            style={{ background: colorMix(accent, 15), color: accent }}
          >
            {completed.length} done
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {completed.length > 0 && (
            <div>
              <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.1em] text-textMuted">
                Completed
              </p>
              <div className="flex flex-wrap gap-1.5">
                {completed.map((course) => (
                  <span
                    className="rounded-[4px] px-2 py-1 font-mono text-[10px]"
                    key={course.name}
                    style={{
                      background: colorMix(levelColor[course.level], 14),
                      border: `1px solid ${colorMix(levelColor[course.level], 28)}`,
                      color: levelColor[course.level],
                    }}
                  >
                    {course.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {upcoming.length > 0 && (
            <div>
              <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.1em] text-textMuted">
                In progress · next 2–3 months
              </p>
              <div className="flex flex-wrap gap-1.5">
                {upcoming.map((course) => (
                  <span
                    className="rounded-[4px] px-2 py-1 font-mono text-[10px] text-textMuted"
                    key={course.name}
                    style={{ border: '1px solid var(--surface-border)', opacity: 0.65 }}
                  >
                    {course.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}


/* ─── Page ─── */
export default function RecognitionPage() {
  const { leadershipTier, credentialsTier } = recognition;

  const ceo = leadershipTier.find((l) => l.id === 'ceo')!;
  const ciso = leadershipTier.find((l) => l.id === 'ciso')!;
  const cto = leadershipTier.find((l) => l.id === 'cto')!;
  const fernando = leadershipTier.find((l) => l.id === 'fernando')!;
  const hackathon = credentialsTier.find((c) => c.id === 'hackathon')!;
  const productSchool = credentialsTier.find((c) => c.id === 'productschool')!;

  return (
    <main className="dot-grid relative min-h-screen pb-24">
      {/* Atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 70% 40% at 50% 6%, color-mix(in srgb, var(--amber) 14%, transparent), transparent)',
            'radial-gradient(ellipse 45% 35% at 5% 50%, color-mix(in srgb, var(--blue) 12%, transparent), transparent)',
            'radial-gradient(ellipse 45% 35% at 95% 75%, color-mix(in srgb, var(--purple) 12%, transparent), transparent)',
          ].join(', '),
        }}
      />
      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { label: 'Recognition' },
        ]}
      />

      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl px-6 pt-12"
        initial={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.38, ease: 'easeOut' }}
      >
        <p className="font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-textMuted text-center">
          RECOGNITION
        </p>

        {/* Hero quote — the one that hits hardest */}
        <div className="mt-10 relative">
          <div
            className="absolute -inset-4 rounded-[28px] pointer-events-none"
            aria-hidden="true"
            style={{
              background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${colorMix(themeColors.amber, 14)}, transparent)`,
            }}
          />
          <div className="relative text-center">
            <div
              className="inline-block mb-6 rounded-full border px-4 py-2"
              style={{ borderColor: colorMix(themeColors.amber, 30), background: colorMix(themeColors.amber, 10) }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: themeColors.amber }}>
                Direct Manager · Fernando Figueiredo
              </p>
            </div>
            <blockquote>
              <p className="quote-hero-text text-textPrimary">
                &ldquo;Tousif&apos;s brain needs to be uploaded into the cloud and shared with everyone.&rdquo;
              </p>
              <footer className="mt-4 font-mono text-[9px] uppercase tracking-[0.1em] text-textMuted">
                <cite>Fernando Figueiredo, Direct Manager</cite>
              </footer>
            </blockquote>
            <p className="mt-6 font-body text-base leading-[1.7] text-textSecondary max-w-[500px] mx-auto">
              Validated by leadership, peers, and public record.
              This is what happens when you go 200% on every problem.
            </p>
          </div>
        </div>
      </motion.section>

      <div className="mx-auto mt-14 max-w-4xl space-y-14 px-6">

        {/* 1 — Public Record */}
        <div>
          <SectionLabel>The Public Record</SectionLabel>
          <PublicRecord />
        </div>

        {/* 2 — What They Said */}
        <div>
          <SectionLabel>What They Said</SectionLabel>
          <div className="space-y-4">
            {/* CEO + CISO — 2 columns */}
            <div className="grid gap-4 md:grid-cols-2">
              <QuoteCard delay={0.05} item={ceo} />
              <QuoteCard delay={0.1} item={ciso} />
            </div>
            {/* CTO — full width */}
            <ActionCard item={cto} />
            {/* Fernando — full width image proof */}
            <KudoCard item={fernando} />
          </div>
        </div>

        {/* 3 — Credentials */}
        <div>
          <SectionLabel>Credentials</SectionLabel>
          <div className="grid gap-4 md:grid-cols-2">
            <HackathonCard item={hackathon} />
            <ProductSchoolCard item={productSchool} />
          </div>
        </div>


      </div>
    </main>
  );
}
