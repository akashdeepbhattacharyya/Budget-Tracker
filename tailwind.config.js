module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.{html,ts}', // Add any other file paths that use Tailwind classes
  ],
  darkMode: 'class', // Optional: Enable dark mode
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
