import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** A hairline above the section, to separate it from the previous one. */
  ruled?: boolean;
  /** Narrow reading column. */
  narrow?: boolean;
};

/**
 * Vertical rhythm for every page section: generous on desktop, tighter on
 * phones, always from one place.
 */
export function Section({ children, className, id, narrow, ruled }: SectionProps) {
  return (
    <section
      className={cn(
        'py-[clamp(3.5rem,9vw,7.5rem)]',
        ruled && 'border-t border-surfaceBorder',
        className,
      )}
      id={id}
    >
      <Container narrow={narrow}>{children}</Container>
    </section>
  );
}

type EyebrowProps = {
  children: ReactNode;
  className?: string;
  accent?: boolean;
};

/** A short label above a heading. One per section; never smaller than 12px. */
export function Eyebrow({ accent = false, children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        'text-caption font-medium uppercase tracking-[0.08em]',
        accent ? 'text-accent' : 'text-textMuted',
        className,
      )}
    >
      {children}
    </p>
  );
}
