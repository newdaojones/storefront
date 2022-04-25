module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      borderRadius: {
        '16xl': '64px',
        '10xl': '40px',
      },
      borderWidth: {
        1: '1px',
      },
      colors: {
        primary: '#13053D',
        secondary: '#FF00C7',
      },
      boxShadow: {
        primary: '0px 1px 20px #FF00C7',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
