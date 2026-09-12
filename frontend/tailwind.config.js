/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0B3C5D",
          teal: "#1D7874",
          saffron: "#FF9933",
          green: "#138808",
          cream: "#FFF8F0",
        },
      },
    },
  },
  plugins: [],
};

