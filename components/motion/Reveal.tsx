'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { dur, ease, stagger as staggerTokens } from '@/lib/motion/tokens';
import { gsap, motionAllowed, SplitText, useGSAP } from '@/lib/motion/gsap';

type SplitRevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** lines: masked line rise (headlines). words: word rise. fade: block fade-up. */
  mode?: 'lines' | 'words' | 'fade';
  delay?: number;
  /** Reveal on mount instead of when scrolled into view (above the fold). */
  immediate?: boolean;
  id?: string;
};

/**
 * The house reveal. Text is real, server-rendered HTML; the motion is applied
 * on top. See the reveal contract in globals.css: hidden only when motion is
 * allowed, with a 2.5s CSS failsafe.
 */
export function Reveal({
  as: Tag = 'div',
  children,
  className,
  delay = 0,
  id,
  immediate = false,
  mode = 'lines',
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

      const scrollTrigger = immediate ? undefined : { trigger: el, start: 'top 88%', once: true };

      if (mode === 'fade') {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: dur.md, ease: ease.out, delay, scrollTrigger },
        );
        return;
      }

      let split: SplitText | undefined;
      // Fonts change line breaks; split only once they are ready.
      document.fonts.ready.then(() => {
        if (!ref.current) return;
        split = SplitText.create(el, {
          type: mode === 'lines' ? 'lines' : 'words,lines',
          mask: mode === 'lines' ? 'lines' : 'words',
          linesClass: 'split-line',
          autoSplit: mode === 'lines',
          onSplit(self) {
            gsap.set(el, { visibility: 'visible' });
            const targets = mode === 'lines' ? self.lines : self.words;
            return gsap.from(targets, {
              yPercent: 112,
              duration: dur.lg,
              ease: ease.out,
              stagger: mode === 'lines' ? staggerTokens.lines : staggerTokens.words,
              delay,
              scrollTrigger,
            });
          },
        });
      });

      return () => split?.revert();
    },
    { scope: ref },
  );

  return (
    <Tag className={className} data-reveal="" id={id} ref={ref}>
      {children}
    </Tag>
  );
}
