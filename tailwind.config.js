/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#f6df66', // Custom blue
          primaryHover: '#fdf2a3',
        }
      },
    },
  },
  plugins: [],
}

