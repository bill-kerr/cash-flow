module.exports = {
  purge: [],
  theme: {
    extend: {
      fontFamily: {
        display: ['Barlow'],
      },
      screens: {
        xs: '480px',
      },
      animation: {
        rise: 'translate3d(0,15%,0) 0.2s linear',
      },
    },
  },
  variants: {
    boxShadow: ['responsive', 'hover', 'focus', 'focus-within'],
  },
  plugins: [],
};
