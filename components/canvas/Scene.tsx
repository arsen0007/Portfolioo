'use client';

import { useEffect, useRef, useState } from 'react';
import { detectTier, prefersReducedMotion, stepDown } from '@/lib/gpu/tier';
import { useScene, type GpuTier } from '@/lib/store/scene';
import { createEngine, type Engine } from './ParticleEngine';
import { Poster } from './Poster';

type Mode = 'pending' | 'gl' | 'poster';

/**
 * The one persistent particle canvas. Fixed behind page content; reads intent
 * from the scene store. Falls back to a static poster for low tier, reduced
 * motion, missing WebGL2 or any initialisation failure.
 */
export default function Scene() {
  const [mode, setMode] = useState<Mode>('pending');
  const [tier, setLocalTier] = useState<'high' | 'mid'>('high');
  const forcedRef = useRef(false);

  // 1. resolve the tier once
  useEffect(() => {
    let cancelled = false;
    detectTier()
      .then(({ tier: t, forced }) => {
        if (cancelled) return;
        forcedRef.current = forced;
        useScene.getState().setTier(t);
        if (t === 'high' || t === 'mid') {
          setLocalTier(t);
          setMode('gl');
        } else {
          setMode('poster');
        }
      })
      .catch(() => {
        if (cancelled) return;
        useScene.getState().setTier('none');
        setMode('poster');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // reduced motion toggled at runtime
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => {
      if (mq.matches && !forcedRef.current) {
        useScene.getState().setTier('none');
        setMode('poster');
      }
    };
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  if (mode === 'poster') return <Poster />;
  if (mode === 'pending') return null;

  return (
    <GlCanvas
      key={tier}
      onFail={() => {
        useScene.getState().setTier('low');
        setMode('poster');
      }}
      onSlow={() => {
        const next: GpuTier = stepDown(tier);
        useScene.getState().setTier(next);
        if (next === 'mid') setLocalTier('mid');
        else setMode('poster');
      }}
      tier={tier}
    />
  );
}

function GlCanvas({
  tier,
  onFail,
  onSlow,
}: {
  tier: 'high' | 'mid';
  onFail: () => void;
  onSlow: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cbs = useRef({ onFail, onSlow });
  cbs.current = { onFail, onSlow };

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const params = new URLSearchParams(window.location.search);
    const forced = params.has('tier');
    if (prefersReducedMotion() && !forced) {
      cbs.current.onFail();
      return;
    }
    // A fresh canvas per engine: a disposed WebGL context can't be reused
    // (React strict mode mounts effects twice).
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.setAttribute('data-scene-canvas', '');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;display:block';
    host.appendChild(canvas);

    let cancelled = false;
    let engine: Engine | null = null;

    createEngine({
      canvas,
      tier,
      forced,
      onFail: () => cbs.current.onFail(),
      onSlow: () => cbs.current.onSlow(),
    })
      .then((e) => {
        if (cancelled) e.dispose();
        else engine = e;
      })
      .catch((err) => {
        console.warn('[scene] init failed, using poster', err);
        if (!cancelled) cbs.current.onFail();
      });

    return () => {
      cancelled = true;
      engine?.dispose();
      canvas.remove();
    };
  }, [tier]);

  return <div aria-hidden="true" ref={ref} />;
}
