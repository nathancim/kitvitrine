/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: {
    miel: 'Couleur principale (miel)',
    lavande: 'Couleur d\'accent (tampons, liens)',
    cire: 'Couleur douce (surlignages)',
    kraft: 'Fond des étiquettes',
    papier: 'Fond de page',
    brou: 'Texte',
  },
  theme: {
    extend: {
      colors: {
        papier: '#F5EBD5',
        kraft: '#DEC59A',
        miel: '#D08A17',
        cire: '#F6D27C',
        lavande: '#64579E',
        brou: '#3A2513',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Work Sans"', 'system-ui', 'sans-serif'],
        main: ['Caveat', '"Segoe Print"', 'cursive'],
      },
    },
  },
};
