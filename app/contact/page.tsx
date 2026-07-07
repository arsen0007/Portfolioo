'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { trackEvent } from '@/lib/analytics';
import { colorMix, themeColors } from '@/lib/constants/colors';

type ContactCard = {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
  download?: boolean;
};

const iconProps = {
  className: 'h-5 w-5',
  fill: 'none',
  stroke: themeColors.blue,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  strokeWidth: '1.5',
  viewBox: '0 0 20 20',
};

const contactCards: ContactCard[] = [
  {
    href: 'mailto:tousifarsen@gmail.com',
    icon: (
      <svg aria-hidden="true" {...iconProps}>
        <path d="M3.5 5.5h13v9h-13z" />
        <path d="M4.5 6.5l5.5 4 5.5-4" />
      </svg>
    ),
    label: 'Email',
    value: 'tousifarsen@gmail.com',
  },
  {
    href: 'https://www.linkedin.com/in/tousif-ali--/',
    icon: (
      <svg aria-hidden="true" {...iconProps}>
        <path d="M5 8v7" />
        <path d="M5 5.2v.1" />
        <path d="M9 15v-4.2c0-1.5.9-2.5 2.3-2.5s2.2 1 2.2 2.7v4" />
        <path d="M9 8.5V15" />
      </svg>
    ),
    label: 'LinkedIn',
    value: 'Tousif Ali',
  },
  {
    href: 'https://github.com/arsen0007',
    icon: (
      <svg aria-hidden="true" {...iconProps}>
        <path d="M7.5 15.5c-3 .9-3-1.4-4.2-1.7" />
        <path d="M11.5 17v-2.3c0-.7.2-1.1.5-1.4-2-.2-4.2-1-4.2-4.5 0-1 .4-1.8 1-2.5-.1-.2-.4-1.2.1-2.4 0 0 .8-.3 2.6 1a8.7 8.7 0 0 1 4.8 0c1.8-1.3 2.6-1 2.6-1 .5 1.2.2 2.2.1 2.4.6.7 1 1.5 1 2.5 0 3.5-2.1 4.3-4.2 4.5.4.3.6.9.6 1.7V17" />
      </svg>
    ),
    label: 'GitHub',
    value: 'github.com/arsen0007',
  },
  {
    download: true,
    href: '/resume.pdf',
    icon: (
      <svg aria-hidden="true" {...iconProps}>
        <path d="M6 3.5h5.5L15 7v9.5H6z" />
        <path d="M11.5 3.5V7H15" />
        <path d="M8 11h4" />
        <path d="M8 13.5h3" />
      </svg>
    ),
    label: 'Resume',
    value: 'Download PDF',
  },
];

export default function ContactPage() {
  return (
    <main className="dot-grid min-h-screen pb-20">
      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { label: 'Contact' },
        ]}
      />

      <section className="flex min-h-[calc(100vh-180px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-[560px] text-center">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <p className="font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-textMuted">
              CONTACT
            </p>
            <h1 className="mt-4 font-display text-[32px] font-medium leading-tight text-textPrimary">
              Let&apos;s build something.
            </h1>
            <p className="mx-auto mt-4 max-w-[420px] font-body text-base font-normal leading-[1.7] text-textSecondary">
              Have a problem worth solving? I&apos;d like to hear about it.
            </p>
          </motion.div>

          <div className="mx-auto mt-10 grid max-w-[480px] gap-4 sm:grid-cols-2">
            {contactCards.map((card, index) => (
              <motion.a
                className="contact-glow-card panel-shadow group relative overflow-hidden rounded-[16px] border bg-surface px-6 py-5 text-left cursor-pointer"
                download={card.download}
                href={card.href}
                initial={{ opacity: 0, y: 20 }}
                key={card.label}
                onClick={
                  card.label === 'LinkedIn'
                    ? () => trackEvent('linkedin_click', { location: 'contact_page' })
                    : card.label === 'Resume'
                    ? () => trackEvent('resume_download', { location: 'contact_page' })
                    : undefined
                }
                rel={card.href.startsWith('http') ? 'noreferrer' : undefined}
                style={{ borderColor: colorMix(themeColors.blue, 22) }}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                transition={{ delay: 0.2 + index * 0.08, duration: 0.4, ease: 'easeOut' }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {/* Shimmer */}
                <div aria-hidden="true" className="bento-shimmer" />
                <span className="mb-5 block">{card.icon}</span>
                <span className="block font-display text-[14px] font-medium text-textPrimary">
                  {card.label}
                </span>
                <span className="mt-1 block font-mono text-xs font-normal text-textSecondary">
                  {card.value}
                </span>
              </motion.a>
            ))}
          </div>

          <motion.div
            animate={{ opacity: 1 }}
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
          >
            <div
              className="inline-flex items-center gap-2.5 rounded-full border px-4 py-2"
              style={{
                borderColor: colorMix(themeColors.green, 28),
                background: colorMix(themeColors.green, 13),
              }}
            >
              <span
                className="available-pulse h-2 w-2 rounded-full shrink-0"
                style={{ background: themeColors.green, boxShadow: `0 0 8px ${themeColors.green}` }}
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: themeColors.green }}>
                Available for new opportunities
              </span>
            </div>
          </motion.div>

          <motion.p
            animate={{ opacity: 1 }}
            className="mt-5 font-body text-xs text-textMuted"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.58, duration: 0.4, ease: 'easeOut' }}
          >
            Based in Bengaluru, India &middot; Responding within 24 hours
          </motion.p>
        </div>
      </section>
    </main>
  );
}