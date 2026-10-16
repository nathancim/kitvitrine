/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: { bonbon: 'Couleur principale', lagon: 'Couleur d\'accent', soleil: 'Couleur pétillante', creme: 'Fond de page', nuage: 'Fond des sections douces', encre: 'Texte et sections foncées' },
  theme: {
    extend: {
      colors: {
        creme: '#FFF7EE',
        nuage: '#FDE4EC',
        bonbon: { DEFAULT: '#D6437A', fonce: '#B12F62' },
        lagon: { DEFAULT: '#14958F', clair: '#9FE0DA' },
        soleil: '#FFC94A',
        encre: { DEFAULT: '#2A1D3B', doux: '#5B4B6E' },
      },
      fontFamily: {
        display: ['Fredoka', 'ui-rounded', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
    },
  },
};
