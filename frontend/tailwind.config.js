/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
      },
      colors: {
        maroon: {
          700: '#a50000',
          800: '#8E0000',
          900: '#770000',
        },
      },
    },
  },
  plugins: [],
}
