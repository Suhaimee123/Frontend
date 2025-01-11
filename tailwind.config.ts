import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        text: 'var(--text-color)',
        background: 'var(--background-color)',
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to bottom, transparent, rgb(var(--background-end-rgb)) rgb(var(--background-start-rgb)))',
      },
    },
  },
  plugins: [],
};
export default config;
