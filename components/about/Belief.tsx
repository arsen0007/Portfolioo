'use client';

import { useRef } from 'react';
import { gsap, motionAllowed, useGSAP } from '@/lib/motion/gsap';

type BeliefProps = {
  index: string;
  claim: string;
  body: string;
  /** A phrase inside the claim that gets struck through as the claim enters. */
  strike?: string;
};

/**
 * A claim set as a big statement. A signal-orange rule draws beneath it as it
 * enters, and an optional phrase is struck out. Both are transform-only; with
 * no motion they are simply drawn.
 */
export function Belief({ body, claim, index, strike }: BeliefProps) {
  const root = useRef<HTMLLIElement>(null);
  const rule = useRef<HTMLSpanElement>(null);
  const struck = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!motionAllowed() || !root.current) return;
      const trigger = { trigger: root.current, start: 'top 78%', once: true };
      if (rule.current) {
        gsap.fromTo(rule.current, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: trigger });
      }
      if (struck.current) {
        gsap.fromTo(
          struck.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: 'expo.inOut', delay: 0.5, scrollTrigger: trigger },
        );
      }
      gsap.fromTo(
        root.current.querySelectorAll('[data-fade]'),
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1, scrollTrigger: trigger },
      );
    },
    { scope: root },
  );

  const at = strike ? claim.indexOf(strike) : -1;
  const parts = at >= 0 && strike ? [claim.slice(0, at), strike, claim.slice(at + strike.length)] : [claim];

  return (
    <li className="grid gap-x-8 gap-y-6 py-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12" ref={root}>
      <p className="label pt-3 text-accent lg:col-span-1">{index}</p>
      <div className="lg:col-span-10 xl:col-span-9">
        <h3 className="text-balance font-display text-[clamp(1.9rem,1.1rem+3.6vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-textPrimary">
          {parts.length === 3 ? (
            <>
              {parts[0]}
              <span className="relative inline-block">
                <span className="text-textSecondary">{parts[1]}</span>
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[55%] h-[0.07em] min-h-[2px] w-full origin-left bg-accent"
                  ref={struck}
                />
              </span>
              {parts[2]}
            </>
          ) : (
            claim
          )}
        </h3>
        <span aria-hidden="true" className="mt-6 block h-px w-full origin-left bg-accent" ref={rule} />
        <p className="mt-6 max-w-[62ch] text-lead text-textSecondary" data-fade="">
          {body}
        </p>
      </div>
    </li>
  );
}
