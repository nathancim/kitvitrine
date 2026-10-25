/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: {
    soleil: 'Couleur principale',
    braise: 'Couleur d\'accent',
    encre: 'Texte et aplats sombres',
    craie: 'Fond de page',
    papier: 'Fond des sections',
  },
  theme: {
    extend: {
      colors: {
        soleil: '#FFD400',
        braise: '#FF4A1C',
        encre: '#141414',
        craie: '#F7F4EC',
        papier: '#ECE5D3',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'Impact', 'Arial Narrow', 'sans-serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
