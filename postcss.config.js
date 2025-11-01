module.exports = {
  plugins: {
    // For Next.js 16 / Turbopack the PostCSS plugin moved to @tailwindcss/postcss
    // Install @tailwindcss/postcss and use it here to avoid the runtime error.
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
