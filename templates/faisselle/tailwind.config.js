/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: {
    ardoise: 'Couleur principale (bleu cendré)',
    foin: 'Couleur d\'accent (foin)',
    luzerne: 'Couleur douce (prairie)',
    brume: 'Fond des sections',
    lait: 'Fond de page',
    encre: 'Texte',
  },
  theme: {
    extend: {
      colors: {
        lait: '#F5F7F1',
        brume: '#E3EAF1',
        ardoise: { DEFAULT: '#2F4F7F', fonce: '#213A5E' },
        foin: { DEFAULT: '#E8B64C', pale: '#F6E3B4' },
        luzerne: { DEFAULT: '#B7CCAB', pale: '#DDE8D5' },
        encre: '#1F2B3A',
      },
      fontFamily: {
        display: ['Caprasimo', 'Georgia', 'serif'],
        sans: ['Mulish', 'system-ui', 'sans-serif'],
      },
    },
  },
};
