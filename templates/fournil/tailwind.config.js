/** Couleurs et polices du template — modifiez-les ici puis relancez `npm run build`. */
module.exports = {
  content: { relative: true, files: ['./*.html'] },
  // Couleurs proposées dans le mode édition (bouton « Couleurs »), avec leur libellé.
  kvCouleurs: { seigle: 'Couleur principale (seigle)', ble: 'Couleur d\'accent (blé)', croute: 'Accent secondaire (croûte)', mie: 'Tuiles douces (mie)', fond: 'Fond de page', farine: 'Fond des tuiles', encre: 'Texte' },
  theme: {
    extend: {
      colors: {
        seigle: { DEFAULT: '#2F3B2A', clair: '#45533E' },
        ble: { DEFAULT: '#E2B13C', fonce: '#C2921F' },
        croute: '#9A5424',
        mie: '#F2DFA6',
        fond: '#E8E5D2',
        farine: '#F8F5EA',
        encre: '#1F231B',
      },
      fontFamily: {
        display: ['Calistoga', 'Georgia', 'serif'],
        sans: ['Onest', 'system-ui', 'sans-serif'],
      },
    },
  },
};
