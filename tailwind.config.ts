import type { Config } from "tailwindcss";

const themeColors = {
  canvas: "var(--canvas)",
  surface: "var(--surface)",
  surfaceRaised: "var(--surface-raised)",
  surfaceBorder: "var(--surface-border)",
  surfaceBorderStrong: "var(--surface-border-strong)",
  nodeSurface: "var(--node-surface)",

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

  textPrimary: "var(--text-primary)",
  textSecondary: "var(--text-secondary)",
  textMuted: "var(--text-muted)",

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
        display: ["var(--font-display)", "Syne", "sans-serif"],
        body: ["var(--font-body)", "Instrument Sans", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        node: "12px",
        panel: "16px",
        tag: "6px",
      },
      boxShadow: {
        blue: "0 0 20px var(--blue-glow)",
        green: "0 0 20px var(--green-glow)",
        cyan: "0 0 20px var(--cyan-glow)",
        amber: "0 0 20px var(--amber-glow)",
        purple: "0 0 20px var(--purple-glow)",
        panel: "var(--panel-shadow-strong)",
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
