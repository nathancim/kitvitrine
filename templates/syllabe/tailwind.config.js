/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: {
    marge: 'Couleur principale (marge rouge)',
    encre: 'Encre (texte et titres)',
    fluo: 'Surligneur',
    ligne: 'Lignes du cahier',
    calque: 'Fond des sections',
    papier: 'Fond de page',
  },
  theme: {
    extend: {
      colors: {
        papier: '#FBF9F3',
        calque: '#ECF1F8',
        ligne: '#A7BEE2',
        encre: { DEFAULT: '#1C2A5E', fonce: '#121C42' },
        marge: { DEFAULT: '#C9352C', fonce: '#A12820' },
        fluo: '#F5DC4B',
      },
      fontFamily: {
        // Lexend : conçue pour faciliter la lecture. Atkinson Hyperlegible : lettres très distinctes.
        display: ['Lexend', 'system-ui', 'sans-serif'],
        sans: ['"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
        // Cursive scolaire française, pour les annotations à la main
        main: ['"Playwrite FR Moderne"', 'cursive'],
      },
    },
  },
};
