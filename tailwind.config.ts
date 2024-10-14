import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(slider).js",
  ],
  theme: {
    extend: {
      colors: {
        "color-pallet-01": "rgb(229, 214, 211)",
        "color-pallet-02": "rgb(229, 196, 189)",
        "color-pallet-03": "rgb(229, 180, 167)",
        "color-pallet-04": "rgb(217, 155, 141)",
        "color-pallet-05": "rgb(204, 135, 120)",
        "color-pallet-06": "rgb(189, 117, 101)",
        "text-color-dark-green": "rgb(70, 69, 39)",
        "bg-black-transparent": "rgba(0, 0, 0, 0.5)",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
