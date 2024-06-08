/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
    colors: {
      main: "#FF6300",
      white: "#ffffff",
      black: "#000000",
      green: "#28AF00",
      red: "#CD1C00",
      gray: "#EEEEEE",
      yellow: "#FFFB00",
    },
  },
  plugins: [],
};
