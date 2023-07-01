/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.ejs', './views/partials/*.ejs'],
  theme: {
    fontFamily: {
      Inter: ['Inter', 'Arial', 'sans-serif'],
      Raleway: ['Raleway', 'sans-serif'],
      YsabeauSC: ['Ysabeau SC', 'sans-serif'],
    },
    extend: {
      colors: {
        'header-background': '#171717',
        'content-background': '#EDEDED',
        'logo-text': '#EDEDED',
        'title-text': '#DA0037',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
