/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], // Ensure all relevant paths are included
  darkMode: 'class', // Ensure dark mode is set to 'class'
  theme: {
    extend: {
      skew: {
        '30': '30deg'
      },
      animation: {
        'shimmer': 'shimmer 2s infinite'
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' }
        }
      }
    },
  },
  plugins: [],
};
