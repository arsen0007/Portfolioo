'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ButtonLink } from '@/components/ui/Button';
import { LocalTime } from '@/components/layout/LocalTime';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { navigationItems } from '@/lib/constants/navigation';
import { cn } from '@/lib/utils';

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Wordmark({ className }: { className?: string }) {
  return (
    <TransitionLink
      aria-label="Tousif Ali, home"
      className={cn('group inline-flex min-h-11 items-center gap-2.5 text-textPrimary', className)}
      href="/"
    >
      <span aria-hidden="true" className="live-dot" />
      <span className="text-[1.0625rem] font-semibold tracking-[-0.03em]">Tousif Ali</span>
      <span aria-hidden="true" className="label hidden text-textMuted transition-colors group-hover:text-accent sm:inline">
        ©26
      </span>
    </TransitionLink>
  );
}

/**
 * Fixed header that tucks away while scrolling down and returns on scroll up.
 * Transparent at the top of the page, frosted once content passes beneath.
 */
export function Header() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
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

  function openMenu() {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  useEffect(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
    setHidden(false);
  }, [pathname]);

  const menuItems = navigationItems.filter((item) => item.href !== '/contact');

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[transform,background-color,border-color] duration-500 ease-out',
          scrolled
            ? 'border-b border-surfaceBorder bg-[color-mix(in_srgb,var(--canvas)_72%,transparent)] backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0',
        )}
        onFocusCapture={() => setHidden(false)}
      >
        <div className="mx-auto grid h-16 w-full max-w-page grid-cols-[1fr_auto] items-center gap-4 px-[var(--gutter)] md:grid-cols-[1fr_auto_1fr]">
          <Wordmark />

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navigationItems.map((item, index) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <TransitionLink
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group inline-flex min-h-11 items-center gap-1.5 px-3 text-small transition-colors duration-300',
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
                      <span className={cn('link-draw', active && '[background-size:100%_1px]')}>
                        {item.label}
                      </span>
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2">
            <LocalTime className="label mr-2 hidden text-textMuted lg:inline-flex" />
            <ThemeToggle />
            <ButtonLink className="hidden md:inline-flex" href="/contact" size="md">
              Let&apos;s talk
            </ButtonLink>
            <button
              aria-controls="site-menu"
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              className="label inline-flex min-h-11 items-center gap-2 rounded-full border border-surfaceBorderStrong px-4 text-textPrimary md:hidden"
              onClick={openMenu}
              ref={triggerRef}
              type="button"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      <dialog
        aria-label="Site menu"
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-canvas p-0 text-textPrimary backdrop:bg-transparent md:hidden"
        id="site-menu"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
        onClose={() => {
          setMenuOpen(false);
          triggerRef.current?.focus();
        }}
        ref={dialogRef}
      >
        <div className="blueprint flex h-full flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
          <div className="flex h-16 items-center justify-between">
            <Wordmark />
            <button
              autoFocus
              className="label inline-flex min-h-11 items-center rounded-full border border-surfaceBorderStrong px-4 text-textPrimary"
              onClick={closeMenu}
              type="button"
            >
              Close
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-10">
            <ul>
              {menuItems.map((item, index) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li className="border-b border-surfaceBorder" key={item.href}>
                    <TransitionLink
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex min-h-20 items-baseline gap-4 text-h1 font-medium tracking-[-0.045em]',
                        active ? 'text-accent' : 'text-textPrimary',
                      )}
                      href={item.href}
                    >
                      <span aria-hidden="true" className="label text-textMuted">
                        0{index + 1}
                      </span>
                      {item.label}
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto space-y-4 pt-6">
            <LocalTime className="label flex text-textMuted" />
            <ButtonLink className="w-full" href="/contact" size="lg">
              Let&apos;s talk
            </ButtonLink>
          </div>
        </div>
      </dialog>
    </>
  );
}
