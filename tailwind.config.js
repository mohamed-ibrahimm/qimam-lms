/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-app)",
        surface: "var(--bg-surface)",
        "surface-secondary": "var(--bg-surface-secondary)",
        "surface-raised": "var(--bg-surface-secondary)",
        "surface-card": "var(--bg-surface-card)",
        "surface-elevated": "var(--bg-surface-elevated)",
        border: "var(--border-subtle)",
        "border-light": "var(--border-subtle)",
        "text-primary": "var(--text-main)",
        "text-secondary": "var(--text-sub)",
        "text-muted": "var(--text-muted)",
        accent: {
          DEFAULT: "var(--accent-color)",
          strong: "var(--accent-strong-color)",
          soft: "var(--accent-soft-color)",
          dark: "var(--accent-dark-color)",
        },
        primary: {
          50: "#FAF7FA",
          100: "#EEE6F0",
          200: "#DFCDE3",
          300: "#CBAFCF",
          400: "#A77AB0",
          500: "#8E6098",
          600: "#76507F",
          700: "#604069",
          800: "#493050",
          900: "#322037",
        },
      },
      fontFamily: {
        arabic: ['"IBM Plex Sans Arabic"', 'var(--font-ibm-plex)', 'Cairo', 'sans-serif'],
        sans: ['"IBM Plex Sans Arabic"', 'var(--font-ibm-plex)', 'Cairo', 'sans-serif'],
        display: ['"IBM Plex Sans Arabic"', 'var(--font-ibm-plex)', 'Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
