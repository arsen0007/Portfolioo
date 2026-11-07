import type { ReactNode } from 'react';
import { Eyebrow, Section } from '@/components/ui/Section';

type SplitProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  intro?: string;
  id?: string;
};

/**
 * A ruled section with the label and heading in a narrow left column and the
 * content in a wide right column. Collapses to a single column on phones.
 */
export function Split({ children, eyebrow, id, intro, title }: SplitProps) {
  return (
    <Section id={id} ruled>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-h2 text-textPrimary">{title}</h2>
          {intro ? <p className="mt-4 text-textSecondary">{intro}</p> : null}
        </div>
        <div className="lg:col-span-7 lg:col-start-6">{children}</div>
      </div>
    </Section>
  );
}
