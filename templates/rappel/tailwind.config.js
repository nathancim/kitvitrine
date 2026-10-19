/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: {
    tomate: 'Couleur principale',
    ciel: 'Couleur d\'accent',
    balle: 'Couleur des pastilles',
    nuage: 'Fond de page',
    encre: 'Texte et bordures',
  },
  theme: {
    extend: {
      colors: {
        nuage: '#E8F0F7',
        encre: '#151515',
        tomate: { DEFAULT: '#EE4B2B', pale: '#FFD9CF' },
        ciel: '#8FC3EE',
        balle: '#DDEB4F',
      },
      fontFamily: {
        display: ['"Bowlby One"', 'Impact', 'Arial Black', 'sans-serif'],
        sans: ['"Familjen Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
