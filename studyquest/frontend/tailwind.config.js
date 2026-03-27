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
          bg: "#0a0b0f",
          card: "#111318",
          border: "#1e2130",
          gold: "#f5c842",
          "gold-dim": "#a8891e",
          amber: "#ff9f1c",
          purple: "#8b5cf6",
          "purple-dim": "#5b3fa0",
          blue: "#3b82f6",
          green: "#22c55e",
          red: "#ef4444",
          text: "#e2e8f0",
          muted: "#64748b",
        },
      },
      backgroundImage: {
        "quest-gradient": "linear-gradient(135deg, #0a0b0f 0%, #0f111a 50%, #0a0b0f 100%)",
        "gold-gradient": "linear-gradient(90deg, #f5c842, #ff9f1c)",
        "xp-gradient": "linear-gradient(90deg, #8b5cf6, #3b82f6)",
        "card-glow": "linear-gradient(135deg, rgba(245,200,66,0.05) 0%, transparent 60%)",
      },
      boxShadow: {
        gold: "0 0 20px rgba(245,200,66,0.15), 0 0 40px rgba(245,200,66,0.05)",
        purple: "0 0 20px rgba(139,92,246,0.2)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
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
          "50%": { boxShadow: "0 0 25px rgba(245,200,66,0.3)" },
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
