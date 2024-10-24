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
        primYellow: '#F9DE06'
      }
    },
  },
  plugins: [],
}
