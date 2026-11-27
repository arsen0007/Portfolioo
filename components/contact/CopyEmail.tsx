'use client';

import { useState } from 'react';
import { Magnetic } from '@/components/motion/Magnetic';
import { Scramble } from '@/components/motion/Scramble';
import { buttonClasses } from '@/components/ui/Button';

type CopyState = 'idle' | 'copied' | 'failed';

/**
 * The address set huge, as a real mailto link (the no-JS path), with a big
 * copy button beside it. The "Copied" confirmation decodes out of glyphs.
 */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<CopyState>('idle');

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState('copied');
    } catch {
      setState('failed');
    }
    window.setTimeout(() => setState('idle'), 2500);
  }

  return (
    <div>
      <a
        className="block break-words font-display text-[clamp(1.55rem,0.35rem+5.3vw,5.6rem)] font-medium leading-[1.02] tracking-[-0.045em] text-textPrimary underline decoration-accent decoration-[3px] underline-offset-[0.14em] transition-colors duration-300 hover:text-accent"
        data-cursor="link"
        href={`mailto:${email}`}
      >
        {email}
      </a>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Magnetic>
          <button className={buttonClasses('primary', 'lg', 'min-h-16 px-10 text-lg')} onClick={copy} type="button">
            <span className="inline-flex min-w-[8.5ch] justify-center">
              {state === 'copied' ? <Scramble duration={700} text="Copied" /> : 'Copy address'}
            </span>
          </button>
        </Magnetic>
        <span aria-live="polite" className="label text-textMuted">
          {state === 'copied' ? 'Address copied to clipboard.' : null}
          {state === 'failed' ? 'Could not copy. Select the address above instead.' : null}
        </span>
      </div>
    </div>
  );
}
