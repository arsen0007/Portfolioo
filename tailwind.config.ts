import type { Config } from "tailwindcss";

/**
 * SIGNAL design system. Colours reference CSS variables only; the values
 * live in styles/globals.css, the single source of truth for both themes.
 */
const themeColors = {
  canvas: "var(--canvas)",
  surface: "var(--surface)",
  surfaceRaised: "var(--surface-raised)",
  surfaceBorder: "var(--surface-border)",
  surfaceBorderStrong: "var(--surface-border-strong)",

  accent: "var(--accent)",
  accentFg: "var(--accent-fg)",
  accentTint: "var(--accent-tint)",
  signal: "var(--signal)",
  signalGlow: "var(--signal-glow)",

  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",

  textPrimary: "var(--text-primary)",
  textSecondary: "var(--text-secondary)",
  textMuted: "var(--text-muted)",
  connectionLine: "var(--surface-border-strong)",
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
        // Geist carries display and body; Instrument Serif italic is the human
        // accent (one or two words per headline); Geist Mono is the system voice.
        display: ["var(--font-body)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      /**
       * Fluid type scale. Display sizes are set tight (negative tracking,
       * sub-1 line height) the way large grotesk wants to be set.
       */
      fontSize: {
        caption: ["0.75rem", { lineHeight: "1.5" }],
        small: ["0.875rem", { lineHeight: "1.55" }],
        lead: ["clamp(1.125rem, 1.02rem + 0.45vw, 1.375rem)", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        h3: ["clamp(1.375rem, 1.15rem + 0.9vw, 1.875rem)", { lineHeight: "1.18", letterSpacing: "-0.02em" }],
        h2: ["clamp(2rem, 1.35rem + 2.6vw, 3.75rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        h1: ["clamp(2.6rem, 1.5rem + 4.4vw, 5.75rem)", { lineHeight: "0.96", letterSpacing: "-0.042em" }],
        display: ["clamp(3rem, 1.2rem + 7.2vw, 8.5rem)", { lineHeight: "0.9", letterSpacing: "-0.05em" }],
        mega: ["clamp(3.75rem, 0.8rem + 12vw, 15rem)", { lineHeight: "0.84", letterSpacing: "-0.06em" }],
      },
      borderRadius: {
        control: "999px",
        media: "10px",
      },
      maxWidth: {
        page: "90rem",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
