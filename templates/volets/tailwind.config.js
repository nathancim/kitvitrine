/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: { volet: 'Couleur principale (volets)', mousse: 'Couleur d\'accent', miel: 'Couleur lumière', lin: 'Fond du mur et des sections', craie: 'Fond de page', ardoise: 'Texte' },
  theme: {
    extend: {
      colors: {
        craie: '#F6F5F1',
        lin: '#E5E2D9',
        volet: { DEFAULT: '#2F5878', fonce: '#203F57' },
        ardoise: '#1F2830',
        mousse: '#5F7140',
        miel: '#D9A23F',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Albert Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
