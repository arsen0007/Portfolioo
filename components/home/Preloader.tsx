'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap, motionAllowed } from '@/lib/motion/gsap';

const KEY = 'ta:preloaded';
const TARGET = 94363;

function fmt(n: number): string {
  const s = String(Math.round(n)).padStart(6, '0');
  return `${s.slice(0, 3)},${s.slice(3)}`;
}

/** True when the preloader will run on this visit (first per session, motion allowed). */
export function willPreload(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return motionAllowed() && !window.sessionStorage.getItem(KEY);
  } catch {
    return false;
  }
}

/**
 * First visit per session only, hard-capped at 1.8s. Decorative (aria-hidden):
 * the real page is rendered underneath from the first paint, so LCP never waits.
 */
export function Preloader() {
  const [show, setShow] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!willPreload()) return;
    try {
      window.sessionStorage.setItem(KEY, '1');
    } catch {
      /* private mode: fine */
    }
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const stopScroll = () => window.__lenis?.stop();
    stopScroll();
    const retry = window.setTimeout(stopScroll, 60);
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    const state = { n: 0 };
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      document.documentElement.style.overflow = prevOverflow;
      window.__lenis?.start();
      setShow(false);
    };

    const tl = gsap.timeline({ onComplete: release });
    tl.to(state, {
      n: TARGET,
      duration: 1.05,
      ease: 'power3.inOut',
      onUpdate: () => {
        if (numRef.current) numRef.current.textContent = fmt(state.n);
      },
    })
      .to(barRef.current, { scaleX: 1, duration: 1.05, ease: 'power3.inOut' }, 0)
      .to(metaRef.current, { autoAlpha: 0, y: -12, duration: 0.25, ease: 'power2.in' }, 1.1)
      .to(topRef.current, { yPercent: -100, duration: 0.6, ease: 'expo.inOut' }, 1.15)
      .to(botRef.current, { yPercent: 100, duration: 0.6, ease: 'expo.inOut' }, 1.15);

    // Hard cap.
    const cap = window.setTimeout(release, 1800);

    return () => {
      window.clearTimeout(retry);
      window.clearTimeout(cap);
      tl.kill();
      document.documentElement.style.overflow = prevOverflow;
      window.__lenis?.start();
    };
  }, [show]);

  if (!show) return null;

  return createPortal(
    <div aria-hidden="true" className="fixed inset-0 z-[300]" ref={rootRef}>
      <div className="absolute inset-x-0 top-0 h-1/2 bg-canvas" ref={topRef} />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-canvas" ref={botRef} />
      <div className="absolute inset-0 flex flex-col justify-between px-[var(--gutter)] py-8" ref={metaRef}>
        <p className="label flex items-center gap-3 text-textMuted">
          <span className="live-dot" /> Loading the queue
        </p>
        <div>
          <p className="font-display text-[clamp(3rem,11vw,10rem)] font-medium leading-none tracking-[-0.05em] tabular-nums text-textPrimary">
            <span ref={numRef}>000,000</span>
          </p>
          <div className="mt-6 h-px w-full bg-surfaceBorder">
            <span
              className="block h-px origin-left scale-x-0 bg-accent"
              ref={barRef}
            />
          </div>
          <p className="label mt-3 flex justify-between text-textMuted">
            <span>Attorney leads sourced</span>
            <span>094,363</span>
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
