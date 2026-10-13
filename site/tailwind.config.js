module.exports = {
  content: { relative: true, files: ['../dist/**/*.html', './*.js', './*.mjs'] },
  theme: {
    extend: {
      colors: {
        paper: '#FFFFFF',
        ink: '#161B26',
        mist: '#EEF1F3',
        line: '#DDE2E7',
        sign: { DEFAULT: '#0E5A47', deep: '#0A4436' },
        awning: '#F0BE3D',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
