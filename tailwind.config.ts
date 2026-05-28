import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#faf7ff",
          100: "#f3ebff",
          200: "#e7d8ff",
          300: "#d8bcff",
          400: "#c39aff",
          500: "#ab75ff",
          600: "#9556f0",
          700: "#7f43d1",
          800: "#6838aa",
          900: "#55338a"
        },
        pine: {
          50: "#f7f3ff",
          100: "#efe6ff",
          200: "#deccff",
          300: "#c9a8ff",
          400: "#b380ff",
          500: "#9d5cff",
          600: "#8948eb",
          700: "#7239c6",
          800: "#5f33a1",
          900: "#4e2d83"
        },
        ember: {
          50: "#f8f3ff",
          100: "#f0e5ff",
          200: "#e1cbff",
          300: "#cfa6ff",
          400: "#ba7dff",
          500: "#a45cf9",
          600: "#8e43de",
          700: "#7433b6",
          800: "#5f2f92",
          900: "#4f2c76"
        },
        ink: {
          50: "#f7f5fb",
          100: "#ede8f4",
          200: "#ddd4ea",
          300: "#c4b7d9",
          400: "#a58fbe",
          500: "#856f9f",
          600: "#6d5a82",
          700: "#584968",
          800: "#3b3046",
          900: "#261f2d"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
} satisfies Config;

