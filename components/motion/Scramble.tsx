'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = '01<>/\\[]{}=+*#%&ABCDEFGHJKLMNPQRSTUVWXYZ';

type ScrambleProps = {
  text: string;
  className?: string;
  /** Re-scramble whenever this key changes (e.g. on hover). */
  trigger?: unknown;
  /** ms */
  duration?: number;
};

/**
 * Decodes text from random glyphs into the real string, left to right.
 * The accessible name is always the real text.
 */
export function Scramble({ className, duration = 600, text, trigger }: ScrambleProps) {
  const [display, setDisplay] = useState(text);
  const frame = useRef<number>();

  useEffect(() => {
    if (!document.documentElement.classList.contains('motion-ok')) {
      setDisplay(text);
      return;
    }
    const start = performance.now();
    const run = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const revealed = Math.floor(t * text.length);
      let out = '';
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        out += i < revealed || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
      if (t < 1) frame.current = requestAnimationFrame(run);
    };
    frame.current = requestAnimationFrame(run);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [text, trigger, duration]);

  return (
    <span aria-label={text} className={className} role="text">
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
