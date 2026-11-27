import { SceneIntentOnMount } from '@/components/canvas/SceneTrigger';
import { Magnetic } from '@/components/motion/Magnetic';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Section';

export const metadata = {
  title: 'Page not found',
};

const routes = ['/projects', '/about', '/recognition', '/contact', '/colophon'] as const;

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center pb-16 pt-[calc(var(--header-h)+2rem)]">
      <SceneIntentOnMount intensity={0.7} layout="full" shape="noise" signal={0.05} />
      <Container>
        <Eyebrow>Error 404</Eyebrow>
        <p
          aria-hidden="true"
          className="mt-4 font-display text-mega font-medium leading-[0.8] tracking-[-0.07em] tabular-nums text-textPrimary"
        >
          4<span className="font-serif font-normal italic tracking-[-0.04em] text-accent">0</span>4
        </p>
        <Reveal
          as="h1"
          className="mt-8 max-w-3xl text-balance font-display text-h1 font-medium text-textPrimary"
          immediate
        >
          This page isn&apos;t in the <em className="font-serif font-normal italic tracking-[-0.02em]">system.</em>
        </Reveal>
        <p className="mt-6 max-w-xl text-lead text-textSecondary">
          It was moved, renamed, or never existed. The work is easy to find from here.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Magnetic>
            <ButtonLink href="/" size="lg">
              Back to the homepage
            </ButtonLink>
          </Magnetic>
          <ButtonLink href="/projects" size="lg" variant="secondary">
            See the work
          </ButtonLink>
        </div>
        <p className="label mt-12 flex flex-wrap gap-x-6 gap-y-2 text-textMuted">
          <span>Try</span>
          {routes.map((route) => (
            <ButtonLink className="!min-h-8 text-[inherit]" href={route} key={route} variant="link">
              {route}
            </ButtonLink>
          ))}
        </p>
      </Container>
    </main>
  );
}
