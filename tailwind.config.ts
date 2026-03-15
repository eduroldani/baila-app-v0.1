import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arena: {
          50: "#fff7ec",
          100: "#ffe8c5",
          300: "#f7bf67",
          500: "#ef8f22",
          700: "#a85116",
          900: "#5f2a0b"
        },
        tinta: "#17120f"
      },
      boxShadow: {
        glow: "0 20px 70px rgba(239, 143, 34, 0.22)"
      }
    },
  },
  plugins: [],
};

export default config;
