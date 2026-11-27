'use client';

import { useEffect } from 'react';
import { SceneIntentOnMount } from '@/components/canvas/SceneTrigger';
import { Magnetic } from '@/components/motion/Magnetic';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Section';

/** Shown when a page throws while rendering. The error boundary lets the visitor retry. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surfaces in the server and browser logs; there is no error service to notify.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh items-center pb-16 pt-[calc(var(--header-h)+2rem)]">
      <SceneIntentOnMount intensity={0.7} layout="full" shape="noise" signal={0.05} />
      <Container>
        <Eyebrow>Something went wrong</Eyebrow>
        <p
          aria-hidden="true"
          className="mt-4 font-display text-mega font-medium leading-[0.8] tracking-[-0.07em] text-textPrimary"
        >
          Err<span className="font-serif font-normal italic tracking-[-0.04em] text-accent">or.</span>
        </p>
        <h1 className="mt-8 max-w-3xl text-balance font-display text-h1 font-medium text-textPrimary">
          This page failed to <em className="font-serif font-normal italic tracking-[-0.02em]">load.</em>
        </h1>
        <p className="mt-6 max-w-xl text-lead text-textSecondary">
          That one is on me. Try again, and if it keeps happening the rest of the site should
          still work.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Magnetic>
            <Button onClick={reset} size="lg">
              Try again
            </Button>
          </Magnetic>
          <ButtonLink href="/" size="lg" variant="secondary">
            Back to the homepage
          </ButtonLink>
        </div>
        {error.digest ? <p className="label mt-12 text-textMuted">Ref {error.digest}</p> : null}
      </Container>
    </main>
  );
}
