'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Pages that already close on their own call to action. Showing the footer's
 * CTA straight after one reads as a stutter (two "let's talk" blocks in a
 * row), so the footer keeps only its index there.
 */
const PAGES_WITH_OWN_CLOSER = new Set(['/', '/contact', '/projects', '/certifications']);

export function FooterCta({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const pathname = usePathname();
  return <>{PAGES_WITH_OWN_CLOSER.has(pathname) ? fallback : children}</>;
}
