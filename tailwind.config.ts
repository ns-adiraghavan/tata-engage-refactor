import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        "tata-blue": "#003580",
        "tata-cyan": "#00b4d8",
        "tata-purple": "#7c3aed",
        "tata-gray": "#f8f9fa",
        "accent-navy": "#0D1B3E",
        "accent-yellow": "#F5C842",
        "accent-green": "#1A4731",
        "accent-purple": "#4C1D95",
      },
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"DM Serif Display"', "Georgia", "serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
