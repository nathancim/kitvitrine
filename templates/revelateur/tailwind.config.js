/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: {
    eucalyptus: 'Couleur d\'accent',
    encre: 'Texte et bandes sombres',
    argent: 'Gris argentique',
    voile: 'Fond des sections',
    papier: 'Fond de page',
  },
  theme: {
    extend: {
      colors: {
        papier: '#F4F4F1',
        voile: '#E6E5E0',
        argent: { DEFAULT: '#A4A6A8', clair: '#CDCECC' },
        encre: { DEFAULT: '#1F2023', doux: '#4A4C50' },
        eucalyptus: { DEFAULT: '#56705E', pale: '#DCE4DC' },
      },
      fontFamily: {
        serif: ['"Bodoni Moda"', 'Didot', 'Georgia', 'serif'],
        sans: ['Jost', 'Futura', 'system-ui', 'sans-serif'],
      },
    },
  },
};
