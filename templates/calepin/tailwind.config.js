/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: {
    cobalt: 'Couleur principale',
    moutarde: 'Couleur d\'accent',
    celadon: 'Couleur douce',
    faience: 'Fond des tuiles',
    joint: 'Fond de page (les joints)',
    nuit: 'Texte',
  },
  theme: {
    extend: {
      colors: {
        cobalt: { DEFAULT: '#2350A0', deep: '#183B7A' },
        moutarde: '#E0A93B',
        celadon: '#A9D2C6',
        faience: '#FBFBF8',
        joint: '#D5D7D1',
        nuit: '#13203A',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Geologica', 'system-ui', 'sans-serif'],
      },
      borderRadius: { tuile: '1.25rem' },
    },
  },
};
