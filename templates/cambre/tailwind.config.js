/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: { rose: 'Couleur principale', citron: 'Couleur d\'accent', encre: 'Texte et aplats sombres', poudre: 'Fond rosé des sections', papier: 'Fond de page' },
  theme: {
    extend: {
      colors: {
        rose: '#C8286A',
        citron: '#DDF04C',
        encre: '#18131B',
        poudre: '#F6D9E3',
        papier: '#F5EFE6',
      },
      fontFamily: {
        display: ['Anton', 'Impact', '"Arial Narrow"', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
