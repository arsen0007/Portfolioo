import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Section';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center pb-16 pt-[calc(var(--header-h)+2rem)]">
      <Container>
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-balance font-display text-h1 text-textPrimary">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-6 max-w-xl text-lead text-textSecondary">
          It was moved, renamed, or never existed. The work is easy to find from here.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            Back to the homepage
          </ButtonLink>
          <ButtonLink href="/projects" size="lg" variant="secondary">
            See the work
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}
