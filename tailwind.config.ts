import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "color-pallet-01": "rgb(229, 214, 211)",
        "color-pallet-02": "rgb(229, 196, 189)",
        "color-pallet-03": "rgb(229, 180, 167)",
        "color-pallet-04": "rgb(217, 155, 141)",
        "text-color-dark-green": "rgb(70, 69, 39)",
      },
    },
  },
  plugins: [],
};
export default config;
