'use client';

import { useState } from 'react';
import { buttonClasses } from '@/components/ui/Button';

type CopyState = 'idle' | 'copied' | 'failed';

/** Copies the address to the clipboard. The mailto link next to it is the fallback. */
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
    <>
      <button className={buttonClasses('secondary', 'md')} onClick={copy} type="button">
        {state === 'copied' ? 'Copied' : 'Copy address'}
      </button>
      <span aria-live="polite" className="text-small text-textMuted">
        {state === 'copied' ? 'Address copied to clipboard.' : null}
        {state === 'failed' ? 'Could not copy. Select the address above instead.' : null}
      </span>
    </>
  );
}
