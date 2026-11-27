'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ButtonLink } from '@/components/ui/Button';
import { LocalTime } from '@/components/layout/LocalTime';
import { MobileMenu, type MobileMenuHandle } from '@/components/layout/MobileMenu';
import { Wordmark } from '@/components/layout/Wordmark';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { navigationItems } from '@/lib/constants/navigation';
import { cn } from '@/lib/utils';

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Fixed header that tucks away while scrolling down and returns on scroll up.
 * Transparent at the top of the page, frosted once content passes beneath.
 */
export function Header() {
  const pathname = usePathname();
  const menuRef = useRef<MobileMenuHandle>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 320 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    menuRef.current?.close();
    setHidden(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[transform,background-color,border-color] duration-500 ease-out',
          scrolled
            ? 'border-b border-surfaceBorder bg-[color-mix(in_srgb,var(--canvas)_84%,transparent)] backdrop-blur-md'
            : 'border-b border-transparent bg-transparent',
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0',
        )}
        onFocusCapture={() => setHidden(false)}
      >
        <div className="mx-auto grid h-16 w-full max-w-page grid-cols-[1fr_auto] items-center gap-4 px-[var(--gutter)] lg:grid-cols-[1fr_auto_1fr]">
          <Wordmark descriptor={!scrolled} />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center">
              {navigationItems.map((item, index) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <TransitionLink
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group inline-flex min-h-11 items-center gap-1.5 px-2.5 text-small transition-colors duration-300 xl:px-3',
                        active ? 'text-textPrimary' : 'text-textSecondary hover:text-textPrimary',
                      )}
                      href={item.href}
                    >
                      <span
                        aria-hidden="true"
                        className={cn('label text-[0.65rem]', active ? 'text-accent' : 'text-textMuted')}
                      >
                        0{index + 1}
                      </span>
                      <span className={cn('link-draw', active && '[background-size:100%_1px]')}>{item.label}</span>
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2">
            <LocalTime className="label mr-2 hidden text-textMuted xl:inline-flex" />
            <span className="hidden sm:inline-flex">
              <ThemeToggle />
            </span>
            <ButtonLink className="hidden lg:inline-flex" href="/contact" size="md">
              Let&apos;s talk
            </ButtonLink>
            <button
              aria-controls="site-menu"
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              className="label inline-flex min-h-11 items-center gap-2.5 rounded-full border border-surfaceBorderStrong px-4 text-textPrimary lg:hidden"
              onClick={() => menuRef.current?.open()}
              ref={triggerRef}
              type="button"
            >
              <span aria-hidden="true" className="flex w-3.5 flex-col gap-[5px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-2/3 bg-current" />
              </span>
              Menu
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        onOpenChange={setMenuOpen}
        pathname={pathname}
        ref={menuRef}
        returnFocusTo={() => triggerRef.current}
      />
    </>
  );
}
