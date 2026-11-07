import type { Config } from "tailwindcss";

/**
 * Colours reference CSS variables only. The values live in
 * styles/globals.css, the single source of truth for both themes.
 */
const themeColors = {
  canvas: "var(--canvas)",
  surface: "var(--surface)",
  surfaceRaised: "var(--surface-raised)",
  surfaceBorder: "var(--surface-border)",
  surfaceBorderStrong: "var(--surface-border-strong)",
  nodeSurface: "var(--node-surface)",

  accent: "var(--accent)",
  accentFg: "var(--accent-fg)",
  accentTint: "var(--accent-tint)",

  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",

  textPrimary: "var(--text-primary)",
  textSecondary: "var(--text-secondary)",
  textMuted: "var(--text-muted)",

  // Compatibility layer: pages not yet migrated still use these names.
  // Every hue resolves to the single accent. Removed with the last migration.
  blue: "var(--blue)",
  blueGlow: "var(--blue-glow)",
  blueDim: "var(--blue-dim)",
  green: "var(--green)",
  greenGlow: "var(--green-glow)",
  greenDim: "var(--green-dim)",
  cyan: "var(--cyan)",
  cyanGlow: "var(--cyan-glow)",
  cyanDim: "var(--cyan-dim)",
  amber: "var(--amber)",
  amberGlow: "var(--amber-glow)",
  amberDim: "var(--amber-dim)",
  purple: "var(--purple)",
  purpleGlow: "var(--purple-glow)",
  purpleDim: "var(--purple-dim)",
  gridLine: "var(--grid-line)",
  connectionLine: "var(--connection-line)",
  connectionActive: "var(--connection-active)",
};

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: themeColors,
      fontFamily: {
        display: ["var(--font-display)", "Newsreader", "Georgia", "serif"],
        body: ["var(--font-body)", "Instrument Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      /**
       * Fluid type scale. Named (not text-2xl etc.) so it does not change the
       * sizes of pages that have not been migrated yet. 12px is the floor;
       * body copy is 16px.
       */
      fontSize: {
        caption: ["0.75rem", { lineHeight: "1.5" }],
        small: ["0.875rem", { lineHeight: "1.55" }],
        lead: ["clamp(1.125rem, 1.05rem + 0.4vw, 1.25rem)", { lineHeight: "1.6" }],
        h3: ["clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem)", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        h2: ["clamp(1.75rem, 1.4rem + 1.6vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        h1: ["clamp(2.25rem, 1.6rem + 3vw, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        display: ["clamp(2.5rem, 1.5rem + 5vw, 5.5rem)", { lineHeight: "1", letterSpacing: "-0.025em" }],
      },
      borderRadius: {
        control: "6px",
        media: "12px",
        // Legacy names, kept until their last user is migrated.
        node: "12px",
        panel: "12px",
        tag: "6px",
      },
      boxShadow: {
        // No glows. Legacy keys stay defined as `none` so unmigrated pages
        // that still ask for shadow-blue etc. simply render flat.
        blue: "none",
        green: "none",
        cyan: "none",
        amber: "none",
        purple: "none",
        panel: "none",
      },
      keyframes: {
        "status-pulse": {
          "0%, 100%": { opacity: "0.45", transform: "scale(0.9)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
      },
      animation: {
        "status-pulse": "status-pulse 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
