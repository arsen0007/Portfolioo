'use client';

import { useEffect } from 'react';
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
      <Container>
        <Eyebrow>Something went wrong</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-balance font-display text-h1 text-textPrimary">
          This page failed to load.
        </h1>
        <p className="mt-6 max-w-xl text-lead text-textSecondary">
          That one is on me. Try again, and if it keeps happening the rest of the site should
          still work.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset} size="lg">
            Try again
          </Button>
          <ButtonLink href="/" size="lg" variant="secondary">
            Back to the homepage
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}
