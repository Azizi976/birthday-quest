import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design system palette
        paper: "#F9F9F6",
        ink: {
          DEFAULT: "#2A2A28",
          soft: "#5B5A55",
          muted: "#8B8983",
          faint: "#B5B3AD",
          ghost: "#C7C5BF",
        },
        sage: {
          DEFAULT: "#79876B",
          dark: "#5E6B53",
        },
        edge: {
          DEFAULT: "#E6E4DF",
          light: "#D8D6D0",
        },
        hover: "#EDEFE9",
        // Legacy palette kept for vault/toast/achievements
        cream: {
          DEFAULT: "#F9F9F6",
          50: "#FAFAF8",
          100: "#F9F9F6",
          200: "#F0EFEB",
        },
        blush: {
          DEFAULT: "#FF7EB6",
          50: "#FFF0F6",
          100: "#FFE0EC",
          200: "#FFC2DA",
          300: "#FF9DC2",
          400: "#FF7EB6",
          500: "#FF5BA0",
          600: "#EC3A86",
          700: "#C72669",
        },
        grape: {
          DEFAULT: "#9B6BFF",
          50: "#F4EEFF",
          100: "#E9DCFF",
          200: "#D4BBFF",
          300: "#BC97FF",
          400: "#9B6BFF",
          500: "#7E45F0",
          600: "#6730D1",
          700: "#4E22A3",
        },
        gold: {
          DEFAULT: "#FFC857",
          100: "#FFF2D6",
          200: "#FFE3A3",
          300: "#FFD477",
          400: "#FFC857",
          500: "#F5AE2E",
        },
      },
      fontFamily: {
        sans: ["var(--font-app)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        node: "0 8px 0 0 rgba(0,0,0,0.12)",
        "node-press": "0 3px 0 0 rgba(0,0,0,0.12)",
        soft: "0 10px 40px -12px rgba(0,0,0,0.12)",
        glow: "0 0 30px rgba(121,135,107,0.4)",
        sheet: "0 -8px 40px -8px rgba(42,42,40,0.12)",
        card: "0 2px 6px -2px rgba(42,42,40,0.08), 0 12px 28px -12px rgba(42,42,40,0.10)",
      },
      keyframes: {
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "dash-flow": {
          to: { strokeDashoffset: "-16" },
        },
      },
      animation: {
        "float-y": "float-y 3s ease-in-out infinite",
        "fade-up": "fade-up .7s cubic-bezier(0.25,1,0.5,1) both",
        "dash-flow": "dash-flow 0.6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
