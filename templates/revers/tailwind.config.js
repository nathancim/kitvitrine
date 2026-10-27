/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: {
    gazon: 'Couleur principale (le court)',
    terre: 'Couleur d\'accent (terre battue)',
    foret: 'Sections sombres',
    ligne: 'Fond des sections claires',
    craie: 'Fond de page',
    encre: 'Texte',
  },
  theme: {
    extend: {
      colors: {
        gazon: '#2F6B4B',
        foret: '#173A29',
        terre: '#C4562C',
        ligne: '#E8E9E2',
        craie: '#F6F5F0',
        encre: '#111512',
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
};
