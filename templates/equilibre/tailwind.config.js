/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: { forest: 'Couleur principale', ochre: 'Couleur d\'accent', sage: 'Couleur douce', sand: 'Fond des sections', bone: 'Fond de page' },
  theme: {
    extend: {
      colors: {
        bone: '#FBFAF7',
        sand: '#F1ECE2',
        forest: { DEFAULT: '#1F3A2E', deep: '#152A21' },
        sage: '#9BB09A',
        ochre: '#C08A3E',
      },
      fontFamily: {
        serif: ['"Young Serif"', 'Georgia', 'serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
    },
  },
};
