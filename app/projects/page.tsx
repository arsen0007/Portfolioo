import { SceneIntentOnMount } from '@/components/canvas/SceneTrigger';
import { Magnetic } from '@/components/motion/Magnetic';
import { Reveal } from '@/components/motion/Reveal';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Section';
import { WorkIndex } from '@/components/work/WorkIndex';
import { buildWorkItems } from '@/components/work/workItems';

export default function ProjectsPage() {
  const items = buildWorkItems();
  const count = String(items.length).padStart(2, '0');

  return (
    <main className="pb-[clamp(3.5rem,9vw,7.5rem)]">
      <SceneIntentOnMount intensity={0.5} layout="right" shape="clusters" signal={0.3} />

      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { label: 'Work' },
        ]}
      />

      <Container className="pt-8 md:pt-12">
        <header>
          <div className="flex items-center justify-between gap-6">
            <Eyebrow>Index</Eyebrow>
            <p className="label tabular-nums text-textMuted">{count} case studies</p>
          </div>

          <Reveal as="h1" className="mt-6 text-balance font-display text-display text-textPrimary md:mt-8" immediate>
            Work that <em className="font-serif font-normal italic">runs</em>.
          </Reveal>

          <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-12">
            <Reveal as="p" className="text-lead text-textSecondary md:col-span-6 md:col-start-7" delay={0.25} immediate mode="fade">
              Built to be used, not demoed. Each case study covers the problem, the product decisions, what those
              decisions cost, and the measured outcome.
            </Reveal>
          </div>
        </header>

        <div className="mt-14 md:mt-16">
          <WorkIndex items={items} />
        </div>

        <div className="mt-24 flex flex-col gap-6 border-t border-surfaceBorder pt-12 md:mt-32 md:flex-row md:items-end md:justify-between">
          <Reveal as="p" className="max-w-xl text-balance font-display text-h2 text-textPrimary">
            Have a workflow that should be a <em className="font-serif font-normal italic">system</em>?
          </Reveal>
          <Magnetic>
            <ButtonLink href="/contact" size="lg">
              Let&apos;s talk
            </ButtonLink>
          </Magnetic>
        </div>
      </Container>
    </main>
  );
}
