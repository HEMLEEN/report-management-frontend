/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#6C4CF1",
        ink: "#151528",
        muted: "#7B7B91",
        surface: "#F7F7FB",
      },
      boxShadow: { soft: "0 10px 30px rgba(31,31,58,.08)" },
    },
  },
  plugins: [],
};
