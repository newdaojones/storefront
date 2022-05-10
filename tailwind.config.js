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
      borderRadius: {
        '16xl': '64px',
        '10xl': '40px',
      },
      borderWidth: {
        1: '1px',
      },
      colors: {
        primary: '#13053D',
        secondary: '#FFB01D',
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
