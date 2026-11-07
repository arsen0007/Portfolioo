import { ButtonLink } from '@/components/ui/Button';
import { Figure } from '@/components/ui/Figure';
import { Metric } from '@/components/ui/Metric';
import { Quote } from '@/components/ui/Quote';
import { Split } from '@/components/ui/Split';
import type { CaseStudyBlock, QuoteSource } from '@/lib/data/caseStudies';
import { recognition } from '@/lib/data/recognition';

const quoteIds: Record<QuoteSource, string> = {
  ceo: 'ceo',
  cto: 'cto',
  ciso: 'ciso',
  manager: 'fernando',
};

/** Renders one block of case study content in the shared two-column layout. */
export function CaseStudyBlockView({ block }: { block: CaseStudyBlock }) {
  switch (block.type) {
    case 'prose':
      return (
        <Split eyebrow={block.eyebrow} title={block.title}>
          <div className="max-w-prose space-y-5 text-textSecondary">
            {block.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Split>
      );

    case 'steps':
      return (
        <Split eyebrow={block.eyebrow} intro={block.intro} title={block.title}>
          <ol className="border-t border-surfaceBorder">
            {block.items.map((item, index) => (
              <li
                className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-surfaceBorder py-6"
                key={item.label}
              >
                <span className="pt-0.5 text-small tabular-nums text-textMuted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-medium text-textPrimary">{item.label}</h3>
                  <p className="mt-2 max-w-prose text-textSecondary">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
          {block.note ? <p className="mt-6 max-w-prose text-small text-textMuted">{block.note}</p> : null}
        </Split>
      );

    case 'facts':
      return (
        <Split eyebrow={block.eyebrow} intro={block.intro} title={block.title}>
          <div className="grid gap-8 border-t border-surfaceBorder pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {block.items.map((item) => (
              <Metric caption={item.label} key={item.label} value={item.value} />
            ))}
          </div>
        </Split>
      );

    case 'list':
      return (
        <Split eyebrow={block.eyebrow} intro={block.intro} title={block.title}>
          <ul className="border-t border-surfaceBorder">
            {block.items.map((item) => (
              <li className="border-b border-surfaceBorder py-6" key={item.title ?? item.body}>
                {item.title ? <h3 className="font-display text-h3 text-textPrimary">{item.title}</h3> : null}
                <p className={item.title ? 'mt-3 max-w-prose text-textSecondary' : 'max-w-prose text-textSecondary'}>
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </Split>
      );

    case 'terminal':
      return (
        <Split eyebrow={block.eyebrow} intro={block.intro} title={block.title}>
          {/* A focusable, labelled region so keyboard users can scroll wide lines. */}
          <pre
            aria-label={block.title}
            className="overflow-x-auto rounded-media border border-surfaceBorder bg-surfaceRaised p-4 font-mono text-small leading-relaxed text-textPrimary"
            role="region"
            tabIndex={0}
          >
            {block.lines.join('\n')}
          </pre>
          {block.caption ? <p className="mt-3 text-small text-textMuted">{block.caption}</p> : null}
        </Split>
      );

    case 'figure':
      return (
        <Split eyebrow={block.eyebrow} title={block.title}>
          <Figure
            alt={block.alt}
            caption={block.caption}
            height={block.height}
            sizes="(min-width: 1152px) 640px, 100vw"
            src={block.src}
            width={block.width}
          />
        </Split>
      );

    case 'quote': {
      const person = recognition.leadershipTier.find((item) => item.id === quoteIds[block.source]);
      if (!person) return null;

      return (
        <Split eyebrow={block.eyebrow} title={block.title}>
          <Quote attribution={`${person.name}, ${person.role}`} consequence={person.highlight}>
            {person.quote}
          </Quote>
        </Split>
      );
    }

    case 'links':
      return (
        <Split eyebrow={block.eyebrow} title={block.title}>
          <ul className="border-t border-surfaceBorder">
            {block.items.map((item) => (
              <li className="border-b border-surfaceBorder" key={item.href}>
                <ButtonLink
                  className="w-full justify-between !px-0 py-3"
                  href={item.href}
                  variant="link"
                >
                  {item.label}
                  <span aria-hidden="true">↗</span>
                </ButtonLink>
              </li>
            ))}
          </ul>
        </Split>
      );
  }
}
