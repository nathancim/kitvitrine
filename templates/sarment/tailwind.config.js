/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: { vin: 'Couleur principale (bordeaux)', or: 'Accent doré', nuit: 'Fond de page', cave: 'Fond des encadrés', craie: 'Texte' },
  theme: {
    extend: {
      colors: {
        vin: { DEFAULT: '#8C2A3C', clair: '#A8404F' },
        or: { DEFAULT: '#C8A45D', pale: '#E3CC97' },
        nuit: '#1A1013',
        cave: '#271A1E',
        craie: '#F1E8DC',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Garamond', 'Georgia', 'serif'],
        sans: ['Commissioner', 'system-ui', 'sans-serif'],
      },
    },
  },
};
