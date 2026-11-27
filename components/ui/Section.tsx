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

/** Vertical rhythm for every page section, from one place. */
export function Section({ children, className, id, narrow, ruled }: SectionProps) {
  return (
    <section
      className={cn(
        'relative py-[clamp(4.5rem,11vw,10rem)]',
        ruled && 'border-t border-surfaceBorder',
        id && 'scroll-mt-[var(--header-h)]',
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
  /** Signal colour: use for the one eyebrow on a screen that marks "live". */
  accent?: boolean;
  /** Section index shown before the label, e.g. "01". */
  index?: string;
};

/**
 * The system voice: a mono, uppercase label above a heading, optionally
 * numbered like an engineering log ("01 — Selected work").
 */
export function Eyebrow({ accent = false, children, className, index }: EyebrowProps) {
  return (
    <p className={cn('label flex items-center gap-3', accent ? 'text-accent' : 'text-textMuted', className)}>
      {index ? (
        <>
          <span className="text-accent">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-surfaceBorderStrong" />
        </>
      ) : null}
      <span>{children}</span>
    </p>
  );
}
