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
        // Official Lions International Leo Brand Colors
        "leo-yellow": "#EBB700",
        "leo-blue": "#407CCA",
        "leo-green": "#00AB68",
        "leo-gray": "#55565A",
      },
    },
  },
  plugins: [],
};

export default config;