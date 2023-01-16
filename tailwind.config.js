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
      spacing: {
        '4p': '2px',
      },
      borderRadius: {
        '16xl': '64px',
        '10xl': '40px',
        '8xl': '40px 40px 0px 0px',
      },
      borderWidth: {
        1: '1px',
        4: '4px',
      },
      colors: {
        primary: '#13053D',
        secondary: '#7E18FF',
        terciary: '#FFB01D',
        blueBackground: '#97B1FA',
        contentBackground: '#e8eeffff',
        footer: '#212134',
        backpackConnectBackground: '#D2CDFF',
        charcoal: '#1F1F1F',

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
