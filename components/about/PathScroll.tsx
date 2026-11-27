'use client';

import { useRef } from 'react';
import { Eyebrow } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/Reveal';
import { gsap, motionAllowed, useGSAP } from '@/lib/motion/gsap';

export type PathChapter = { era: string; title: string; body: string };

/**
 * The three eras. On desktop with motion the section pins and the panels
 * travel sideways, scrubbed by scroll. On touch, narrow screens and under
 * reduced motion it is a plain vertical stack. The DOM order never changes.
 */
export function PathScroll({ chapters }: { chapters: readonly PathChapter[] }) {
  const root = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const pinEl = pin.current;
        const trackEl = track.current;
        if (!pinEl || !trackEl || !motionAllowed()) return;

        pinEl.dataset.hscroll = 'on';
        const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: pinEl,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(trackEl, { x: () => -distance() }, 0);
        if (bar.current) tl.fromTo(bar.current, { scaleX: 0.04 }, { scaleX: 1 }, 0);

        return () => {
          delete pinEl.dataset.hscroll;
          gsap.set(trackEl, { clearProps: 'transform' });
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div className="relative" ref={root}>
      <div
        className="group/path relative py-[clamp(4.5rem,11vw,8rem)] data-[hscroll=on]:flex data-[hscroll=on]:h-screen data-[hscroll=on]:flex-col data-[hscroll=on]:justify-center data-[hscroll=on]:overflow-hidden data-[hscroll=on]:py-0"
        ref={pin}
      >
        <div className="mx-auto w-full max-w-page px-[var(--gutter)]">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow index="02">Path</Eyebrow>
              <Reveal as="h2" className="mt-5 text-balance font-display text-h1 font-medium text-textPrimary">
                From attention to{' '}
                <em className="font-serif font-normal italic tracking-[-0.02em]">infrastructure.</em>
              </Reveal>
            </div>
            <p className="text-textSecondary lg:col-span-4 lg:col-start-9">
              Years of seeing what should exist. Then building exactly that, without leaving the seat.
            </p>
          </div>
        </div>

        <ol
          className="mt-12 flex flex-col px-[var(--gutter)] group-data-[hscroll=on]/path:mt-14 group-data-[hscroll=on]/path:w-max group-data-[hscroll=on]/path:flex-row group-data-[hscroll=on]/path:will-change-transform"
          ref={track}
        >
          {chapters.map((chapter, index) => {
            const [from, to] = chapter.era.split(' — ');
            const current = to === 'now';
            return (
              <li
                className="flex flex-col gap-6 border-t border-surfaceBorder py-10 group-data-[hscroll=on]/path:w-[min(62vw,58rem)] group-data-[hscroll=on]/path:shrink-0 group-data-[hscroll=on]/path:border-l group-data-[hscroll=on]/path:border-t-0 group-data-[hscroll=on]/path:px-12 group-data-[hscroll=on]/path:py-0 group-data-[hscroll=on]/path:first:border-l-0 group-data-[hscroll=on]/path:first:pl-0"
                key={chapter.era}
              >
                <div className="flex items-end gap-4">
                  <span className="font-display text-[clamp(4.5rem,15vw,13rem)] font-medium leading-[0.8] tracking-[-0.06em] tabular-nums text-textPrimary">
                    {from}
                  </span>
                  <span className="label flex items-center gap-2 pb-2 text-textMuted">
                    <span aria-hidden="true" className="h-px w-8 bg-surfaceBorderStrong" />
                    {current ? (
                      <>
                        <span aria-hidden="true" className="live-dot" />
                        <span className="font-serif text-xl normal-case italic tracking-normal text-textPrimary">now</span>
                      </>
                    ) : (
                      to
                    )}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-[auto_1fr] md:gap-8">
                  <p className="label pt-1.5 text-accent">{String(index + 1).padStart(2, '0')} / 03</p>
                  <div className="max-w-xl">
                    <h3 className="font-display text-h3 font-medium text-textPrimary">{chapter.title}</h3>
                    <p className="mt-4 text-textSecondary">{chapter.body}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div
          aria-hidden="true"
          className="mx-auto mt-10 hidden w-full max-w-page px-[var(--gutter)] group-data-[hscroll=on]/path:block"
        >
          <div className="h-px w-full bg-surfaceBorder">
            <span className="block h-px origin-left bg-accent" ref={bar} style={{ transform: 'scaleX(0.04)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
