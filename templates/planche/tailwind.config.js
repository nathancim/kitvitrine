/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: { poireau: 'Couleur principale (vert poireau)', radis: 'Couleur d\'accent (semaine en cours)', pousse: 'Fond des planches et des sections', encre: 'Texte et traits', papier: 'Fond de page' },
  theme: {
    extend: {
      colors: {
        poireau: '#2E6B3E',
        radis: '#D2414F',
        pousse: '#E3EBD6',
        encre: '#1A1E19',
        papier: '#F5F6F1',
      },
      fontFamily: {
        sans: ['Archivo', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
};
