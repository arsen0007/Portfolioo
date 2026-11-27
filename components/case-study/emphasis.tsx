import type { ReactNode } from 'react';

export function Em({ children }: { children: ReactNode }) {
  return <em className="font-serif font-normal italic">{children}</em>;
}

/** Sets the last word of a heading in the serif italic: one emphasis per heading. */
export function EmLast({ text }: { text: string }): ReactNode {
  const match = text.match(/^(.*\s)?([^\s]+?)([.,:;!?]*)$/);
  if (!match || !match[2]) return text;
  return (
    <>
      {match[1]}
      <Em>{match[2]}</Em>
      {match[3]}
    </>
  );
}

/** Sets one phrase of a sentence in the serif italic; falls back to the last two words. */
export function EmPhrase({ phrase, text }: { text: string; phrase?: string }): ReactNode {
  let start = phrase ? text.indexOf(phrase) : -1;
  let len = phrase?.length ?? 0;
  if (start < 0) {
    const words = text.replace(/[.\s]+$/, '').split(/\s+/);
    const tail = words.slice(-2).join(' ');
    start = text.lastIndexOf(tail);
    len = tail.length;
  }
  if (start < 0) return text;
  return (
    <>
      {text.slice(0, start)}
      <Em>{text.slice(start, start + len)}</Em>
      {text.slice(start + len)}
    </>
  );
}

/** Which phrase of each project's tagline carries the serif emphasis. */
export const taglineEmphasis: Record<string, string> = {
  barhunter: 'searchable in one place',
  casewise: 'adopted at the company level',
  'arsens-lab': 'keeping alive',
  genie: 'built from scratch',
  'le-mans-t2': 'won the ClearRoute x Le Mans 24h Hackathon globally',
  mailmerge: 'outreach preparation',
  fhoneman: 'booking workflow',
  'feedback-cascade': 'never give feedback',
};
