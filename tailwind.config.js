/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        darkgreen: "#174143",
        peach: "#F9B487",
      },
      borderRadius: {
        'xl-2': '1.25rem',
      }
    },
  },
  plugins: [],
};
