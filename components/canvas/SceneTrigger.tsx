'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { ScrollTrigger } from '@/lib/motion/gsap';
import { useScene, type SceneIntent } from '@/lib/store/scene';

type SceneTriggerProps = Partial<SceneIntent> & {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  id?: string;
  /** Also stream 0..1 scroll progress through this element into the store. */
  scrub?: boolean;
};

/**
 * Wrap a section in this to direct the particle field while the section
 * crosses the middle of the viewport. Pure intent; renders a plain element.
 *
 *   <SceneTrigger as="section" shape="clusters" layout="right" signal={0.4}>…</SceneTrigger>
 */
export function SceneTrigger({
  as: Tag = 'div',
  children,
  className,
  id,
  layout,
  scrub = false,
  shape,
  signal,
  intensity,
  turbulence,
}: SceneTriggerProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const intent: Partial<SceneIntent> = {};
    if (shape !== undefined) intent.shape = shape;
    if (layout !== undefined) intent.layout = layout;
    if (signal !== undefined) intent.signal = signal;
    if (intensity !== undefined) intent.intensity = intensity;
    if (turbulence !== undefined) intent.turbulence = turbulence;

    const activate = () => useScene.getState().setIntent(intent);

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter: activate,
      onEnterBack: activate,
      onUpdate: scrub ? (self) => useScene.getState().setProgress(self.progress) : undefined,
    });

    // Already in view on mount (e.g. the hero): apply immediately.
    if (st.isActive) activate();

    return () => st.kill();
  }, [shape, layout, signal, intensity, turbulence, scrub]);

  return (
    <Tag className={className} id={id} ref={ref}>
      {children}
    </Tag>
  );
}

/** Set the field's intent for a whole page on mount (no scroll mapping). */
export function SceneIntentOnMount(props: Partial<SceneIntent>) {
  const { shape, layout, signal, intensity, turbulence } = props;
  useEffect(() => {
    const intent: Partial<SceneIntent> = {};
    if (shape !== undefined) intent.shape = shape;
    if (layout !== undefined) intent.layout = layout;
    if (signal !== undefined) intent.signal = signal;
    if (intensity !== undefined) intent.intensity = intensity;
    if (turbulence !== undefined) intent.turbulence = turbulence;
    useScene.getState().setIntent(intent);
  }, [shape, layout, signal, intensity, turbulence]);
  return null;
}
