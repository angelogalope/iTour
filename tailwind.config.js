/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primGreen: '#013300',
        primYellow: '#F9DE06',
        primWhite: '#F3F3F3',
        secGreen: '#277413',
        primGrey: '#D7D7D7'
      }
    },
  },
  plugins: [],
}
