'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { LocalTime } from '@/components/layout/LocalTime';
import { Wordmark } from '@/components/layout/Wordmark';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { navigationItems } from '@/lib/constants/navigation';
import { gsap, motionAllowed } from '@/lib/motion/gsap';
import { cn } from '@/lib/utils';

const socials = [
  { href: 'mailto:tousifarsen@gmail.com', label: 'Email' },
  { href: 'https://www.linkedin.com/in/tousif-ali--/', label: 'LinkedIn' },
  { href: 'https://github.com/arsen0007', label: 'GitHub' },
] as const;

/** One line of context under each destination, so the menu reads as an index, not a list of words. */
const blurbs: Record<string, string> = {
  '/about': 'Operator turned builder',
  '/projects': 'Case studies, in production',
  '/recognition': 'What people did next',
  '/certifications': 'The learning record',
};

export type MobileMenuHandle = { open: () => void; close: () => void };

type MobileMenuProps = {
  pathname: string;
  onOpenChange: (open: boolean) => void;
  /** Focus returns here when the menu closes. */
  returnFocusTo: () => HTMLElement | null;
};

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Full-screen mobile menu. A native modal <dialog> (focus trap, Esc, inert
 * page behind), revealed as a curtain with the destinations rising line by
 * line. Every destination carries an index and a one-line blurb; the primary
 * action and the live status sit in thumb reach at the bottom.
 */
export const MobileMenu = forwardRef<MobileMenuHandle, MobileMenuProps>(function MobileMenu(
  { onOpenChange, pathname, returnFocusTo },
  ref,
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const closing = useRef(false);

  const items = navigationItems.filter((item) => item.href !== '/contact');

  function open() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    window.__lenis?.stop();
    onOpenChange(true);
    if (!motionAllowed()) return;

    tl.current?.kill();
    const q = gsap.utils.selector(dialog);
    tl.current = gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .fromTo(dialog, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.inOut' })
      .fromTo(q('[data-menu-line]'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06 }, 0.35)
      .fromTo(q('[data-menu-rule]'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0.06 }, 0.35)
      .fromTo(q('[data-menu-side]'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.7, stagger: 0.06 }, 0.45)
      .fromTo(q('[data-menu-fade]'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0.6);
  }

  function finishClose() {
    const dialog = dialogRef.current;
    closing.current = false;
    if (dialog?.open) dialog.close();
  }

  function close() {
    const dialog = dialogRef.current;
    if (!dialog?.open || closing.current) return;
    if (!motionAllowed()) {
      finishClose();
      return;
    }
    closing.current = true;
    tl.current?.kill();
    tl.current = gsap.timeline({ onComplete: finishClose }).to(dialog, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.55,
      ease: 'expo.inOut',
    });
  }

  useImperativeHandle(ref, () => ({ open, close }));

  return (
    <dialog
      aria-label="Site menu"
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-canvas p-0 text-textPrimary backdrop:bg-transparent lg:hidden"
      id="site-menu"
      onCancel={(event) => {
        // Esc: animate out instead of the instant native close.
        event.preventDefault();
        close();
      }}
      onClose={() => {
        tl.current?.kill();
        closing.current = false;
        gsap.set(dialogRef.current, { clearProps: 'clipPath' });
        window.__lenis?.start();
        onOpenChange(false);
        returnFocusTo()?.focus();
      }}
      ref={dialogRef}
    >
      <div className="flex min-h-full flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)] sm:px-8">
        {/* Top bar mirrors the header so the swap feels like one surface. */}
        <div className="flex h-16 shrink-0 items-center justify-between">
          <Wordmark />
          <button
            autoFocus
            className="label inline-flex min-h-11 items-center gap-2.5 rounded-full border border-surfaceBorderStrong px-4 text-textPrimary"
            onClick={close}
            type="button"
          >
            <span aria-hidden="true" className="relative block h-3 w-3">
              <span className="absolute left-0 top-1/2 h-px w-3 rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-3 -rotate-45 bg-current" />
            </span>
            Close
          </button>
        </div>

        <p className="label mt-8 flex items-center gap-3 text-textMuted" data-menu-fade="">
          <span className="text-accent">Index</span>
          <span aria-hidden="true" className="h-px w-8 bg-surfaceBorderStrong" />
          <span>{items.length} destinations</span>
        </p>

        <nav aria-label="Mobile" className="mt-5">
          <ul>
            {items.map((item, index) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li className="relative" key={item.href}>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-px origin-left bg-surfaceBorder"
                    data-menu-rule=""
                  />
                  <TransitionLink
                    aria-current={active ? 'page' : undefined}
                    className="group grid min-h-[4.75rem] grid-cols-[2.25rem_1fr_auto] items-center gap-x-2 py-3"
                    href={item.href}
                  >
                    <span
                      className={cn('label self-start pt-[0.55rem]', active ? 'text-accent' : 'text-textMuted')}
                      data-menu-side=""
                    >
                      0{index + 1}
                    </span>
                    <span className="block overflow-hidden">
                      <span className="block" data-menu-line="">
                        <span
                          className={cn(
                            'block text-[clamp(1.9rem,8.4vw,2.6rem)] font-medium leading-[1.02] tracking-[-0.045em]',
                            active ? 'text-accent' : 'text-textPrimary',
                          )}
                        >
                          {item.label}
                        </span>
                        <span className="label mt-1.5 block text-[0.68rem] text-textMuted">{blurbs[item.href]}</span>
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      data-menu-side=""
                      className={cn(
                        'grid h-10 w-10 place-items-center rounded-full border transition-colors duration-300',
                        active ? 'border-accent text-accent' : 'border-surfaceBorder text-textMuted group-active:border-textPrimary',
                      )}
                    >
                      {active ? <span className="h-1.5 w-1.5 rounded-full bg-accent" /> : '→'}
                    </span>
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pt-10">
          <div className="flex flex-wrap gap-x-6 pb-2" data-menu-fade="">
            {socials.map((link) => {
              const external = link.href.startsWith('http');
              return (
                <a
                  className="label inline-flex min-h-11 items-center text-textSecondary"
                  href={link.href}
                  key={link.label}
                  rel={external ? 'noopener noreferrer' : undefined}
                  target={external ? '_blank' : undefined}
                >
                  {link.label}
                  {external ? <span aria-hidden="true" className="ml-1 text-textMuted">↗</span> : null}
                </a>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-surfaceBorder py-4" data-menu-fade="">
            <div className="label space-y-1.5 text-textMuted">
              <p className="flex items-center gap-2">
                <span aria-hidden="true" className="live-dot" /> Available · 2026
              </p>
              <LocalTime className="flex" />
            </div>
            <ThemeToggle />
          </div>
          <div data-menu-fade="">
            <TransitionLink
              className="group relative flex min-h-14 w-full items-center justify-between overflow-hidden rounded-full bg-textPrimary pl-7 pr-2 text-base font-medium text-canvas"
              href="/contact"
            >
              <span>Let&apos;s talk</span>
              <span
                aria-hidden="true"
                className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accentFg transition-transform duration-500 ease-out group-active:translate-x-1"
              >
                →
              </span>
            </TransitionLink>
          </div>
        </div>
      </div>
    </dialog>
  );
});
