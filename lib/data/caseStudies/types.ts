/**
 * Extra content for a case study, rendered after the standard sections
 * (overview, problem, what I built) and before the decisions, constraints and
 * outcome that come from `story` in lib/data/projects.ts.
 *
 * Blocks are plain data (strings and numbers only, no JSX) so every case study
 * shares one layout, one type scale and one mobile behaviour.
 */
export type QuoteSource = 'ceo' | 'cto' | 'ciso' | 'manager';

export type CaseStudyBlock =
  /** Headed paragraphs of prose. */
  | { type: 'prose'; eyebrow: string; title: string; paragraphs: string[] }
  /** An ordered sequence: a pipeline, a boot order, a dispatch chain. */
  | {
      type: 'steps';
      eyebrow: string;
      title: string;
      intro?: string;
      items: { label: string; body: string }[];
      note?: string;
    }
  /** Numbers, each with its denominator in the label. */
  | {
      type: 'facts';
      eyebrow: string;
      title: string;
      intro?: string;
      items: { value: string; label: string }[];
    }
  /** Unordered titled items: trade-offs, failure modes, lessons. */
  | {
      type: 'list';
      eyebrow: string;
      title: string;
      intro?: string;
      items: { title?: string; body: string }[];
    }
  /** Monospaced output: an execution trace, a log, a config. */
  | {
      type: 'terminal';
      eyebrow: string;
      title: string;
      intro?: string;
      lines: string[];
      caption?: string;
    }
  /** A screenshot or image with its alt text and caption. */
  | {
      type: 'figure';
      eyebrow: string;
      title: string;
      src: string;
      alt: string;
      width: number;
      height: number;
      caption?: string;
    }
  /** A quote read from lib/data/recognition.ts, so it is never copied. */
  | { type: 'quote'; eyebrow: string; title: string; source: QuoteSource }
  /** Outbound links. */
  | {
      type: 'links';
      eyebrow: string;
      title: string;
      items: { label: string; href: string }[];
    };

export type CaseStudyContent = {
  blocks: CaseStudyBlock[];
};
