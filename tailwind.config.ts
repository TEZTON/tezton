import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      "valentine",
      // {
      //   mytheme: {
      //     primary: "#00c9ff",
      //     secondary: "#00bdc0",
      //     accent: "#008eff",
      //     neutral: "#080f0f",
      //     "base-100": "#fcfcfc",
      //     info: "#00a3ff",
      //     success: "#00b784",
      //     warning: "#e57500",
      //     error: "#d20028",
      //   },
      // },
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
