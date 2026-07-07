'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationItems } from '@/lib/constants/navigation';
import { trackEvent } from '@/lib/analytics';

const socialLinks = [
  { href: 'mailto:tousifarsen@gmail.com', label: 'Email' },
  { href: 'https://www.linkedin.com/in/tousif-ali--/', label: 'LinkedIn' },
  { href: 'https://github.com/arsen0007', label: 'GitHub' },
  { href: '/resume.pdf', label: 'Resume' },
] as const;

export function Footer() {
  const pathname = usePathname();

  // The homepage is a fixed-viewport orbit experience with its own proof strip.
  if (pathname === '/') {
    return null;
  }

  return (
    <footer
      className="relative border-t"
      style={{
        borderColor: 'var(--surface-border)',
        background: 'color-mix(in srgb, var(--surface) 40%, transparent)',
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="grid h-5 w-5 grid-cols-2 gap-[3px]">
            {[0, 1, 2, 3].map((dot) => (
              <span
                className="h-[5px] w-[5px] rounded-full"
                key={dot}
                style={{ background: 'var(--blue)', boxShadow: '0 0 8px var(--blue)' }}
              />
            ))}
          </span>
          <div>
            <p className="font-display text-[14px] font-medium text-textPrimary">Tousif Ali</p>
            <p className="font-body text-[12px] text-textMuted">
              AI Product &amp; Systems Builder · Bengaluru, India
            </p>
          </div>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {navigationItems.map((item) => (
            <Link
              className="font-body text-[13px] text-textSecondary transition-colors duration-200 hover:text-textPrimary"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {socialLinks.map((link) => (
            <a
              className="font-mono text-[11px] uppercase tracking-[0.1em] text-textMuted transition-colors duration-200 hover:text-textPrimary"
              href={link.href}
              key={link.label}
              onClick={link.label === 'Resume' ? () => trackEvent('resume_download', { location: 'footer' }) : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              target={link.href.startsWith('http') ? '_blank' : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
