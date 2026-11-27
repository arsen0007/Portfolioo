import { BlockShell } from '@/components/case-study/BlockShell';
import { ButtonLink } from '@/components/ui/Button';
import { Figure } from '@/components/ui/Figure';
import { Metric } from '@/components/ui/Metric';
import { Quote } from '@/components/ui/Quote';
import type { CaseStudyBlock, QuoteSource } from '@/lib/data/caseStudies';
import { recognition } from '@/lib/data/recognition';

const quoteIds: Record<QuoteSource, string> = {
  ceo: 'ceo',
  cto: 'cto',
  ciso: 'ciso',
  manager: 'fernando',
};

const pad = (n: number) => String(n).padStart(2, '0');

/** Renders one block of case study content inside a chapter. */
export function CaseStudyBlockView({ block }: { block: CaseStudyBlock }) {
  switch (block.type) {
    case 'prose':
      return (
        <BlockShell eyebrow={block.eyebrow} title={block.title}>
          <div className="max-w-prose space-y-5 text-lead text-textSecondary">
            {block.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </BlockShell>
      );

    case 'steps':
      return (
        <BlockShell eyebrow={block.eyebrow} intro={block.intro} title={block.title}>
          <ol className="border-t border-surfaceBorder">
            {block.items.map((item, index) => (
              <li
                className="grid grid-cols-[2.75rem_1fr] gap-x-4 border-b border-surfaceBorder py-7 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1.3fr)] md:gap-x-8"
                key={item.label}
              >
                <span className="label pt-1.5 tabular-nums text-accent">{pad(index + 1)}</span>
                <h4 className="font-display text-h3 font-medium text-textPrimary">{item.label}</h4>
                <p className="col-start-2 mt-3 max-w-prose text-textSecondary md:col-start-3 md:mt-0">{item.body}</p>
              </li>
            ))}
          </ol>
          {block.note ? <p className="label mt-6 max-w-prose text-textMuted">{block.note}</p> : null}
        </BlockShell>
      );

    case 'facts':
      return (
        <BlockShell eyebrow={block.eyebrow} intro={block.intro} title={block.title}>
          <div className="grid gap-x-8 gap-y-12 border-t border-surfaceBorder pt-10 sm:grid-cols-2">
            {block.items.map((item) => (
              <Metric caption={item.label} key={item.label} value={item.value} />
            ))}
          </div>
        </BlockShell>
      );

    case 'list':
      return (
        <BlockShell eyebrow={block.eyebrow} intro={block.intro} title={block.title}>
          <ul className="border-t border-surfaceBorder">
            {block.items.map((item, index) => (
              <li
                className="grid grid-cols-[2.75rem_1fr] gap-x-4 border-b border-surfaceBorder py-7 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1.3fr)] md:gap-x-8"
                key={item.title ?? item.body}
              >
                <span className="label pt-1.5 tabular-nums text-textMuted">{pad(index + 1)}</span>
                {item.title ? (
                  <>
                    <h4 className="font-display text-h3 font-medium text-textPrimary">{item.title}</h4>
                    <p className="col-start-2 mt-3 max-w-prose text-textSecondary md:col-start-3 md:mt-0">{item.body}</p>
                  </>
                ) : (
                  <p className="max-w-prose text-textSecondary md:col-span-2">{item.body}</p>
                )}
              </li>
            ))}
          </ul>
        </BlockShell>
      );

    case 'terminal':
      return (
        <BlockShell eyebrow={block.eyebrow} intro={block.intro} title={block.title}>
          {/* A focusable, labelled region so keyboard users can scroll wide lines. */}
          <pre
            aria-label={block.title}
            className="overflow-x-auto rounded-media border border-surfaceBorder bg-surfaceRaised p-5 font-mono text-small leading-relaxed text-textPrimary"
            role="region"
            tabIndex={0}
          >
            {block.lines.join('\n')}
          </pre>
          {block.caption ? <p className="label mt-4 text-textMuted">{block.caption}</p> : null}
        </BlockShell>
      );

    case 'figure':
      return (
        <BlockShell eyebrow={block.eyebrow} title={block.title}>
          <div data-cursor="view" data-cursor-label="View">
            <Figure
              alt={block.alt}
              caption={block.caption}
              height={block.height}
              sizes="(min-width: 1152px) 880px, 100vw"
              src={block.src}
              width={block.width}
            />
          </div>
        </BlockShell>
      );

    case 'quote': {
      const person = recognition.leadershipTier.find((item) => item.id === quoteIds[block.source]);
      if (!person) return null;

      return (
        <BlockShell eyebrow={block.eyebrow} title={block.title}>
          <Quote attribution={`${person.name}, ${person.role}`} consequence={person.highlight}>
            {person.quote}
          </Quote>
        </BlockShell>
      );
    }

    case 'links':
      return (
        <BlockShell eyebrow={block.eyebrow} title={block.title}>
          <ul className="border-t border-surfaceBorder">
            {block.items.map((item) => (
              <li className="border-b border-surfaceBorder" key={item.href}>
                <ButtonLink className="w-full justify-between !px-0 py-3" href={item.href} variant="link">
                  {item.label}
                  <span aria-hidden="true">↗</span>
                </ButtonLink>
              </li>
            ))}
          </ul>
        </BlockShell>
      );
  }
}
