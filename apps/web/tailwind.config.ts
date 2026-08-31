import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        "surface-hover": "var(--color-surface-hover)",
        overlay: "var(--color-overlay)",
        "overlay-strong": "var(--color-overlay-strong)",
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
          subtle: "var(--color-text-subtle)",
        },
        gold: {
          DEFAULT: "var(--color-gold)",
          hover: "var(--color-gold-hover)",
          soft: "var(--color-gold-soft)",
          glow: "var(--color-gold-glow)",
        },
        "live-red": "#EF4444",
        success: "#10B981",
        warn: "#F59E0B",
        purple: "#A855F7",
        domain: {
          art: "#F472B6",
          musique: "#E8B26F",
          cinema: "#A855F7",
          mode: "#34D399",
          danse: "#22D3EE",
          litterature: "#FBBF24",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
      fontSize: {
        display: [
          "4.5rem",
          { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
        h1: [
          "3rem",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        h2: [
          "1.875rem",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        h3: ["1.25rem", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.5" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        eyebrow: [
          "0.75rem",
          { lineHeight: "1", letterSpacing: "0.18em", fontWeight: "600" },
        ],
      },
      boxShadow: {
        card: "var(--shadow-card)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
