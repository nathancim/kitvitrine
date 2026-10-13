/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  theme: {
    extend: {
      colors: {
        lait: '#FDFAF4',
        farine: '#F3EADB',
        sarrasin: { DEFAULT: '#3A2418', light: '#6B4A35' },
        rouge: { DEFAULT: '#B5302A', deep: '#8E2420' },
        beurre: '#E9B949',
        galette: '#C98A4B',
        encre: '#2B1D15',
      },
      fontFamily: {
        display: ['Corben', 'Georgia', 'serif'],
        sans: ['Karla', 'system-ui', 'sans-serif'],
      },
    },
  },
};
