/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: { cuivre: 'Couleur principale (cuivre)', arc: 'Couleur d\'accent (lumière)', nuit: 'Fond de page', ardoise: 'Fond des cartes', craie: 'Texte', brume: 'Texte secondaire' },
  theme: {
    extend: {
      colors: {
        nuit: '#10151F',
        ardoise: { DEFAULT: '#1A2232', clair: '#263046' },
        cuivre: { DEFAULT: '#E08A3C', fonce: '#B96A24' },
        arc: '#7CC6FF',
        craie: '#EDF0F5',
        brume: '#9AA5BA',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
