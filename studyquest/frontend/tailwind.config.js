/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cinzel'", "serif"],
        body: ["'Rajdhani'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        quest: {
          bg: "#0e0f14",        // levemente mais claro que #0a0b0f
          card: "#1a1d26",      // era #111318 — mais visível
          border: "#2e3347",    // era #1e2130 — borda bem mais visível
          gold: "#f5c842",
          "gold-dim": "#c9971f",
          amber: "#ff9f1c",
          purple: "#a78bfa",    // era #8b5cf6 — mais claro/vibrante
          "purple-dim": "#7c3aed",
          blue: "#60a5fa",      // era #3b82f6 — mais claro
          green: "#4ade80",     // era #22c55e — mais brilhante
          red: "#f87171",       // era #ef4444 — mais legível
          text: "#f1f5f9",      // era #e2e8f0 — quase branco
          muted: "#94a3b8",     // era #64748b — bem mais legível
        },
      },
      backgroundImage: {
        "quest-gradient": "linear-gradient(135deg, #0e0f14 0%, #131620 50%, #0e0f14 100%)",
        "gold-gradient": "linear-gradient(90deg, #f5c842, #ff9f1c)",
        "xp-gradient": "linear-gradient(90deg, #a78bfa, #60a5fa)",
        "card-glow": "linear-gradient(135deg, rgba(245,200,66,0.06) 0%, transparent 60%)",
      },
      boxShadow: {
        gold: "0 0 24px rgba(245,200,66,0.2), 0 0 48px rgba(245,200,66,0.07)",
        purple: "0 0 20px rgba(167,139,250,0.25)",
        card: "0 4px 24px rgba(0,0,0,0.5)",
      },
      animation: {
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "xp-fill": "xp-fill 1s ease-out forwards",
        "level-up": "level-up 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "slide-in": "slide-in 0.4s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
      },
      keyframes: {
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(245,200,66,0.1)" },
          "50%": { boxShadow: "0 0 25px rgba(245,200,66,0.35)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "xp-fill": {
          from: { width: "0%" },
          to: { width: "var(--xp-width)" },
        },
        "level-up": {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-in": {
          from: { transform: "translateY(12px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};