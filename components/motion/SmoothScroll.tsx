'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { gsap, motionAllowed, ScrollTrigger } from '@/lib/motion/gsap';
import { useScene } from '@/lib/store/scene';

/**
 * Lenis smooth scroll, driven by the GSAP ticker so ScrollTrigger, Lenis and
 * the WebGL scene all share one frame loop. Runs on native scroll (keyboard,
 * anchors, sticky and find-in-page keep working). Touch devices keep native
 * momentum. Disabled entirely under reduced motion.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (!motionAllowed()) return;

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, syncTouch: false });
    window.__lenis = lenis;

    lenis.on('scroll', (instance: Lenis) => {
      ScrollTrigger.update();
      useScene.getState().setScroll(instance.scroll, instance.velocity);
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // New route: start at the top, recompute triggers once layout settles.
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}
