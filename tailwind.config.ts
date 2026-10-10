/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "leo-blue": "#407CCA",
        "leo-yellow": "#EBB700",
        "leo-green": "#00AB68",
        "leo-gray": "#55565A",
      },
    },
  },
  plugins: [],
};

export default config;