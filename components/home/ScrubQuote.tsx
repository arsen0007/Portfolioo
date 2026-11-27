'use client';

import { useRef } from 'react';
import { gsap, motionAllowed, useGSAP } from '@/lib/motion/gsap';

/** Big serif quote; with motion, words light up one by one as you scroll. Fully readable otherwise. */
export function ScrubQuote({ text }: { text: string }) {
  const ref = useRef<HTMLQuoteElement>(null);
  const words = text.split(' ');

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionAllowed()) return;
      const targets = el.querySelectorAll('.scrub-word');
      gsap.fromTo(
        targets,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.5,
          scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 52%', scrub: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <blockquote
      className="text-pretty font-serif text-[clamp(2.1rem,1rem+4.6vw,5.6rem)] leading-[1.04] tracking-[-0.02em] text-textPrimary"
      ref={ref}
    >
      <p>
        <span aria-hidden="true">“</span>
        {words.map((w, i) => (
          <span className="scrub-word" key={i}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
        <span aria-hidden="true">”</span>
      </p>
    </blockquote>
  );
}
