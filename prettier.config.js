module.exports = {
  printWidth: 100,
  tabWidth: 2,
  singleQuote: true,
  bracketSameLine: true,
  trailingComma: 'es5',
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindAttributes: ['className'],
  overrides: [
    {
      files: '*.{ts,tsx}',
      options: {
        parser: 'typescript',
        plugins: [], // Disable Tailwind plugin for TypeScript files to avoid parsing issues
      },
    },
    {
      files: '*.{js,jsx}',
      options: {
        plugins: [], // Disable Tailwind plugin for JavaScript files to avoid parsing issues
      },
    },
  ],
};
