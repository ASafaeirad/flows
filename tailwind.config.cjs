/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.tsx'],
  theme: {
    fontFamily: {
      mono: ['Inconsolata', 'monospace'],
    },
    extend: {
      colors: {
        accent: {
          0: '#f5b765',
          1: '#d19a67',
        },
        placeholder: 'rgb(255 255 255 / .2)',
        light: {
          0: '#ffffff',
          1: '#b3b3b3',
          muted: 'rgb(255 255 255 / .4)',
        },
        dark: {
          0: '#212025',
          1: '#27262C',
        },
        border: 'rgb(255 255 255 / .1)',
      },
    },
  },
  plugins: [],
};
