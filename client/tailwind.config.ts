import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sfpro: "var(--font-1)",
      segoe: "var(--font-2)",
      geist: "var(--font-3)",
    },
    extend: {
      colors: {
        bg_main: "var(--bg-main)",
        bg_dark1: "var(--bg-dark1)",
        bg_dark2: "var(--bg-dark2)",
        bg_card1: "var(--bg-card1)",
        bg_card2: "var(--bg-card2)",
        bg_card3: "var(--bg-card-3)",
        font_main: "var(--font-main)",
        font_dark: "var(--font-dark)",
        font_light: "var(--font-light)",
        icon_1: "var(--icon-1)",
        icon_2: "var(--icon-2)",
        primary: "var(--primary)",
        chat: "var(--chat)",
        error: "var(--error)"
      },
    },
  },
  plugins: [],
};
export default config;
