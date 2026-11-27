'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// Register once, client-side only. Import gsap from here, never from 'gsap'
// directly, so plugins are always registered.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  // Mobile URL-bar show/hide resizes the viewport constantly; re-measuring
  // every trigger on each one causes scroll jank.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** True when the visitor has not asked for reduced motion. */
export function motionAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('motion-ok');
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
