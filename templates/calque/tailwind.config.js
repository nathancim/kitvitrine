/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: { stencil: 'Couleur principale (violet calque)', peau: 'Couleur d\'accent (étiquettes, adhésif)', encre: 'Texte et traits', calque: 'Fond des sections', papier: 'Fond de page' },
  theme: {
    extend: {
      colors: {
        stencil: '#5A3BA6',
        peau: '#E7C3B3',
        encre: '#1D1B24',
        calque: '#E9E7F0',
        papier: '#F8F7FA',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        main: ['"Reenie Beanie"', '"Segoe Print"', 'cursive'],
      },
    },
  },
};
