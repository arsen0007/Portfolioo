import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SceneIntentOnMount } from '@/components/canvas/SceneTrigger';
import { Counter } from '@/components/motion/Counter';
import { Reveal } from '@/components/motion/Reveal';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Section';
import { dur, ease, stagger } from '@/lib/motion/tokens';

export const metadata: Metadata = {
  title: 'Colophon',
  description:
    'How this site was built: the SIGNAL concept, the type system, the colour tokens, the motion principles, a 94,363-point particle engine, and the performance and accessibility commitments.',
};

const swatches = [
  { name: 'Ink', token: '--canvas', dark: '#08080A', light: '#F1EEE8', note: 'The page' },
  { name: 'Surface', token: '--surface', dark: '#0F0F12', light: '#F8F6F2', note: 'Raised once' },
  { name: 'Raised', token: '--surface-raised', dark: '#16161A', light: '#E7E3DA', note: 'Raised twice' },
  { name: 'Bone', token: '--text-primary', dark: '#EDEAE3', light: '#0E0E10', note: 'Primary text' },
  { name: 'Fog', token: '--text-secondary', dark: '#A9A69F', light: '#45433F', note: 'Secondary text' },
  { name: 'Mute', token: '--text-muted', dark: '#85827C', light: '#66635D', note: 'Meta, AA checked' },
  { name: 'Hairline', token: '--surface-border-strong', dark: '#EDEAE3 18%', light: '#0E0E10 22%', note: 'Rules, not boxes' },
  { name: 'Signal', token: '--accent', dark: '#FF5A1F', light: '#C93A0A', note: 'It is now a system' },
] as const;

const motionPrinciples = [
  {
    title: 'Reveal, never decorate',
    body: 'Headlines rise out of a mask, line by line. The text is real HTML the whole time; motion only moves it.',
  },
  {
    title: 'Transform and opacity only',
    body: 'Nothing animates layout. Scroll work runs through ScrollTrigger, never through a scroll handler.',
  },
  {
    title: 'Scroll is the timeline',
    body: 'Lenis rides native scroll, so anchors, the keyboard and Space and PageDown all still work.',
  },
  {
    title: 'The cursor is a disturbance',
    body: 'Move over the particles and they scatter like an unsorted queue, then settle back into order.',
  },
  {
    title: 'Degrade, do not disappear',
    body: 'Reduced motion, touch and no JavaScript each get a finished page. No pinning, no scroll-jacking on touch.',
  },
] as const;

const tiers = [
  { tier: 'High', device: 'Desktop with a discrete GPU', points: '94,363', post: 'Full field' },
  { tier: 'Mid', device: 'Laptop iGPU, modern phone', points: '32,768', post: 'Lighter post-processing' },
  { tier: 'Low', device: 'Reduced motion, no WebGL2', points: '0', post: 'Static poster of the final state' },
] as const;

const shapes = [
  ['noise', 'the unsorted queue'],
  ['clusters', '31 clusters, one per legal issue type'],
  ['pipeline', 'classify, summarise, outreach'],
  ['bridge', 'operators and engineers, one line between'],
  ['grid', 'a system at rest'],
  ['sphere', 'the calm default'],
  ['portrait', 'sampled from the real photo'],
  ['text', 'any string, in points'],
  ['project', 'one shape per case study'],
] as const;

const budgets = [
  { metric: 'LCP', value: '< 2.0s', note: 'mobile, 4G. The hero is HTML and never waits for WebGL.' },
  { metric: 'CLS', value: '< 0.02', note: 'every image reserves its space' },
  { metric: 'INP', value: '< 150ms', note: 'small client islands, server components elsewhere' },
  { metric: 'A11y', value: '100', note: 'Lighthouse, on both themes' },
] as const;

const commitments = [
  'Every word is HTML. WebGL only decorates, and the canvas is hidden from assistive technology.',
  'Full keyboard use with a visible focus ring on everything interactive.',
  'prefers-reduced-motion is honoured everywhere: no Lenis, no pinning, a still poster in place of the field.',
  'AA contrast on both themes, checked against the tokens above.',
  'The dark theme is the hero. The light "paper" theme is designed, not inverted.',
  'Nothing is invented. Every number on the site, and every particle, is true.',
] as const;

const stack = [
  ['Framework', 'Next.js 14 (App Router), React 18, TypeScript'],
  ['Styling', 'Tailwind CSS driven by CSS custom properties'],
  ['Motion', 'GSAP 3.13 with ScrollTrigger and SplitText, Lenis'],
  ['WebGL', 'three.js, React Three Fiber, postprocessing, detect-gpu'],
  ['State', 'zustand: pages send intent, the one canvas reacts'],
  ['Type', 'Geist, Geist Mono, Instrument Serif. Self-hosted, OFL'],
] as const;

