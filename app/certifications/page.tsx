'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { colorMix, themeColors } from '@/lib/constants/colors';
import type { AccentColor } from '@/lib/constants/colors';

type Cert = {
  id: string;
  title: string;
  subtitle?: string;
  level: 'Intermediate' | 'Advanced' | 'Expert';
  status: 'completed' | 'in-progress';
  color: AccentColor;
  file: string | null;
  issuer: string;
  issued?: string;
  link?: string;
  expectedCompletion?: string;
};

const certs: Cert[] = [
  {
    id: 'product-manager',
    title: 'Product Manager',
    subtitle: 'Certification™',
    level: 'Intermediate',
    status: 'completed',
    color: 'green',
    file: '/certificates/Product Manager Certification.png',
    issuer: 'Product School',
    issued: 'January 20, 2026',
    link: 'https://certificate.productschool.com/1c89deea-0560-4b63-812e-f4b0a2193f87',
  },
  {
    id: 'ai-evals',
    title: 'AI Evals',
    level: 'Advanced',
    status: 'completed',
    color: 'cyan',
    file: '/certificates/AI Evals Certification.png',
    issuer: 'Product School',
    issued: 'February 23, 2026',
    link: 'https://certificate.productschool.com/4830b3f7-45ed-429a-8ada-64513c7f74d3',
  },
  {
    id: 'ai-product-management',
    title: 'AI Product Management',
    level: 'Intermediate',
    status: 'completed',
    color: 'blue',
    file: '/certificates/AI Product Management Certification.png',
    issuer: 'Product School',
    issued: 'February 14, 2026',
    link: 'https://certificate.productschool.com/167b88a5-07be-44b7-baf2-57d7f2618290',
  },
  {
    id: 'advanced-ai-agents',
    title: 'Advanced AI Agents',
    level: 'Advanced',
    status: 'completed',
    color: 'purple',
    file: '/certificates/Advance AI Agents Certification.png',
    issuer: 'Product School',
    issued: 'June 1, 2026',
    link: 'https://certificate.productschool.com/1774d978-11d5-443e-a138-3e5e1721f2cf',
  },
  {
    id: 'go-to-market',
    title: 'Go-to-Market',
    level: 'Advanced',
    status: 'in-progress',
    color: 'amber',
    file: null,
    issuer: 'Product School',
    expectedCompletion: 'Jul 7 – Jul 24',
  },
  {
    id: 'vibe-coding',
    title: 'Vibe Coding',
    level: 'Advanced',
    status: 'completed',
    color: 'blue',
    file: '/certificates/Vibe Coding Certification.png',
    issuer: 'Product School',
    issued: 'July 2, 2026',
    link: 'https://certificate.productschool.com/092dbf31-a50b-4ee9-97b2-03a400bc27c1',
  },
  {
    id: 'product-experimentation',
    title: 'Product Experimentation',
    level: 'Advanced',
    status: 'in-progress',
    color: 'cyan',
    file: null,
    issuer: 'Product School',
    expectedCompletion: 'Aug 8 – Aug 23',
  },
  {
    id: 'ai-product-strategy',
    title: 'AI Product Strategy',
    level: 'Expert',
    status: 'in-progress',
    color: 'green',
    file: null,
    issuer: 'Product School',
    expectedCompletion: 'Aug 26 – Sep 11',
  },
  {
    id: 'product-leadership',
    title: 'Product Leadership',
    level: 'Expert',
    status: 'in-progress',
    color: 'purple',
    file: null,
    issuer: 'Product School',
    expectedCompletion: 'Sep 14 – Oct 1',
  },
  {
    id: 'claude-code',
    title: 'Claude Code',
    level: 'Advanced',
    status: 'completed',
    color: 'green',
    file: '/certificates/Claude Code Certification.png',
    issuer: 'Product School',
    issued: 'June 12, 2026',
    link: 'https://certificate.productschool.com/5b5ccac9-1b8f-4bcc-a1cf-fdd729442ccc',
  },
];

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

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
            Earned in the field.
          </h1>
          <p className="mx-auto mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-textSecondary">
            {completedCount} completed&nbsp;&middot;&nbsp;{inProgressCount} in progress&nbsp;&middot;&nbsp;Product School&nbsp;&middot;&nbsp;CEO Sponsored
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
            className="relative grid lg:grid-cols-[2fr_3fr]"
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
                <div>
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
                      className="grid h-9 w-9 place-items-center rounded-full border text-textSecondary transition-colors duration-200 hover:border-textMuted hover:text-textPrimary"
                      onClick={() => navigate(-1)}
                      style={{ borderColor: 'var(--surface-border)' }}
                    >
                      <svg aria-hidden="true" fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 14 14" width="14">
                        <path d="M9 2L4 7l5 5" />
                      </svg>
                    </button>
                    <button
                      aria-label="Next certificate"
                      className="grid h-9 w-9 place-items-center rounded-full border text-textSecondary transition-colors duration-200 hover:border-textMuted hover:text-textPrimary"
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
                aria-label={`Go to ${c.title}`}
                className="h-2 rounded-full transition-all duration-300"
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
                className="rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-all duration-200"
                key={c.id}
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
