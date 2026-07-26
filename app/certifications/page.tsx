'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { colorMix, themeColors } from '@/lib/constants/colors';
import type { AccentColor } from '@/lib/constants/colors';
import { certs } from '@/lib/data/certifications';


const accentByColor: Record<AccentColor, string> = {
  blue: themeColors.blue,
  green: themeColors.green,
  cyan: themeColors.cyan,
  amber: themeColors.amber,
  purple: themeColors.purple,
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 52 : -52, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 52 : -52, opacity: 0 }),
};

const completedCount = certs.filter((c) => c.status === 'completed').length;
const inProgressCount = certs.filter((c) => c.status === 'in-progress').length;

export default function CertificationsPage() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const touchStartX = useRef<number>(0);

  const navigate = useCallback((delta: number) => {
    setDir(delta);
    setIndex((prev) => (prev + delta + certs.length) % certs.length);
  }, []);

  // Scoped to the carousel rather than the window: a global arrow-key listener
  // hijacks the keys a keyboard user needs for scrolling the rest of the page.
  const onCarouselKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigate(1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigate(-1);
      }
    },
    [navigate],
  );

  const cert = certs[index];
  const accent = accentByColor[cert.color];

  return (
    <main className="dot-grid relative min-h-screen overflow-hidden pb-24">
      {/* Atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            `radial-gradient(ellipse 65% 34% at 50% 6%, ${colorMix(themeColors.amber, 14)}, transparent)`,
            `radial-gradient(ellipse 42% 38% at 8% 42%, ${colorMix(themeColors.blue, 10)}, transparent)`,
            `radial-gradient(ellipse 42% 38% at 92% 78%, ${colorMix(themeColors.purple, 10)}, transparent)`,
          ].join(', '),
        }}
      />

      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { label: 'Certifications' },
        ]}
      />

      <section className="relative mx-auto max-w-6xl px-6 pt-12">
        {/* Hero */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-[10px] font-normal uppercase tracking-[0.16em] text-textMuted">
            CREDENTIALS
          </p>
          <h1 className="mt-4 text-balance font-display text-[34px] font-medium leading-tight text-textPrimary md:text-[44px]">
            Certified, then applied.
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] font-body text-[15px] leading-[1.75] text-textSecondary">
            My CEO sponsored these after CaseWise shipped. Where one fed back into
            something running in production, it says so — and where it has not yet, it
            does not.
          </p>
          <p className="mx-auto mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-textMuted">
            CEO sponsored&nbsp;&middot;&nbsp;Product School&nbsp;&middot;&nbsp;{completedCount} completed&nbsp;&middot;&nbsp;{inProgressCount} in progress
          </p>
        </motion.div>

        {/* Slider card */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-10 overflow-hidden rounded-[32px] border bg-surface"
          initial={{ opacity: 0, y: 18 }}
          style={{
            borderColor: colorMix(accent, 28),
            boxShadow: `0 0 0 1px ${colorMix(accent, 14)}, 0 28px 90px rgba(0,0,0,0.35)`,
            transition: 'border-color 0.38s ease, box-shadow 0.38s ease',
          }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top scan line */}
          <div
            aria-hidden="true"
            className="absolute inset-x-8 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${colorMix(accent, 70)}, transparent)`,
              transition: 'background 0.38s ease',
            }}
          />

          <div
            aria-label={`Certificates, ${index + 1} of ${certs.length}`}
            aria-roledescription="carousel"
            className="relative grid outline-none lg:grid-cols-[2fr_3fr]"
            onKeyDown={onCarouselKeyDown}
            role="region"
            tabIndex={0}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(dx) > 40) navigate(dx < 0 ? 1 : -1);
            }}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          >
            {/* Left: metadata panel */}
            <AnimatePresence custom={dir} mode="wait">
              <motion.div
                animate="center"
                className="flex flex-col justify-between p-7 md:p-10"
                custom={dir}
                exit="exit"
                initial="enter"
                key={`meta-${cert.id}`}
                transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                variants={slideVariants}
              >
                <div aria-atomic="true" aria-live="polite">
                  {/* Index badge + issuer */}
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border font-mono text-[10px] tabular-nums"
                      style={{
                        background: colorMix(accent, 14),
                        borderColor: colorMix(accent, 48),
                        color: accent,
                        boxShadow: `0 0 18px ${colorMix(accent, 26)}`,
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p
                      className="font-mono text-[10px] uppercase tracking-[0.12em]"
                      style={{ color: accent }}
                    >
                      {cert.issuer}
                    </p>
                  </div>

                  {/* Title */}
                  <h2 className="mt-6 font-display text-[28px] font-medium leading-tight text-textPrimary md:text-[34px]">
                    {cert.title}
                    {cert.subtitle && (
                      <span className="block text-[22px] text-textSecondary md:text-[26px]">
                        {cert.subtitle}
                      </span>
                    )}
                  </h2>

                  {/* Status + level badges */}
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em]"
                      style={{
                        background: cert.status === 'completed'
                          ? colorMix(themeColors.green, 12)
                          : colorMix(themeColors.amber, 12),
                        borderColor: cert.status === 'completed'
                          ? colorMix(themeColors.green, 32)
                          : colorMix(themeColors.amber, 32),
                        color: cert.status === 'completed' ? themeColors.green : themeColors.amber,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          background: cert.status === 'completed' ? themeColors.green : themeColors.amber,
                          boxShadow: cert.status === 'completed'
                            ? `0 0 6px ${themeColors.green}`
                            : `0 0 6px ${themeColors.amber}`,
                        }}
                      />
                      {cert.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                    <span
                      className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em]"
                      style={{
                        background: colorMix(accent, 10),
                        borderColor: colorMix(accent, 28),
                        color: accent,
                      }}
                    >
                      {cert.level}
                    </span>
                  </div>

                  {cert.issued && (
                    <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-textMuted">
                      Issued&nbsp;&middot;&nbsp;{cert.issued}
                    </p>
                  )}

                  {cert.appliedTo && (
                    <div
                      className="mt-5 rounded-[12px] border-l-2 py-1 pl-4"
                      style={{ borderColor: colorMix(accent, 55) }}
                    >
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-textMuted">
                        Where it was used
                      </p>
                      {cert.appliedTo.href ? (
                        <Link
                          className="mt-2 inline-flex items-baseline gap-1.5 font-body text-[13.5px] leading-[1.6] text-textSecondary transition-colors duration-200 hover:text-textPrimary"
                          href={cert.appliedTo.href}
                        >
                          {cert.appliedTo.label}
                          <span aria-hidden="true" style={{ color: accent }}>
                            &rarr;
                          </span>
                        </Link>
                      ) : (
                        <p className="mt-2 font-body text-[13.5px] leading-[1.6] text-textSecondary">
                          {cert.appliedTo.label}
                        </p>
                      )}
                    </div>
                  )}

                  {cert.link && (
                    <a
                      className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-opacity hover:opacity-70"
                      href={cert.link}
                      rel="noopener noreferrer"
                      style={{ color: accent }}
                      target="_blank"
                    >
                      View Certificate
                      <svg aria-hidden="true" fill="none" height="10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 10 10" width="10">
                        <path d="M2 8l6-6M8 2H3.5M8 2v4.5" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* Navigation controls */}
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      aria-label="Previous certificate"
                      className="grid h-11 w-11 place-items-center rounded-full border text-textSecondary transition-colors duration-200 hover:border-textMuted hover:text-textPrimary"
                      onClick={() => navigate(-1)}
                      style={{ borderColor: 'var(--surface-border)' }}
                    >
                      <svg aria-hidden="true" fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 14 14" width="14">
                        <path d="M9 2L4 7l5 5" />
                      </svg>
                    </button>
                    <button
                      aria-label="Next certificate"
                      className="grid h-11 w-11 place-items-center rounded-full border text-textSecondary transition-colors duration-200 hover:border-textMuted hover:text-textPrimary"
                      onClick={() => navigate(1)}
                      style={{ borderColor: 'var(--surface-border)' }}
                    >
                      <svg aria-hidden="true" fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 14 14" width="14">
                        <path d="M5 2l5 5-5 5" />
                      </svg>
                    </button>
                  </div>
                  <p className="font-mono text-[11px] tabular-nums text-textMuted">
                    {String(index + 1).padStart(2, '0')} / {String(certs.length).padStart(2, '0')}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Vertical divider */}
            <div
              aria-hidden="true"
              className="absolute bottom-8 left-[40%] top-8 hidden w-px lg:block"
              style={{
                background: `linear-gradient(180deg, transparent, ${colorMix(accent, 40)}, transparent)`,
                transition: 'background 0.38s ease',
              }}
            />

            {/* Right: certificate image or in-progress placeholder */}
            <AnimatePresence custom={dir} mode="wait">
              <motion.div
                animate="center"
                className="relative flex min-h-[300px] items-center justify-center overflow-hidden p-6 lg:min-h-[460px] lg:p-8"
                custom={dir}
                exit="exit"
                initial="enter"
                key={`img-${cert.id}`}
                style={{
                  background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${colorMix(accent, 10)}, transparent)`,
                  transition: 'background 0.38s ease',
                }}
                transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                variants={slideVariants}
              >
                {cert.file ? (
                  <div
                    className="relative w-full overflow-hidden rounded-[14px] border shadow-2xl"
                    style={{ borderColor: colorMix(accent, 22) }}
                  >
                    <div className="relative aspect-[1.414/1] w-full">
                      <Image
                        alt={`${cert.title} certificate`}
                        className="object-contain"
                        fill
                        sizes="(min-width: 1024px) 55vw, 90vw"
                        src={cert.file}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex w-full flex-col items-center justify-center gap-5 rounded-[18px] border p-10 text-center"
                    style={{
                      borderColor: colorMix(accent, 20),
                      background: colorMix(accent, 8),
                      minHeight: 240,
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <span
                        className="absolute inline-flex h-4 w-4 animate-ping rounded-full opacity-40"
                        style={{ background: themeColors.amber }}
                      />
                      <span
                        className="relative inline-flex h-3 w-3 rounded-full"
                        style={{ background: themeColors.amber, boxShadow: `0 0 12px ${themeColors.amber}` }}
                      />
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em]"
                      style={{
                        background: colorMix(themeColors.amber, 12),
                        borderColor: colorMix(themeColors.amber, 32),
                        color: themeColors.amber,
                      }}
                    >
                      In Progress
                    </span>
                    <div>
                      <p className="font-display text-[22px] font-medium text-textPrimary">
                        {cert.title}
                      </p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-textMuted">
                        Certificate available on completion
                      </p>
                      {cert.expectedCompletion && (
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: themeColors.amber }}>
                          Est.&nbsp;{cert.expectedCompletion}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Dot indicators */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {certs.map((c, i) => {
            const a = accentByColor[c.color];
            const isActive = i === index;
            return (
              <button
                aria-current={isActive ? 'true' : undefined}
                aria-label={`Go to ${c.title}`}
                className="h-2 rounded-full transition-all duration-300"
                type="button"
                key={c.id}
                onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                style={{
                  width: isActive ? 24 : 8,
                  background: isActive ? a : colorMix(a, 30),
                  boxShadow: isActive ? `0 0 8px ${colorMix(a, 60)}` : 'none',
                }}
              />
            );
          })}
        </div>

        {/* Cert name strip */}
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.28, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          {certs.map((c, i) => {
            const a = accentByColor[c.color];
            const isActive = i === index;
            return (
              <button
                aria-current={isActive ? 'true' : undefined}
                className="rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-all duration-200"
                key={c.id}
                type="button"
                onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                style={{
                  borderColor: isActive ? colorMix(a, 50) : 'var(--surface-border)',
                  background: isActive ? colorMix(a, 14) : 'transparent',
                  color: isActive ? a : 'var(--text-muted)',
                  opacity: c.status === 'in-progress' && !isActive ? 0.6 : 1,
                }}
              >
                {c.title}
              </button>
            );
          })}
        </motion.div>
      </section>
    </main>
  );
}
