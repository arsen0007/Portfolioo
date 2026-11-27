import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { EmLast } from '@/components/case-study/emphasis';
import { Eyebrow } from '@/components/ui/Section';

type BlockShellProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
};

/** One sub-section inside a chapter: hairline, mono eyebrow, heading with a serif-italic last word. */
export function BlockShell({ children, className, eyebrow, intro, title }: BlockShellProps) {
  return (
    <div className={className ?? 'mt-20 border-t border-surfaceBorder pt-8 md:mt-28 md:pt-10'}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Reveal as="h3" className="mt-5 max-w-[24ch] text-balance font-display text-h2 font-medium text-textPrimary">
        <EmLast text={title} />
      </Reveal>
      {intro ? <p className="mt-5 max-w-prose text-lead text-textSecondary">{intro}</p> : null}
      <div className="mt-10">{children}</div>
    </div>
  );
}
