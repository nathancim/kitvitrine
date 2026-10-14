/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: { prune: 'Couleur principale', rose: 'Couleur d\'accent', tige: 'Vert feuillage', poudre: 'Fond des sections', papier: 'Fond de page' },
  theme: {
    extend: {
      colors: {
        papier: '#FBF5F3',
        poudre: '#F2D9DE',
        prune: { DEFAULT: '#3A1D2C', deep: '#2A1420' },
        rose: { DEFAULT: '#B9476F', deep: '#9A3459', clair: '#E08AA6' },
        tige: '#5E7458',
      },
      fontFamily: {
        display: ['Gloock', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
