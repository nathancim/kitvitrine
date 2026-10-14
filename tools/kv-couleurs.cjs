/* Kit Vitrine — couleurs en variables CSS.
   Transforme les couleurs hexadécimales d'une config Tailwind (theme.extend.colors) en
   variables CSS (--kv-<nom>, au format « r g b »), pour que le mode édition puisse les changer
   sans recompiler. Les opacités Tailwind (bg-forest/20…) continuent de fonctionner.
   Option dans tailwind.config.js : kvCouleurs: { forest: 'Couleur principale', bone: 'Fond' }
   (libellés et ordre des couleurs proposées dans le mode édition ; sinon, toutes les couleurs). */
'use strict';
const isHex = v => typeof v === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim());
const trip = h => {
  let x = h.trim().slice(1);
  if (x.length === 3) x = x.split('').map(c => c + c).join('');
  const n = parseInt(x, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

// Liste des couleurs : [{ name, base, v: '--kv-…', hex }]
function list(config) {
  const colors = (config.theme && config.theme.extend && config.theme.extend.colors) || {};
  const out = [];
  for (const [k, v] of Object.entries(colors)) {
    if (isHex(v)) out.push({ name: k, base: k, v: `--kv-${k}`, hex: v });
    else if (v && typeof v === 'object')
      for (const [s, c] of Object.entries(v)) if (isHex(c)) { const n = s === 'DEFAULT' ? k : `${k}-${s}`; out.push({ name: n, base: k, v: `--kv-${n}`, hex: c }); }
  }
  return out;
}

function withVars(config, htmlGlob) {
  const colors = (config.theme && config.theme.extend && config.theme.extend.colors) || {};
  const ref = n => `rgb(var(--kv-${n}) / <alpha-value>)`;
  const out = {};
  for (const [k, v] of Object.entries(colors)) {
    if (isHex(v)) out[k] = ref(k);
    else if (v && typeof v === 'object') { out[k] = {}; for (const [s, c] of Object.entries(v)) out[k][s] = isHex(c) ? ref(s === 'DEFAULT' ? k : `${k}-${s}`) : c; }
    else out[k] = v;
  }
  const vars = Object.fromEntries(list(config).map(c => [c.v, trip(c.hex)]));
  const { kvCouleurs, ...rest } = config;
  return {
    ...rest,
    content: htmlGlob ? { files: [htmlGlob] } : config.content,
    theme: { ...config.theme, extend: { ...config.theme.extend, colors: out } },
    plugins: [...(config.plugins || []), ({ addBase }) => addBase({ ':root': vars })],
  };
}

// Contenu de <meta name="kv-couleurs"> : « --kv-a=Libellé|--kv-a-deep;--kv-b=Libellé »
// Les variantes (forest.deep…) suivent automatiquement leur couleur de base.
function meta(config) {
  const all = list(config);
  const labels = config.kvCouleurs || null;
  const mains = labels ? Object.keys(labels).filter(n => all.some(c => c.name === n)) : all.filter(c => c.name === c.base).map(c => c.name);
  return mains.map(n => {
    const derived = all.filter(c => c.base === n && c.name !== n).map(c => c.v);
    const label = (labels && labels[n]) || n.charAt(0).toUpperCase() + n.slice(1);
    return `--kv-${n}=${label.replace(/[;=|"]/g, ' ')}${derived.length ? '|' + derived.join('|') : ''}`;
  }).join(';');
}

module.exports = { withVars, meta, list };
