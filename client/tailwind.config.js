/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#ff6600",
          "primary-content": "#ffffff",
          "secondary": "#1a1a2e",
          "secondary-content": "#ffffff",
          "accent": "#ff6600",
          "accent-content": "#ffffff",
          "neutral": "#1a1a2e",
          "neutral-content": "#ffffff",
          "base-100": "#0d0d1a",
          "base-200": "#111128",
          "base-300": "#1a1a2e",
          "base-content": "#ffffff",
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
}