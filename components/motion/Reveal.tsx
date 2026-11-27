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
        gsap.set(el, { visibility: 'visible' });
        return;
      }

      let split: SplitText | undefined;
      let tween: gsap.core.Tween | undefined;
      let done = false;

      const play = () => {
        if (done || !ref.current) return;
        done = true;

        if (mode === 'fade') {
          tween = gsap.fromTo(
            el,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: dur.md, ease: ease.out, delay },
          );
          return;
        }

        split = SplitText.create(el, {
          type: mode === 'lines' ? 'lines' : 'words,lines',
          mask: mode === 'lines' ? 'lines' : 'words',
          linesClass: 'split-line',
          autoSplit: mode === 'lines',
          onSplit(self) {
            gsap.set(el, { visibility: 'visible' });
            const targets = mode === 'lines' ? self.lines : self.words;
            // autoSplit re-runs this on resize: only animate the first time.
            if (tween) return;
            tween = gsap.from(targets, {
              yPercent: 112,
              duration: dur.lg,
              ease: ease.out,
              stagger: mode === 'lines' ? staggerTokens.lines : staggerTokens.words,
              delay,
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
        whenFonts(() => {
          if (waitFor) void waitFor().then(play);
          else play();
        });
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
        onEnter: () => whenFonts(play),
        onRefresh: (self) => {
          if (unreachable(self)) whenFonts(play);
        },
      });
      if (unreachable(st)) whenFonts(play);

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
