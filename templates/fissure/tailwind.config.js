/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: {
    violet: 'Couleur principale',
    orange: 'Couleur d\'accent',
    menthe: 'Couleur des prises',
    soleil: 'Couleur des étiquettes',
    craie: 'Fond de page',
    encre: 'Texte et bordures',
  },
  theme: {
    extend: {
      colors: {
        craie: '#F6F4FB',
        encre: '#1B1530',
        violet: { DEFAULT: '#6C4CF0', pale: '#E4DDFF' },
        orange: '#FF7F3F',
        menthe: '#6FE0C0',
        soleil: '#FFD23F',
      },
      fontFamily: {
        display: ['Unbounded', 'Arial Black', 'sans-serif'],
        sans: ['"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
