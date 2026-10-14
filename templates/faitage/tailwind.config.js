/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: { ardoise: 'Couleur principale', signal: 'Couleur d\'accent', zinc: 'Gris secondaire', ciel: 'Fond de page' },
  theme: {
    extend: {
      colors: {
        ardoise: { DEFAULT: '#1E3448', deep: '#142433', soft: '#3E6B92' },
        zinc: { DEFAULT: '#B7C1C8', light: '#DCE3E8' },
        ciel: '#EEF2F4',
        signal: { DEFAULT: '#F4C430', deep: '#D9A817' },
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'Impact', 'sans-serif'],
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
