const { colors } = require('./constant/colors.js');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './component/**/*.{js,jsx,ts,tsx}',
    './utils/**/*.{js,jsx,ts,tsx}',
    './constant/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // fontSize: {
      //   sm: `${baseFontSizes.sm}px`,
      //   md: `${baseFontSizes.md}px`,
      //   lg: `${baseFontSizes.lg}px`,
      //   xl: `${baseFontSizes.xl}px`,
      //   '2xl': `${baseFontSizes['2xl']}px`,
      //   '3xl': `${baseFontSizes['3xl']}px`,
      //   '4xl': `${baseFontSizes['4xl']}px`,
      // },
      colors,
    },
  },
  plugins: [],
};
