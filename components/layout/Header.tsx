'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { navigationItems, sectionColors } from '@/lib/constants/navigation';
import type { AccentColor } from '@/lib/constants/colors';
import { colorMix, themeColors } from '@/lib/constants/colors';
import { cn } from '@/lib/utils';

const activeBorderClasses: Record<AccentColor, string> = {
  blue: 'border-blue',
  green: 'border-green',
  cyan: 'border-cyan',
  amber: 'border-amber',
  purple: 'border-purple',
};

const accentColorMap: Record<AccentColor, string> = {
  blue: themeColors.blue,
  green: themeColors.green,
  cyan: themeColors.cyan,
  amber: themeColors.amber,
  purple: themeColors.purple,
};

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      viewBox="0 0 20 20"
    >
      {open ? (
        <>
          <path d="M4 4l12 12" />
          <path d="M16 4L4 16" />
        </>
      ) : (
        <>
          <path d="M3 6h14" />
          <path d="M3 10h14" />
          <path d="M3 14h14" />
        </>
      )}
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, searchParams]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed left-1/2 top-4 z-50 h-[58px] w-[calc(100%-2rem)] max-w-[1500px] -translate-x-1/2 rounded-full border backdrop-blur-2xl md:top-5 md:h-[62px] md:w-[calc(100%-6rem)]"
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--surface) 34%, transparent), color-mix(in srgb, var(--canvas) 58%, transparent))',
          borderColor: 'color-mix(in srgb, var(--blue) 18%, var(--surface-border))',
          boxShadow:
            '0 0 0 1px color-mix(in srgb, var(--blue) 6%, transparent), 0 18px 56px rgba(0, 0, 0, 0.16), inset 0 1px 0 color-mix(in srgb, var(--text-primary) 6%, transparent)',
        }}
      >
        <div className="header-glow-border" />

        <div className="relative mx-auto flex h-full items-center justify-between px-5 md:px-9">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-1px] left-1/2 hidden h-px w-28 -translate-x-1/2 md:block"
            style={{
              background:
                'linear-gradient(90deg, transparent, color-mix(in srgb, var(--blue) 88%, transparent), transparent)',
              boxShadow: '0 0 12px var(--blue)',
            }}
          />

          {/* Logo */}
          <Link
            className="flex items-center gap-3 font-display text-[19px] font-medium text-textPrimary transition-colors duration-200 ease-in-out md:text-[20px]"
            href="/"
          >
            <span className="grid h-6 w-6 grid-cols-2 gap-1">
              {[0, 1, 2, 3].map((dot) => (
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  key={dot}
                  style={{
                    background: 'var(--blue)',
                    boxShadow: '0 0 10px var(--blue)',
                  }}
                />
              ))}
            </span>
            <span>Tousif Ali</span>
          </Link>

          {/* Desktop nav */}
          <div className="flex items-center gap-3 md:gap-5">
            <nav aria-label="Primary navigation" className="hidden items-center gap-8 sm:flex lg:gap-9">
              {navigationItems.map((item) => {
                const isProjectsActive =
                  item.section === 'projects' &&
                  (pathname.startsWith('/projects') ||
                    (pathname === '/' && searchParams.get('orbit') === 'projects'));
                const isActive =
                  isProjectsActive ||
                  (item.section !== 'projects' &&
                    (pathname === item.href || pathname.startsWith(`${item.href}/`)));
                const accent = sectionColors[item.section];

                return (
                  <Link
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'border-b-2 border-transparent pb-1 font-body text-[13px] font-normal text-textSecondary transition-all duration-200 ease-in-out hover:text-textPrimary lg:text-[14px]',
                      isActive && 'text-textPrimary',
                      isActive && activeBorderClasses[accent],
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <ThemeToggle />

            <a
              aria-label="Download resume"
              className="header-resume-button hidden sm:inline-flex"
              download
              href="/resume.pdf"
              onClick={() => trackEvent('resume_download', { location: 'header_desktop' })}
            >
              Resume
            </a>

            {/* Hamburger — mobile only */}
            <button
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="grid h-9 w-9 place-items-center rounded-full border text-textSecondary transition-colors duration-200 hover:text-textPrimary sm:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                borderColor: menuOpen
                  ? 'color-mix(in srgb, var(--blue) 40%, var(--surface-border))'
                  : 'var(--surface-border)',
                background: menuOpen
                  ? 'color-mix(in srgb, var(--blue) 10%, transparent)'
                  : 'transparent',
              }}
              type="button"
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              animate={{ opacity: 1 }}
              aria-hidden="true"
              className="fixed inset-0 z-40 sm:hidden"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              transition={{ duration: 0.2 }}
            />

            {/* Drawer */}
            <motion.nav
              animate={{ opacity: 1, y: 0 }}
              aria-label="Mobile navigation"
              className="fixed left-4 right-4 top-20 z-50 overflow-hidden rounded-[20px] border sm:hidden"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: -8 }}
              style={{
                background: 'color-mix(in srgb, var(--surface) 92%, transparent)',
                backdropFilter: 'blur(24px)',
                borderColor: 'color-mix(in srgb, var(--blue) 20%, var(--surface-border))',
                boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px color-mix(in srgb, var(--blue) 8%, transparent)',
              }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <ul className="flex flex-col">
                {navigationItems.map((item, i) => {
                  const isProjectsActive =
                    item.section === 'projects' &&
                    (pathname.startsWith('/projects') ||
                      (pathname === '/' && searchParams.get('orbit') === 'projects'));
                  const isActive =
                    isProjectsActive ||
                    (item.section !== 'projects' &&
                      (pathname === item.href || pathname.startsWith(`${item.href}/`)));
                  const accent = sectionColors[item.section];
                  const accentColor = accentColorMap[accent];

                  return (
                    <motion.li
                      animate={{ opacity: 1, x: 0 }}
                      initial={{ opacity: 0, x: -8 }}
                      key={item.href}
                      transition={{ delay: i * 0.04, duration: 0.2, ease: 'easeOut' }}
                    >
                      <Link
                        aria-current={isActive ? 'page' : undefined}
                        className="flex items-center justify-between px-5 py-4"
                        href={item.href}
                        style={{ borderBottom: '1px solid var(--surface-border)' }}
                      >
                        <span
                          className="font-body text-[15px] font-medium"
                          style={{ color: isActive ? accentColor : 'var(--text-primary)' }}
                        >
                          {item.label}
                        </span>
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full"
                          style={{
                            background: isActive
                              ? colorMix(accentColor, 16)
                              : 'var(--surface-raised)',
                          }}
                        >
                          <svg
                            aria-hidden="true"
                            fill="none"
                            height="12"
                            stroke={isActive ? accentColor : 'var(--text-muted)'}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            viewBox="0 0 12 12"
                            width="12"
                          >
                            <path d="M2.5 6h7M6.5 3l3 3-3 3" />
                          </svg>
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}

                {/* Resume row */}
                <motion.li
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -8 }}
                  transition={{ delay: navigationItems.length * 0.04, duration: 0.2, ease: 'easeOut' }}
                >
                  <a
                    className="flex items-center justify-between px-5 py-4"
                    download
                    href="/resume.pdf"
                    onClick={() => trackEvent('resume_download', { location: 'header_mobile' })}
                  >
                    <span className="font-body text-[15px] font-medium" style={{ color: themeColors.blue }}>
                      Resume
                    </span>
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full"
                      style={{ background: colorMix(themeColors.blue, 14) }}
                    >
                      <svg
                        aria-hidden="true"
                        fill="none"
                        height="12"
                        stroke={themeColors.blue}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        viewBox="0 0 12 12"
                        width="12"
                      >
                        <path d="M6 2v6M3 6l3 3 3-3" />
                        <path d="M2 10h8" />
                      </svg>
                    </span>
                  </a>
                </motion.li>
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
