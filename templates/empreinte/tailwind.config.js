/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: { safran: 'Couleur principale', corail: 'Couleur d\'accent', encre: 'Texte et panneau sombre', ivoire: 'Fond de page', lin: 'Fond des sections', glace: 'Lumière du podoscope' },
  theme: {
    extend: {
      colors: {
        ivoire: '#F7F4EC',
        lin: '#ECE5D6',
        encre: { DEFAULT: '#18202E', douce: '#232D3F' },
        safran: '#E2A93B',
        corail: '#E0674B',
        glace: '#9CC3D8',
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['"Rethink Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
