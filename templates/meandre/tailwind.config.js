/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: {
    riviere: 'Couleur principale (rivière)',
    soleil: "Couleur d'accent (soleil)",
    brique: 'Couleur du couchant',
    creme: 'Fond de page',
    sable: 'Fond des sections',
    nuit: 'Texte',
  },
  theme: {
    extend: {
      colors: {
        riviere: { DEFAULT: '#1D5C70', fonce: '#14414F' },
        soleil: '#F2A33A',
        brique: '#D9572B',
        creme: '#FBF1DC',
        sable: '#F3DFB6',
        nuit: '#173038',
      },
      fontFamily: {
        display: ['Shrikhand', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
