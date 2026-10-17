/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: { sapin: 'Couleur principale (vert)', tampon: 'Encre du tampon (accent)', papier: 'Fond de page', calque: 'Fond des encadrés', encre: 'Texte' },
  theme: {
    extend: {
      colors: {
        sapin: { DEFAULT: '#24533F', fonce: '#183A2C' },
        tampon: '#3E46A3',
        papier: '#F3F4EF',
        calque: '#E3E8DF',
        encre: '#16231E',
      },
      fontFamily: {
        serif: ['Alegreya', 'Georgia', 'serif'],
        sans: ['"Alegreya Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
