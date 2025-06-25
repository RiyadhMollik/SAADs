/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Fira Sans"', 'sans-serif'],
        nikos: ["'Nikos'", "sans-serif"],
      },
      fontWeight: {
        extralight: '200',
      },
    },
  },
  plugins: [
  ],
}