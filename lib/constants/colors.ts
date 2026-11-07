/**
 * Colour references. The actual values live in styles/globals.css (the single
 * source of truth for both themes) — nothing here holds a hex value.
 *
 * COMPATIBILITY: the site is moving from five hues to one accent. Pages that
 * have not been rebuilt yet still pick a hue by name; every hue name now
 * resolves to the accent via CSS variables. `colorMix`, `AccentColor` and the
 * five hue names are removed once the last page is migrated.
 */
export const themeColors = {
  canvas: 'var(--canvas)',
  surface: 'var(--surface)',
  surfaceRaised: 'var(--surface-raised)',
  surfaceBorder: 'var(--surface-border)',
  surfaceBorderStrong: 'var(--surface-border-strong)',
  nodeSurface: 'var(--node-surface)',

  accent: 'var(--accent)',
  accentFg: 'var(--accent-fg)',

  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',

  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textMuted: 'var(--text-muted)',

  // Legacy hue names: all resolve to the accent.
  blue: 'var(--blue)',
  blueGlow: 'var(--blue-glow)',
  blueDim: 'var(--blue-dim)',

  green: 'var(--green)',
  greenGlow: 'var(--green-glow)',
  greenDim: 'var(--green-dim)',

  cyan: 'var(--cyan)',
  cyanGlow: 'var(--cyan-glow)',
  cyanDim: 'var(--cyan-dim)',

  amber: 'var(--amber)',
  amberGlow: 'var(--amber-glow)',
  amberDim: 'var(--amber-dim)',

  purple: 'var(--purple)',
  purpleGlow: 'var(--purple-glow)',
  purpleDim: 'var(--purple-dim)',

  gridLine: 'var(--grid-line)',
  connectionLine: 'var(--connection-line)',
  connectionActive: 'var(--connection-active)',
} as const;

export function colorMix(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

export type AccentColor = 'blue' | 'green' | 'cyan' | 'amber' | 'purple';
