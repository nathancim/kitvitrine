module.exports = {
  content: { relative: true, files: ['../dist/**/*.html', './*.js', './*.mjs'] },
  theme: {
    extend: {
      colors: {
        paper: '#FFFFFF',
        ink: '#161B26',
        mist: '#F2F4F5',
        line: '#E2E5E8',
        sign: { DEFAULT: '#0E5A47', deep: '#0A4436' },
        awning: '#F0BE3D',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        pill: '0 1px 2px rgb(0 0 0 / .08), 0 4px 12px rgb(0 0 0 / .05)',
        'pill-hover': '0 2px 4px rgb(0 0 0 / .12), 0 8px 18px rgb(0 0 0 / .08)',
        card: '0 6px 20px rgb(0 0 0 / .12)',
      },
    },
  },
};
