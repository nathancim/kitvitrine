/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: {
    signal: 'Couleur principale (voyant d\'enregistrement)',
    ambre: 'Couleur d\'accent (vumètres)',
    nuit: 'Fond de page',
    velours: 'Fond des cartes',
    creme: 'Texte',
    brume: 'Texte secondaire',
  },
  theme: {
    extend: {
      colors: {
        nuit: '#17111B',
        velours: { DEFAULT: '#241B2B', clair: '#33283C' },
        signal: '#EE4D8D',
        ambre: '#F4B860',
        creme: '#F5EEF3',
        brume: '#B3A6BA',
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
};
