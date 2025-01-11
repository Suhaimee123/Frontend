/** @type {import('tailwindcss').Config} */
const theme = require('./theme'); // Import values from theme.ts

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        text: theme.colors.text,
        background: theme.colors.background,
        border: theme.colors.border,
      },
      fontFamily: {
        body: theme.fonts.body,
        heading: theme.fonts.heading,
      },
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
