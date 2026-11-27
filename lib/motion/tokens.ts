/**
 * Motion tokens. Every animation on the site draws from these so the whole
 * thing feels made by one hand. Mirrored as CSS variables in globals.css.
 */
export const ease = {
  /** Reveals, entrances. */
  out: 'expo.out',
  /** Page / scene transitions. */
  inOut: 'power3.inOut',
  /** Counters. */
  count: 'power2.out',
} as const;

export const dur = { xs: 0.25, sm: 0.5, md: 0.9, lg: 1.3, xl: 2 } as const;

export const stagger = { chars: 0.018, words: 0.04, lines: 0.08, items: 0.06 } as const;

/** Spring-ish lerp factors for pointer-following things. */
export const lerp = { cursor: 0.18, ring: 0.12, magnetic: 0.15 } as const;
