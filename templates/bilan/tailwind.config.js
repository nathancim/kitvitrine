/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: { encre: 'Texte et aplats', jaune: 'Couleur d\'accent', gris: 'Texte secondaire', filet: 'Lignes de la grille', papier: 'Fond de page', calque: 'Fond des sections' },
  theme: {
    extend: {
      colors: {
        papier: '#F7F7F5',
        calque: '#ECECE8',
        filet: '#D3D3CD',
        encre: { DEFAULT: '#17191E', doux: '#2A2D34' },
        gris: '#5A5D66',
        jaune: { DEFAULT: '#F2C230', vif: '#FFD43B' },
      },
      fontFamily: {
        sans: ['"Schibsted Grotesk"', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
};
