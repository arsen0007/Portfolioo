'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { navigationItems } from '@/lib/constants/navigation';
import { cn } from '@/lib/utils';

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      className={cn(
        'inline-flex min-h-11 items-center font-display text-xl font-medium tracking-tight text-textPrimary',
        className,
      )}
      href="/"
    >
      Tousif Ali
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  function openMenu() {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  // Close the menu when the route changes.
  useEffect(() => {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
  }, [pathname]);

  // The mobile menu lists every page except Contact, which is the primary
  // action pinned to the bottom within thumb reach.
  const menuItems = navigationItems.filter((item) => item.href !== '/contact');

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-surfaceBorder bg-canvas pt-[env(safe-area-inset-top)]">
        <Container className="flex h-14 items-center justify-between gap-4">
          <Wordmark />

          <div className="flex items-center gap-1">
            <nav aria-label="Primary" className="hidden md:block">
              <ul className="flex items-center">
                {navigationItems.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'inline-flex min-h-11 items-center px-3 text-small transition-colors duration-200',
                          active
                            ? 'font-medium text-textPrimary underline decoration-accent decoration-2 underline-offset-[10px]'
                            : 'text-textSecondary hover:text-textPrimary',
                        )}
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <ThemeToggle />

            <button
              aria-controls="site-menu"
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              className="inline-flex min-h-11 items-center rounded-control px-3 text-small font-medium text-textPrimary md:hidden"
              onClick={openMenu}
              ref={triggerRef}
              type="button"
            >
              Menu
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile menu: a native modal dialog, so focus is trapped, Esc closes it
          and focus returns to the Menu button, with no extra code. */}
      <dialog
        aria-label="Site menu"
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-canvas p-0 text-textPrimary backdrop:bg-transparent md:hidden"
        id="site-menu"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
        onClose={() => {
          setMenuOpen(false);
          // Safari does not focus a button on click, so the browser has nothing
          // to return focus to. Do it explicitly.
          triggerRef.current?.focus();
        }}
        ref={dialogRef}
      >
        <div className="flex h-full flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
          <div className="flex h-14 items-center justify-between">
            <Wordmark />
            <button
              autoFocus
              className="inline-flex min-h-11 items-center rounded-control px-3 text-small font-medium text-textPrimary"
              onClick={closeMenu}
              type="button"
            >
              Close
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-4">
            <ul className="border-t border-surfaceBorder">
              {menuItems.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <li className="border-b border-surfaceBorder" key={item.href}>
                    <Link
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex min-h-14 items-center justify-between font-display text-h3',
                        active ? 'text-accent' : 'text-textPrimary',
                      )}
                      href={item.href}
                    >
                      {item.label}
                      <span aria-hidden="true" className="text-textMuted">
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto pt-6">
            <ButtonLink className="w-full" href="/contact" size="lg">
              Contact
            </ButtonLink>
          </div>
        </div>
      </dialog>
    </>
  );
}
