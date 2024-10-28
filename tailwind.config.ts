import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      perspective: {
        "500": "500px",
        "1000": "1000px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        ".perspective-500": {
          perspective: "500px",
        },
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".rotate-x-30": {
          transform: "rotateX(30deg)",
        },
        ".rotate-x-45": {
          transform: "rotateX(45deg)",
        },
        ".rotate-y-30": {
          transform: "rotateY(30deg)",
        },
        ".rotate-y-45": {
          transform: "rotateY(45deg)",
        },
      });
    },
  ],
};
export default config;
