/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

const config: Config = {
  // Files Tailwind should scan for class names
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official Leo Club colors
        "leo-purple": "#551A8B",
        "leo-gold": "#FDB813",
      },
    },
  },
  plugins: [],
};

export default config;
