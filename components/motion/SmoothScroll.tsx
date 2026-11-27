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
    document.documentElement.classList.add('motion-js');

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

  // New route: start at the top, then recompute trigger positions as the
  // layout settles (pins inserted, fonts swapped, images decoded). Stale
  // positions are why a reveal could fire late or not at all.
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
    // First load: ScrollTrigger already refreshes on window load. Extra
    // refreshes there re-measure a long page several times on a slow phone
    // (each one forces layout of every trigger), so only route changes and
    // late-loading images schedule one here.
    const initial = !mountedOnce;
    mountedOnce = true;
    let alive = true;
    let queued = 0;
    // Debounced: a refresh measures every trigger, so batch the bursts.
    const refresh = () => {
      window.clearTimeout(queued);
      queued = window.setTimeout(() => {
        if (alive) ScrollTrigger.refresh();
      }, 200);
    };
    const ids = initial ? [] : [window.setTimeout(refresh, 0)];
    if (!initial && document.fonts?.status !== 'loaded') document.fonts?.ready.then(refresh);
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('#main-content img'));
    const onImg = () => refresh();
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', onImg, { once: true });
    });
    return () => {
      alive = false;
      window.clearTimeout(queued);
      ids.forEach(window.clearTimeout);
      imgs.forEach((img) => img.removeEventListener('load', onImg));
    };
  }, [pathname]);

  return null;
}

let mountedOnce = false;

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}
