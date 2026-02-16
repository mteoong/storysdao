import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        roblox: {
          red: "#E2231A",
          dark: "#191919",
          darker: "#121214",
          accent: "#FF4D4D",
          surface: "#232527",
          card: "#2C2E30",
          border: "#3B3D3F",
          green: "#00B06F",
          hover: "#393B3D",
        },
      },
    },
  },
  plugins: [],
};

export default config;
