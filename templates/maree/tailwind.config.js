/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: { houle: 'Couleur principale', lichen: 'Couleur d\'accent', ecume: 'Fond de page', brume: 'Fond des sections douces', nuit: 'Texte et sections sombres' },
  theme: {
    extend: {
      colors: {
        ecume: '#F1F4F6',
        brume: '#D7E1EA',
        houle: { DEFAULT: '#2F5D8C', clair: '#7FA3C6' },
        nuit: { DEFAULT: '#15233D', deep: '#0E1830' },
        lichen: '#CBD38A',
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
};
