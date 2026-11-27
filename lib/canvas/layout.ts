import type { SceneLayout } from '@/lib/store/scene';

export type LayoutTarget = {
  /** World-space x/y offset of the formation centre. */
  x: number;
  y: number;
  /** Uniform scale applied to shape space (shapes are ~2.4 x 4 units). */
  scale: number;
  /** Multiplier on field opacity. */
  fade: number;
};

const NOM_H = 1.2;
const NOM_W = 2.0;

/**
 * Resolve a layout into world-space placement for a viewport of
 * `viewW x viewH` world units. Below 768 css px every layout is centred
 * and fainter so overlaid text stays readable.
 */
export function resolveLayout(layout: SceneLayout, viewW: number, viewH: number, cssWidth: number): LayoutTarget {
  const mobile = cssWidth < 768;
  if (mobile) {
    const s = Math.min((0.62 * viewH) / 2 / NOM_H, (0.98 * viewW) / 2 / 1.45);
    return { x: 0, y: layout === 'top' ? viewH * 0.12 : layout === 'bottom' ? -viewH * 0.12 : 0, scale: s, fade: 0.55 };
  }
  const fit = (f: number, g: number) => Math.min((f * viewH) / 2 / NOM_H, (g * viewW) / 2 / NOM_W);
  switch (layout) {
    case 'right':
      return { x: viewW * 0.2, y: 0, scale: fit(0.8, 0.54), fade: 1 };
    case 'left':
      return { x: -viewW * 0.2, y: 0, scale: fit(0.8, 0.54), fade: 1 };
    case 'top':
      return { x: 0, y: viewH * 0.2, scale: fit(0.5, 0.7), fade: 0.9 };
    case 'bottom':
      return { x: 0, y: -viewH * 0.2, scale: fit(0.5, 0.7), fade: 0.9 };
    case 'center':
      return { x: 0, y: 0, scale: fit(0.92, 0.7), fade: 1 };
    case 'full':
    default:
      return { x: 0, y: 0, scale: fit(1.0, 1.0), fade: 1 };
  }
}
