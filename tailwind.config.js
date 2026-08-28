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
        "surface-raised": "var(--bg-surface-raised)",
        "surface-card": "var(--bg-surface-card)",
        border: "var(--border-subtle)",
        "border-light": "var(--border-subtle)",
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        accent: {
          light: "#a855f7",
          DEFAULT: "#7c3aed",
          dark: "#6d28d9",
        }
      },
      fontFamily: {
        arabic: ['var(--font-tajawal)', 'Tajawal', 'IBM Plex Sans Arabic', 'sans-serif'],
        sans: ['var(--font-tajawal)', 'Tajawal', 'IBM Plex Sans Arabic', 'sans-serif'],
        display: ['var(--font-tajawal)', 'Tajawal', 'IBM Plex Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
