import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Alpha-capable (so /opacity modifiers work): defined via RGB channels.
        // NB: the surface colour is named `night`, NOT `base` — `text-base` is a
        // Tailwind font-size utility, so a `base` colour silently hijacks it and
        // paints body text the background colour (invisible). Hence `night`.
        night: "rgb(var(--bg-rgb) / <alpha-value>)",
        fg: "rgb(var(--fg-rgb) / <alpha-value>)",
        muted: "rgb(var(--muted-rgb) / <alpha-value>)",
        pink: "rgb(var(--pink-rgb) / <alpha-value>)",
        cyan: "rgb(var(--cyan-rgb) / <alpha-value>)",
        gold: "rgb(var(--gold-rgb) / <alpha-value>)",
        purple: "rgb(var(--purple-rgb) / <alpha-value>)",
        neon: "rgb(var(--green-rgb) / <alpha-value>)",
        accent: "rgb(var(--pink-rgb) / <alpha-value>)",
        "accent-2": "rgb(var(--cyan-rgb) / <alpha-value>)",
        // Fixed values (no alpha modifier needed).
        "night-2": "var(--bg-2)",
        panel: "var(--panel)",
        "panel-strong": "var(--panel-strong)",
        line: "var(--line)",
        "accent-dim": "var(--accent-dim)",
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-grotesk)", "sans-serif"],
        grotesk: ["var(--font-grotesk)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        neon: "0 0 24px -6px var(--glow)",
        "neon-lg": "0 0 60px -12px var(--glow)",
      },
      animation: {
        blink: "blink 1.1s step-end infinite",
        flicker: "flicker 4.5s infinite",
        "float-y": "float-y 5s ease-in-out infinite",
        "pulse-led": "pulseLed 2.4s ease-in-out infinite",
        scan: "scan-line 7s linear infinite",
        marquee: "marquee 22s linear infinite",
      },
      keyframes: {
        blink: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0" } },
        pulseLed: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 8px var(--pink)" },
          "50%": { opacity: "0.4", boxShadow: "0 0 2px var(--pink)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
