/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: {
    glycine: 'Couleur principale (violet glycine)',
    citron: "Couleur d'accent (jaune citron)",
    corail: 'Accent chaud (rose corail)',
    menthe: 'Accent frais (vert menthe)',
    lilas: 'Fond des sections',
    papier: 'Fond de page',
    encre: 'Texte et sections foncées',
  },
  theme: {
    extend: {
      colors: {
        papier: '#FBF8FF',
        lilas: '#ECE5FF',
        encre: '#21163A',
        glycine: { DEFAULT: '#5A3CC2', fonce: '#43299E' },
        citron: '#FFD23F',
        corail: '#F2668B',
        menthe: '#3DB394',
      },
      fontFamily: {
        display: ['"Abril Fatface"', 'Georgia', 'serif'],
        sans: ['Literata', 'Georgia', 'serif'],
      },
    },
  },
};
