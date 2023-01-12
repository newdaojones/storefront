module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'righteous': ['Righteous', 'system-ui'],
        'montserrat': ['Montserrat', 'Georgia'],
        'mono': ['ui-monospace', 'SFMono-Regular'],
        'display': ['Oswald'],
        'body': ['Montserrat']
      },
      size: {
        'h30': '20px',
        'w-30': '30px',
      },
      borderRadius: {
        '16xl': '64px',
        '10xl': '40px',
        '8xl': '40px 40px 0px 0px',
      },
      borderWidth: {
        1: '1px',
      },
      colors: {
        primary: '#13053D',
        secondary: '#7E18FF',
        terciary: '#FFB01D',
        footer: '#212134',
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
