'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { loaderWillRun } from '@/lib/loader';

// three.js never ships in the first-paint bundle: loaded after idle.
const Scene = dynamic(() => import('./Scene'), { ssr: false });

/**
 * Mounted once in the root layout. Waits for the page to be idle, then
 * loads the WebGL scene. The canvas is decorative (aria-hidden); every
 * meaningful thing it shows also exists in the DOM.
 */
export function SceneRoot() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    // The intro loader is the warm-up window: start the engine at once so it
    // compiles, probes and pre-builds shapes behind it.
    if (loaderWillRun()) {
      setLoad(true);
      return;
    }
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) {
      w.requestIdleCallback(() => setLoad(true), { timeout: 1200 });
    } else {
      window.setTimeout(() => setLoad(true), 300);
    }
  }, []);

  return load ? <Scene /> : null;
}
