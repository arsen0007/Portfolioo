'use client';

import Link, { type LinkProps } from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';

/**
 * Client navigation wrapped in the View Transitions API, so routes cross-fade
 * (see ::view-transition rules in globals.css) and any element given a
 * matching `style={{ viewTransitionName: 'x' }}` on both pages morphs between
 * them — the shared-element effect used from the work index into a case study.
 *
 * Falls back to a plain Next <Link> when unsupported, under reduced motion,
 * or for modified clicks (new tab etc.).
 */

let pending: (() => void) | null = null;

/** Mount once (in the root layout): resolves the transition when the new route commits. */
export function TransitionResolver() {
  const pathname = usePathname();
  useEffect(() => {
    if (pending) {
      // Wait a frame so the new page has painted.
      const resolve = pending;
      pending = null;
      requestAnimationFrame(() => resolve());
    }
  }, [pathname]);
  return null;
}

type TransitionLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
    href: string;
  };

export function TransitionLink({ children, href, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (href === pathname || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return;

    const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => unknown };
    const reduced = !document.documentElement.classList.contains('motion-ok');
    if (!doc.startViewTransition || reduced) return;

    event.preventDefault();
    doc.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          pending = resolve;
          // Never hang the page if navigation is slow or fails.
          window.setTimeout(() => {
            if (pending === resolve) {
              pending = null;
              resolve();
            }
          }, 1600);
          router.push(href);
        }),
    );
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
