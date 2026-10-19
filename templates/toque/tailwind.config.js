/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: {
    bouteille: 'Couleur principale (vert bouteille)',
    betterave: "Couleur d'accent (betterave)",
    courge: 'Accent chaud (courge rôtie)',
    sauge: 'Fond des sections',
    papier: 'Fond de page',
    encre: 'Texte',
  },
  theme: {
    extend: {
      colors: {
        papier: '#F6F7F2',
        sauge: '#DCE3D4',
        encre: '#18221B',
        bouteille: { DEFAULT: '#2D4A37', deep: '#1E3326' },
        betterave: '#8F2747',
        courge: '#D9883A',
      },
      fontFamily: {
        display: ['"Gilda Display"', 'Georgia', 'serif'],
        sans: ['"Red Hat Text"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
