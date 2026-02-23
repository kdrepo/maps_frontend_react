/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a1a",
        mist: "#fff1e6",
        sand: "#fef5f0",
        ember: "#e87722",
        orangeDark: "#d4621a",
        orangeLight: "#ff9a3d",
        warmBlack: "#1a1410",
      },
      boxShadow: {
        soft: "0 10px 30px -20px rgba(15, 23, 42, 0.4)",
      },
      fontFamily: {
        display: ["\"Space Grotesk\"", "sans-serif"],
        body: ["\"Work Sans\"", "sans-serif"],
      },
    },
  },
  plugins: [],
};
