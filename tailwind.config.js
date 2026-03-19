/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef3e2",
          100: "#fde4b9",
          200: "#fcd48c",
          300: "#fbc35f",
          400: "#fab63d",
          500: "#f9a825",
          600: "#f49321",
          700: "#ed7b1c",
          800: "#e66418",
          900: "#db3f11",
        },
        dark: {
          50: "#f5f5f7",
          100: "#e8e8ed",
          200: "#d1d1d9",
          300: "#aaaab4",
          400: "#7c7c87",
          500: "#61616b",
          600: "#4a4a52",
          700: "#3a3a42",
          800: "#2a2a30",
          900: "#1a1a1e",
          950: "#0f0f12",
        },
      },
      fontFamily: {
        display: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        body: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
