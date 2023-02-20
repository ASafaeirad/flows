/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        'bg-800': '#212025',
        'bg-700': '#27262C',
      },
    },
  },
  plugins: [],
};
