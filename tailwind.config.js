/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.ejs'],
  theme: {
    fontFamily: {
      NavLinks: ['Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        'header-background': '#171717',
        'content-background': '#EDEDED',
        'logo-text': '#EDEDED',
      },
    },
  },
  plugins: [],
};
