/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: {
    voile: 'Couleur principale (la voile)',
    soleil: 'Couleur d\'accent',
    relief: 'Sections sombres',
    ciel: 'Fond des sections claires',
    brume: 'Fond de page',
    encre: 'Texte',
  },
  theme: {
    extend: {
      colors: {
        voile: '#D2462E',
        soleil: '#F0B43C',
        relief: '#1F3B33',
        ciel: '#D6E6EA',
        brume: '#F3F7F7',
        encre: '#15212A',
      },
      fontFamily: {
        display: ['Unbounded', 'Arial Black', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
