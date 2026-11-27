'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { dur, ease, stagger as staggerTokens } from '@/lib/motion/tokens';
import { gsap, motionAllowed, ScrollTrigger, SplitText, useGSAP } from '@/lib/motion/gsap';

type SplitRevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** lines: masked line rise (headlines). words: word rise. fade: block fade-up. */
  mode?: 'lines' | 'words' | 'fade';
  delay?: number;
  /** Reveal on mount instead of when scrolled into view (above the fold). */
  immediate?: boolean;
  /** With `immediate`: wait for this before revealing (e.g. the intro loader). */
  waitFor?: () => Promise<void>;
  id?: string;
};

/**
 * The house reveal. Text is real, server-rendered HTML; the motion is applied
 * on top. See the reveal contract in globals.css: hidden only when motion is
 * allowed, with a 2.5s CSS failsafe.
 *
 * Performance: text is split lazily, just before the element reaches the
 * viewport, so a page with dozens of reveals doesn't pay for every split (a
 * forced layout each) in one long task on mount.
 */
export function Reveal({
  as: Tag = 'div',
  children,
  className,
  delay = 0,
  id,
  immediate = false,
  mode = 'lines',
  waitFor,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!motionAllowed()) {
        gsap.set(el, { opacity: 1, visibility: 'visible' });
        return;
      }

      let split: SplitText | undefined;
      let tween: gsap.core.Tween | undefined;
      let done = false;

      /**
       * Split now, animate when `gate` resolves (or at once). Splitting early
       * matters under the intro loader: SplitText creates new elements, and
       * new text painted late would push Largest Contentful Paint to the end of
       * the intro. Moving existing lines later does not.
       */
      const play = (gate?: Promise<void>) => {
        if (done || !ref.current) return;
        done = true;
        const after = (fn: () => void) => (gate ? void gate.then(fn) : fn());

        if (mode === 'fade') {
          after(() => {
            tween = gsap.fromTo(
              el,
              { autoAlpha: 0, y: 28 },
              { autoAlpha: 1, y: 0, duration: dur.md, ease: ease.out, delay },
            );
          });
          return;
        }

        split = SplitText.create(el, {
          type: mode === 'lines' ? 'lines' : 'words,lines',
          mask: mode === 'lines' ? 'lines' : 'words',
          linesClass: 'split-line',
          // The default ('auto') adds aria-label to the element, which is not
          // allowed on <p>/<div>. Split spans keep the words in reading order.
          aria: 'none',
          autoSplit: mode === 'lines',
          onSplit(self) {
            // autoSplit re-runs this on resize: only animate the first time.
            if (tween) return;
            if (!gate) gsap.set(el, { opacity: 1, visibility: 'visible' });
            after(() => {
              if (tween) return;
              // `split` is unset while create() is still running; `self` is not.
              const current = split ?? self;
              gsap.set(el, { opacity: 1, visibility: 'visible' });
              tween = gsap.from(mode === 'lines' ? current.lines : current.words, {
                yPercent: 112,
                duration: dur.lg,
                ease: ease.out,
                stagger: mode === 'lines' ? staggerTokens.lines : staggerTokens.words,
                delay,
              });
            });
            return tween;
          },
        });
      };

      // Line breaks depend on the web font; split only once it is ready.
      const whenFonts = (fn: () => void) => {
        if (document.fonts?.status === 'loaded') fn();
        else document.fonts.ready.then(fn);
      };

      if (immediate) {
        whenFonts(() => play(waitFor ? waitFor() : undefined));
        return () => {
          tween?.kill();
          split?.revert();
        };
      }

      // Content near the very end of a page may never reach the start line:
      // reveal it straight away rather than leave it hidden.
      const unreachable = (self: ScrollTrigger) => self.start > ScrollTrigger.maxScroll(window) - 2;
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => whenFonts(() => play()),
        onRefresh: (self) => {
          if (unreachable(self)) whenFonts(() => play());
        },
      });
      if (unreachable(st)) whenFonts(() => play());

      return () => {
        st.kill();
        tween?.kill();
        split?.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag className={className} data-reveal="" id={id} ref={ref}>
      {children}
    </Tag>
  );
}
