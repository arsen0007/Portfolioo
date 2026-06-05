export const colors = {
  canvas: '#0a0a0f',
  surface: '#111118',
  surfaceRaised: '#16161f',
  surfaceBorder: '#1e1e2e',

  blue: '#4a7bff',
  blueGlow: '#4a7bff20',
  blueDim: '#1a2a4a',

  green: '#00d084',
  greenGlow: '#00d08420',
  greenDim: '#003d26',

  cyan: '#00b8d9',
  cyanGlow: '#00b8d920',
  cyanDim: '#003d4a',

  amber: '#f5a623',
  amberGlow: '#f5a62320',
  amberDim: '#3d2a00',

  purple: '#a78bfa',
  purpleGlow: '#a78bfa20',
  purpleDim: '#2a1a4a',

  textPrimary: '#f0f0f5',
  textSecondary: '#8b8fa8',
  textMuted: '#4a4a6a',

  gridLine: '#1a1a2e',
  connectionLine: '#2a2a3a',
  connectionActive: '#4a7bff',
} as const;

export const lightColors = {
  canvas: '#f7f8fb',
  surface: '#ffffff',
  surfaceRaised: '#f1f4f8',
  surfaceBorder: '#d9e1ec',
  surfaceBorderStrong: '#c2cede',

  blue: '#315dff',
  blueGlow: '#315dff15',
  blueDim: '#e8eeff',

  green: '#008f5d',
  greenGlow: '#008f5d15',
  greenDim: '#e6f5ef',

  cyan: '#008fb3',
  cyanGlow: '#008fb315',
  cyanDim: '#e6f4f8',

  amber: '#b87500',
  amberGlow: '#b8750015',
  amberDim: '#fdf3e3',

  purple: '#7c5cff',
  purpleGlow: '#7c5cff15',
  purpleDim: '#f0ecff',

  textPrimary: '#111827',
  textSecondary: '#526071',
  textMuted: '#8a95a6',

  gridLine: '#d8deea',
  connectionLine: '#c2cede',
  connectionActive: '#315dff',
} as const;

export const themeColors = {
  canvas: 'var(--canvas)',
  surface: 'var(--surface)',
  surfaceRaised: 'var(--surface-raised)',
  surfaceBorder: 'var(--surface-border)',
  surfaceBorderStrong: 'var(--surface-border-strong)',
  nodeSurface: 'var(--node-surface)',

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

  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textMuted: 'var(--text-muted)',

  gridLine: 'var(--grid-line)',
  connectionLine: 'var(--connection-line)',
  connectionActive: 'var(--connection-active)',
} as const;

export function colorMix(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

export type ColorToken = keyof typeof colors;
export type AccentColor = 'blue' | 'green' | 'cyan' | 'amber' | 'purple';
