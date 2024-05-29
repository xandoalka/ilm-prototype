/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "ilm-orange": "#f78e0c",
        "ilm-black": "#0c0a09",
      },
      screens: {
        "xs": "380px",
      },
    },
  },
  plugins: [],
};