function Row({ children, index, title }: { children: ReactNode; index: string; title: ReactNode }) {
  return (
    <section className="border-t border-surfaceBorder py-[clamp(4rem,9vw,8rem)]">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <Eyebrow index={index}>{typeof title === 'string' ? title : ''}</Eyebrow>
        </div>
        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}

export default function ColophonPage() {
  return (
    <main className="pb-[clamp(3.5rem,9vw,7.5rem)]">
      <SceneIntentOnMount intensity={0.25} layout="right" shape="grid" signal={0.5} />

      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { label: 'Colophon' },
        ]}
      />

      <Container className="pb-[clamp(3rem,7vw,6rem)] pt-10 md:pt-16">
        <Eyebrow index="00">Colophon</Eyebrow>
        <Reveal
          as="h1"
          className="mt-6 max-w-[11ch] text-balance font-display text-display font-medium text-textPrimary"
          immediate
        >
          How this site was <em className="font-serif font-normal italic tracking-[-0.03em]">built.</em>
        </Reveal>
        <p className="mt-10 max-w-[52ch] text-lead text-textSecondary">
          The site is a case study of its own. It is built to show the one thing I do: turn work
          people do by hand into a system that runs. Everything below is true of what you are
          looking at.
        </p>
      </Container>

      <Container>
        {/* 01 · Concept */}
        <Row index="01" title="The idea">
          <Reveal as="h2" className="text-balance font-display text-h1 font-medium text-textPrimary">
            Signal from <em className="font-serif font-normal italic tracking-[-0.02em]">noise.</em>
          </Reveal>
          <p className="mt-8 max-w-[58ch] text-lead text-textSecondary">
            A messy manual queue becomes a clean, running system. The field of points behind every
            page starts as noise and organises itself as you move through the site. Orange means
            one thing: this has become a system.
          </p>
        </Row>

        {/* 02 · Type */}
        <Row index="02" title="Type system">
          <div className="border-t border-surfaceBorderStrong">
            <div className="border-b border-surfaceBorderStrong py-8">
              <p className="label flex justify-between gap-4 text-textMuted">
                <span>Geist · Medium · display and body</span>
                <span>Tracking −0.04em</span>
              </p>
              <p className="mt-6 break-words font-display text-[clamp(3.5rem,1rem+10vw,11rem)] font-medium leading-[0.86] tracking-[-0.06em] text-textPrimary">
                Systems.
              </p>
              <p className="mt-6 max-w-[48ch] text-textSecondary">
                Set tight and large. Headlines are never smaller than they have to be.
              </p>
            </div>
            <div className="border-b border-surfaceBorderStrong py-8">
              <p className="label flex justify-between gap-4 text-textMuted">
                <span>Instrument Serif · Italic · the human accent</span>
                <span>One or two words per heading</span>
              </p>
              <p className="mt-6 break-words font-serif text-[clamp(4rem,1rem+11vw,12.5rem)] italic leading-[0.86] tracking-[-0.03em] text-textPrimary">
                by hand
              </p>
              <p className="mt-6 max-w-[48ch] text-textSecondary">
                The warmth in a cold system. Never body copy, never more than one per heading.
              </p>
            </div>
            <div className="border-b border-surfaceBorderStrong py-8">
              <p className="label flex justify-between gap-4 text-textMuted">
                <span>Geist Mono · the system voice</span>
                <span>Uppercase, +0.08em</span>
              </p>
              <p className="mt-6 break-words font-mono text-[clamp(2.6rem,0.6rem+7.6vw,8.5rem)] leading-[0.95] tracking-[-0.04em] tabular-nums text-textPrimary">
                94,363
              </p>
              <p className="mt-6 max-w-[48ch] text-textSecondary">
                Eyebrows, indices, meta and numbers. If it is data, it is mono.
              </p>
            </div>
          </div>
        </Row>

        {/* 03 · Colour */}
        <Row index="03" title="Colour tokens">
          <p className="max-w-[56ch] text-textSecondary">
            Every colour is a CSS variable, so the paper theme is a second set of values rather
            than a second design. These swatches read the live variables: switch the theme and
            they change.
          </p>
          <ul className="mt-10 grid gap-px border border-surfaceBorderStrong bg-surfaceBorderStrong sm:grid-cols-2 xl:grid-cols-4">
            {swatches.map((swatch) => (
              <li className="bg-canvas" key={swatch.token}>
                <div
                  className="h-28 border-b border-surfaceBorder"
                  style={{ background: `var(${swatch.token})` }}
                />
                <div className="space-y-1 p-4">
                  <p className="flex items-baseline justify-between gap-3 font-display text-lg font-medium text-textPrimary">
                    {swatch.name}
                    <span className="label text-textMuted">{swatch.note}</span>
                  </p>
                  <p className="label text-textSecondary">var({swatch.token})</p>
                  <p className="label text-textMuted">
                    Ink {swatch.dark} · Paper {swatch.light}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Row>

        {/* 04 · Motion */}
        <Row index="04" title="Motion principles">
          <ol className="border-t border-surfaceBorderStrong">
            {motionPrinciples.map((item, index) => (
              <li
                className="grid gap-x-8 gap-y-2 border-b border-surfaceBorderStrong py-6 sm:grid-cols-[3rem_1fr]"
                key={item.title}
              >
                <span className="label pt-1.5 text-accent">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-display text-h3 font-medium text-textPrimary">{item.title}</h3>
                  <p className="mt-2 max-w-[56ch] text-textSecondary">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <dl className="label mt-10 grid grid-cols-2 gap-x-6 gap-y-4 text-textMuted sm:grid-cols-4">
            <div>
              <dt>Ease</dt>
              <dd className="mt-1 text-textPrimary">{ease.out}</dd>
            </div>
            <div>
              <dt>Durations</dt>
              <dd className="mt-1 text-textPrimary">
                {Object.entries(dur)
                  .map(([, value]) => value)
                  .join(' / ')}
                s
              </dd>
            </div>
            <div>
              <dt>Line stagger</dt>
              <dd className="mt-1 text-textPrimary">{stagger.lines}s</dd>
            </div>
            <div>
              <dt>Word stagger</dt>
              <dd className="mt-1 text-textPrimary">{stagger.words}s</dd>
            </div>
          </dl>
        </Row>

        {/* 05 · Particle engine */}
        <Row index="05" title="The particle engine">
          <p className="font-display text-[clamp(4.5rem,1rem+14vw,15rem)] font-medium leading-[0.82] tracking-[-0.06em] tabular-nums text-textPrimary">
            <Counter value="94,363" />
          </p>
          <p className="mt-8 max-w-[52ch] text-lead text-textSecondary">
            points on a desktop GPU. One for every lead BarHunter has sourced, so the number on the
            screen is the number in the database.
          </p>

          <div className="mt-12 border-t border-surfaceBorderStrong">
            {tiers.map((tier) => (
              <div
                className="grid gap-x-6 gap-y-1 border-b border-surfaceBorder py-4 sm:grid-cols-[4rem_1.4fr_7rem_1fr] sm:items-baseline"
                key={tier.tier}
              >
                <p className="label text-accent">{tier.tier}</p>
                <p className="text-textPrimary">{tier.device}</p>
                <p className="font-mono tabular-nums text-textPrimary">{tier.points}</p>
                <p className="text-small text-textMuted">{tier.post}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-[56ch] text-small text-textMuted">
            On a phone the caption changes with the tier: a sample of 32,768 of the 94,363. The
            honesty rule holds on every device.
          </p>

          <h3 className="label mt-14 text-textMuted">Shapes the field can become</h3>
          <ul className="mt-4 grid gap-x-8 border-t border-surfaceBorderStrong sm:grid-cols-2">
            {shapes.map(([name, note]) => (
              <li className="flex items-baseline justify-between gap-4 border-b border-surfaceBorder py-3" key={name}>
                <span className="font-mono text-small text-textPrimary">{name}</span>
                <span className="text-right text-small text-textMuted">{note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[56ch] text-textSecondary">
            There is a single canvas, mounted once. Pages never touch it: they send an intent (a
            shape, a place, how much of it has become signal) and the scene moves toward it.
            Navigating never rebuilds the WebGL context.
          </p>
        </Row>

        {/* 06 · Performance and accessibility */}
        <Row index="06" title="Performance and accessibility">
          <dl className="grid gap-px border border-surfaceBorderStrong bg-surfaceBorderStrong sm:grid-cols-2">
            {budgets.map((budget) => (
              <div className="bg-canvas p-6" key={budget.metric}>
                <dt className="label text-textMuted">{budget.metric} · budget</dt>
                <dd className="mt-4 font-display text-h2 font-medium tabular-nums tracking-[-0.04em] text-textPrimary">
                  {budget.value}
                </dd>
                <dd className="mt-2 text-small text-textSecondary">{budget.note}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-12 border-t border-surfaceBorderStrong">
            {commitments.map((item, index) => (
              <li
                className="grid gap-x-6 border-b border-surfaceBorder py-4 sm:grid-cols-[3rem_1fr]"
                key={item}
              >
                <span className="label pt-1 text-textMuted">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-textSecondary">{item}</span>
              </li>
            ))}
          </ul>
        </Row>

        {/* 07 · Stack */}
        <Row index="07" title="Stack">
          <dl className="border-t border-surfaceBorderStrong">
            {stack.map(([name, value]) => (
              <div
                className="grid gap-x-8 gap-y-1 border-b border-surfaceBorder py-4 sm:grid-cols-[9rem_1fr]"
                key={name}
              >
                <dt className="label pt-1 text-textMuted">{name}</dt>
                <dd className="text-textPrimary">{value}</dd>
              </div>
            ))}
          </dl>
        </Row>
      </Container>
    </main>
  );
}
