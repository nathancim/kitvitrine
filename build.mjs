// Kit Vitrine build: compiles every template, packages the .zip files,
// generates catalog images and the static site in dist/.
// Usage: node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import * as P from './site/pages.mjs';
import { legalPages } from './site/legal.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const r = (...p) => path.join(ROOT, ...p);
const sh = cmd => execSync(cmd, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const write = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const FORCE = process.argv.includes('--force');
const FORCE_SHOTS = FORCE || process.argv.includes('--shots');
// Background (lightest palette colour) and accent (most saturated) for the phone preview
const cardColors = pal => {
  const hsl = h => { const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; return { l, s: d ? d / (1 - Math.abs(2 * l - 1)) : 0 }; };
  const byL = [...pal].sort((a, b) => hsl(b).l - hsl(a).l);
  const acc = [...pal].filter(c => hsl(c).l > .25 && hsl(c).l < .8).sort((a, b) => hsl(b).s - hsl(a).s)[0] || byL[1] || '#DDE2E7';
  return [byL[0], acc];
};
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (e.name === 'node_modules' ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
const mtime = p => fs.existsSync(p) ? fs.statSync(p).mtimeMs : 0;

const cat = JSON.parse(fs.readFileSync(r('catalog.json'), 'utf8'));
// Each template gets a secret download folder token (zip served at /dl/<token>/).
let tokensAdded = false;
for (const t of cat.templates) if (!t.dl_token) { t.dl_token = (await import('node:crypto')).randomBytes(16).toString('hex'); tokensAdded = true; }
if (tokensAdded) fs.writeFileSync(r('catalog.json'), JSON.stringify(cat, null, 2) + '\n');
const { site } = cat;
// Newest first; for the same date, the template added last comes first.
cat.templates = cat.templates.map((t, i) => ({ ...t, _i: i }))
  .sort((a, b) => b.date.localeCompare(a.date) || b._i - a._i);

// ---- Sanity checks on catalog entries ----
const univSlugs = new Set(cat.univers.map(u => u.slug));
const seen = new Set();
for (const t of cat.templates) {
  const need = ['slug', 'title', 'tagline', 'description', 'univers', 'style', 'couleur', 'pages', 'prix', 'date', 'tags', 'sections', 'palette'];
  for (const k of need) if (t[k] === undefined) throw new Error(`${t.slug}: champ manquant « ${k} »`);
  if (seen.has(t.slug)) throw new Error(`slug en double : ${t.slug}`);
  seen.add(t.slug);
  for (const u of t.univers) if (!univSlugs.has(u)) throw new Error(`${t.slug}: univers inconnu « ${u} »`);
  if (!cat.styles.includes(t.style)) throw new Error(`${t.slug}: style inconnu « ${t.style} »`);
  if (!cat.couleurs[t.couleur]) throw new Error(`${t.slug}: couleur inconnue « ${t.couleur} »`);
  if (!fs.existsSync(r('templates', t.slug, 'index.html'))) throw new Error(`${t.slug}: templates/${t.slug}/index.html introuvable`);
  if (t.date >= '2026-10-15') {
    if (!t.direction) throw new Error(`${t.slug}: champ manquant « direction » (une des directions de catalog.json)`);
    if (!Array.isArray(t.animations) || t.animations.length < 3) throw new Error(`${t.slug}: « animations » doit lister au moins 3 animations`);
  }
  if (t.direction && !cat.directions[t.direction]) throw new Error(`${t.slug}: direction inconnue « ${t.direction} » (voir catalog.json > directions)`);
}
// Variety: within a univers, a direction is reused only once every direction has been used there.
for (const u of cat.univers) {
  const used = new Set();
  for (const t of [...cat.templates].sort((a, b) => a._i - b._i).filter(t => t.univers.includes(u.slug) && t.direction)) {
    if (used.has(t.direction) && used.size < Object.keys(cat.directions).length) throw new Error(`${t.slug}: direction « ${t.direction} » déjà utilisée dans l'univers « ${u.label} ». Libres : ${Object.keys(cat.directions).filter(d => !used.has(d)).join(', ')}`);
    used.add(t.direction);
    if (used.size === Object.keys(cat.directions).length) used.clear();
  }
}

const DIST = r('dist');
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// ---- Site fonts ----
const fontDir = r('dist/assets/fonts'); fs.mkdirSync(fontDir, { recursive: true });
for (const f of ['bricolage-grotesque/files/bricolage-grotesque-latin-500-normal.woff2', 'bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff2', 'bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff2', 'instrument-sans/files/instrument-sans-latin-400-normal.woff2', 'instrument-sans/files/instrument-sans-latin-500-normal.woff2', 'instrument-sans/files/instrument-sans-latin-600-normal.woff2'])
  fs.copyFileSync(r('node_modules/@fontsource', f), path.join(fontDir, path.basename(f)));

// ---- Templates: compile CSS, demo copy, images, zip ----
const demoBar = t => `
<!-- Bandeau ajouté uniquement sur la démo Kit Vitrine (en haut, non fixé : ne gêne pas la barre d'action mobile du template) -->
<div data-kv-demo style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:8px 14px;background:#161B26;color:#fff;font:500 14px/1.3 system-ui,sans-serif">
  <span style="min-width:0">Démo : <strong>${P.esc(t.title)}</strong> · ${t.prix} €</span>
  <span style="display:flex;gap:8px">
    <a href="#edition" style="color:#fff;padding:8px 12px;min-height:40px;display:inline-flex;align-items:center;border-radius:6px;text-decoration:none;white-space:nowrap;box-shadow:inset 0 0 0 1px rgba(255,255,255,.35)">Essayer l'édition</a>
    <a href="/templates/${t.slug}/" style="background:#F0BE3D;color:#161B26;padding:8px 12px;min-height:40px;display:inline-flex;align-items:center;border-radius:6px;text-decoration:none;white-space:nowrap;font-weight:600">Voir l'offre</a>
  </span>
</div>
`;

// Built-in edit mode (tools/kv-edition.js), added to every demo and every zip
const EDIT_JS = r('tools/kv-edition.js');
const addDemoBar = (html, t) => html.replace(/<body([^>]*)>/, m => m + demoBar(t));
const withEdit = (html, couleurs) => {
  if (couleurs && !html.includes('name="kv-couleurs"')) html = html.replace('</head>', `  <meta name="kv-couleurs" content="${couleurs.replace(/"/g, '&quot;')}">\n</head>`);
  return html.includes('kv-edition.js') ? html : html.replace('</body>', '<script src="assets/kv-edition.js" defer></script>\n</body>');
};
// Template colours become CSS variables (tools/kv-couleurs.cjs) so the edit mode can change them.
const KV_COLORS = r('tools/kv-couleurs.cjs');
const requireCjs = createRequire(import.meta.url);
const twConfig = slug => { const p = r('templates', slug, 'tailwind.config.js'); delete requireCjs.cache[p]; return requireCjs(p); };
const KV_WRAPPER = `// Config utilisée par « npm run build » : vos couleurs de tailwind.config.js, transformées en
// variables CSS pour que le mode édition (bouton « Couleurs ») puisse les changer.
const path = require('path');
module.exports = require('./kv-couleurs.cjs').withVars(require('./tailwind.config.js'), path.join(__dirname, '../*.html'));
`;
const EDIT_LAUNCHER = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Modifier mon site</title>
<meta http-equiv="refresh" content="0; url=index.html#edition"></head>
<body style="font:16px system-ui,sans-serif;padding:2rem">Ouverture du mode édition… <a href="index.html#edition">Cliquez ici si rien ne se passe</a>.</body></html>
`;
fs.mkdirSync(r('packages'), { recursive: true });
for (const t of cat.templates) {
  const tdir = r('templates', t.slug);
  // Incremental: only recompile / re-shoot / re-zip a template whose sources changed
  const newest = Math.max(...walk(tdir).filter(f => !f.endsWith('styles.css')).map(mtime));
  if (FORCE || mtime(path.join(tdir, 'assets/styles.css')) < Math.max(newest, mtime(KV_COLORS))) {
    const wrap = r('.kv', `${t.slug}.tailwind.cjs`);
    write(wrap, `module.exports = require(${JSON.stringify(KV_COLORS)}).withVars(require(${JSON.stringify(path.join(tdir, 'tailwind.config.js'))}), ${JSON.stringify(path.join(tdir, '*.html'))});\n`);
    sh(`npx tailwindcss -c .kv/${t.slug}.tailwind.cjs -i templates/${t.slug}/src/input.css -o templates/${t.slug}/assets/styles.css --minify`);
  }
  const couleurs = requireCjs(KV_COLORS).meta(twConfig(t.slug));
  { const src = fs.readFileSync(path.join(tdir, 'index.html'), 'utf8'); for (const [a, what] of [['data-kv-logo', 'logo'], ['data-kv-image', 'photo']]) if (!src.includes(a)) console.warn(`! ${t.slug} : aucun emplacement ${what} (${a}) pour le mode édition`); if (!couleurs) console.warn(`! ${t.slug} : aucune couleur modifiable (tailwind.config.js)`); }

  // Demo (public): site + bandeau
  const demo = r('dist/demo', t.slug);
  fs.cpSync(path.join(tdir, 'assets'), path.join(demo, 'assets'), { recursive: true });
  const html = fs.readFileSync(path.join(tdir, 'index.html'), 'utf8');
  fs.copyFileSync(EDIT_JS, path.join(demo, 'assets/kv-edition.js'));
  write(path.join(demo, 'index.html'), addDemoBar(withEdit(html, couleurs), t).replace('<head>', '<head>\n  <meta name="robots" content="noindex">'));
  for (const f of fs.readdirSync(tdir)) if (f.endsWith('.html') && f !== 'index.html')
    write(path.join(demo, f), addDemoBar(withEdit(fs.readFileSync(path.join(tdir, f), 'utf8'), couleurs), t));

  // Images (cached in shots/, regenerated when the template changes)
  const shots = r('shots', t.slug);
  const [bg, accent] = cardColors(t.palette);
  if (FORCE_SHOTS || !fs.existsSync(path.join(shots, 'phone.jpg')) || mtime(path.join(shots, 'full.jpg')) < Math.max(mtime(path.join(tdir, 'index.html')), mtime(path.join(tdir, 'assets/styles.css'))))
    sh(`python3 tools/shots.py templates/${t.slug}/index.html shots/${t.slug} "${bg}" "${accent}"`);
  for (const f of ['thumb.jpg', 'full.jpg', 'phone.jpg', 'phone-full.jpg']) { fs.mkdirSync(r('dist/templates', t.slug), { recursive: true }); fs.copyFileSync(path.join(shots, f), r('dist/templates', t.slug, f)); }

  // Package for buyers (never deployed)
  const zip = r('packages', `kitvitrine-${t.slug}.zip`);
  if (!FORCE && mtime(zip) >= Math.max(...walk(tdir).map(mtime), mtime(EDIT_JS), mtime(KV_COLORS), mtime(r('build.mjs')))) continue;
  const stage = r('.stage', t.slug);
  fs.rmSync(stage, { recursive: true, force: true });
  fs.mkdirSync(stage, { recursive: true });
  for (const f of fs.readdirSync(tdir)) if (!['node_modules'].includes(f)) fs.cpSync(path.join(tdir, f), path.join(stage, f), { recursive: true });
  // Open-source font licences (OFL) must ship with the font files
  const fdir = path.join(stage, 'assets/fonts');
  if (fs.existsSync(fdir)) for (const fam of new Set(fs.readdirSync(fdir).filter(f => f.endsWith('.woff2')).map(f => f.split('-latin')[0]))) {
    const lic = r('node_modules/@fontsource', fam, 'LICENSE');
    if (fs.existsSync(lic)) fs.copyFileSync(lic, path.join(fdir, `LICENCE-${fam}.txt`));
    else throw new Error(`${t.slug}: licence de police introuvable pour ${fam}`);
  }
  // Keep the build tooling out of the site root: hosts like Netlify Drop would try to run
  // package.json. Move it to sources-tailwind/ and fix the relative paths.
  const src = path.join(stage, 'sources-tailwind');
  fs.mkdirSync(src);
  for (const f of ['package.json', 'tailwind.config.js', 'src']) if (fs.existsSync(path.join(stage, f))) fs.renameSync(path.join(stage, f), path.join(src, f));
  const fix = (file, from, to) => { const p = path.join(src, file); const c = fs.readFileSync(p, 'utf8'); if (!c.includes(from)) throw new Error(`${t.slug}: « ${from} » introuvable dans ${file}`); fs.writeFileSync(p, c.split(from).join(to)); };
  fix('tailwind.config.js', "'./*.html'", "'../*.html'");
  fix('package.json', '-o assets/styles.css', '-o ../assets/styles.css');
  fix('package.json', '-c tailwind.config.js', '-c kv.config.cjs');
  fs.copyFileSync(KV_COLORS, path.join(src, 'kv-couleurs.cjs'));
  write(path.join(src, 'kv.config.cjs'), KV_WRAPPER);
  for (const f of fs.readdirSync(stage)) if (f.endsWith('.html')) write(path.join(stage, f), withEdit(fs.readFileSync(path.join(stage, f), 'utf8'), couleurs));
  fs.copyFileSync(EDIT_JS, path.join(stage, 'assets/kv-edition.js'));
  write(path.join(stage, 'MODIFIER-MON-SITE.html'), EDIT_LAUNCHER);
  write(path.join(stage, 'LISEZMOI.md'), readme(t));
  write(path.join(stage, 'LICENCE.txt'), licenceTxt(t));
  fs.rmSync(zip, { force: true });
  execSync(`zip -qr "${zip}" .`, { cwd: stage });
}
fs.rmSync(r('.stage'), { recursive: true, force: true });
fs.rmSync(r('.kv'), { recursive: true, force: true });
// Buyer downloads (secret, unlisted URLs)
for (const t of cat.templates) { const d = r('dist/dl', t.dl_token); fs.mkdirSync(d, { recursive: true }); fs.copyFileSync(r('packages', `kitvitrine-${t.slug}.zip`), path.join(d, `kitvitrine-${t.slug}.zip`)); }

// ---- Site pages ----
const univMap = Object.fromEntries(cat.univers.map(u => [u.slug, u]));
const counts = {};
for (const t of cat.templates) for (const u of t.univers) counts[u] = (counts[u] || 0) + 1;
const page = (p, o) => write(r('dist', p, 'index.html'), P.layout({ site, ...o, path: '/' + (p ? p + '/' : '') }));

const homeMeta = { title: 'Kit Vitrine — Templates de sites vitrines par métier', description: `${site.tagline}. Templates HTML et Tailwind CSS avec textes rédigés, démo en ligne, pensés d'abord pour le téléphone.` };
page('', {
  ...homeMeta, explore: true,
  body: P.explorePage(cat, univMap, { intro: P.homeIntro(cat) }),
  jsonld: { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url, potentialAction: { '@type': 'SearchAction', target: site.url + '/?q={search_term_string}', 'query-input': 'required name=search_term_string' } }
});
// Former catalogue URL: same explore view, canonical points to the home page
write(r('dist/catalogue/index.html'), `<!doctype html><meta charset="utf-8"><title>Catalogue — Kit Vitrine</title><link rel="canonical" href="${site.url}/"><meta http-equiv="refresh" content="0; url=/"><a href="/">Voir tous les templates</a>`);
page('favoris', { title: 'Mes favoris — Kit Vitrine', description: 'Les templates que vous avez enregistrés.', explore: true, body: P.explorePage(cat, univMap, { favoris: true, intro: '<h1 class="mb-2 font-display font-bold text-[1.75rem] md:text-4xl tracking-tight">Mes favoris</h1><p class="mb-6 text-ink/65">Enregistrés sur cet appareil uniquement.</p>' }) });
page('messages', { title: 'Messagerie — Kit Vitrine', description: 'Votre conversation avec Kit Vitrine.', bodyAttrs: 'data-open-chat-now', body: `<section class="mx-auto max-w-2xl px-4 sm:px-6 pt-10 text-center"><h1 class="font-display font-bold text-3xl">Votre conversation</h1><p class="mt-3 text-ink/65">${site.messagerie_active ? 'La messagerie s\'ouvre automatiquement. Sinon :' : 'La messagerie ouvre très bientôt.'}</p>${site.messagerie_active ? '<button type="button" class="btn-sign mt-6" data-open-chat>Ouvrir la messagerie</button>' : ''}</section>` });
page('univers', { title: 'Templates par métier — Kit Vitrine', description: 'Tous les métiers couverts par les templates Kit Vitrine.', body: P.universIndexPage(cat, counts) });
for (const u of cat.univers) {
  const n = counts[u.slug] || 0;
  page(`univers/${u.slug}`, { title: `Templates de sites ${u.label.toLowerCase()} — Kit Vitrine`, description: `${u.description} Templates de sites vitrines prêts à l'emploi, démo en ligne.`, explore: true, body: P.explorePage(cat, univMap, { current: u.slug, intro: P.universIntro(u, n) }) });
}
for (const t of cat.templates) {
  const related = cat.templates.filter(o => o.slug !== t.slug && o.univers.some(u => t.univers.includes(u))).slice(0, 3);
  const fill = related.length < 3 ? cat.templates.filter(o => o.slug !== t.slug && !related.includes(o)).slice(0, 3 - related.length) : [];
  page(`templates/${t.slug}`, {
    title: `${t.title} — ${t.tagline} | Kit Vitrine`,
    description: t.description.slice(0, 155),
    tabbar: false, image: `/templates/${t.slug}/thumb.jpg`,
    body: P.templatePage(t, univMap, [...related, ...fill], site),
    jsonld: { '@context': 'https://schema.org', '@type': 'Product', name: `Template ${t.title}`, description: t.description, image: `${site.url}/templates/${t.slug}/thumb.jpg`, brand: { '@type': 'Brand', name: site.name }, offers: { '@type': 'Offer', price: t.prix, priceCurrency: 'EUR', availability: t.shopify_url ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder', url: `${site.url}/templates/${t.slug}/` } }
  });
}
page('guide', { title: 'Guide : personnaliser et mettre en ligne votre site — Kit Vitrine', description: 'Modifier les textes de votre template sans logiciel, puis le mettre en ligne gratuitement avec Netlify Drop, étape par étape.', body: P.guidePage() });
fs.cpSync(r('site/guide'), r('dist/assets/guide'), { recursive: true });
for (const [slug, title, html] of legalPages) page(slug, { title: `${title} — Kit Vitrine`, description: title, body: P.textPage(title, html) });
write(r('dist/404.html'), P.layout({ site, path: '/404', title: 'Page introuvable — Kit Vitrine', description: 'Page introuvable', body: `<section class="mx-auto max-w-3xl px-4 sm:px-6 pt-16"><h1 class="font-display font-bold text-3xl">Cette page n'existe pas ou plus.</h1><p class="mt-4 text-ink/70">Le template a peut-être changé de nom. Cherchez-le dans le catalogue.</p><p class="mt-8 flex gap-3"><a href="/" class="btn-sign">Voir les templates</a><a href="/guide/" class="btn-line">Lire le guide</a></p></section>` }));

// ---- Data, assets, SEO files ----
const pub = { univers: cat.univers.map(({ slug, label, description }) => ({ slug, label, description })), templates: cat.templates.map(({ _i, sections, palette, dl_token, shopify_product_id, direction, animations, ...t }) => t) };
write(r('dist/data/catalog.json'), JSON.stringify(pub));
fs.copyFileSync(r('site/explore.js'), r('dist/assets/explore.js'));
fs.copyFileSync(r('site/chat.js'), r('dist/assets/chat.js'));
write(r('dist/favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#fff"/><path d="M3 9h26v5c0 2-1.6 3.5-3.25 3.5S22.5 16 22.5 14c0 2-1.6 3.5-3.25 3.5S16 16 16 14c0 2-1.6 3.5-3.25 3.5S9.5 16 9.5 14c0 2-1.6 3.5-3.25 3.5S3 16 3 14z" fill="#0E5A47"/><rect x="6" y="20" width="20" height="8" rx="1" fill="none" stroke="#161B26" stroke-width="2"/></svg>`);
const urls = ['', 'univers/', 'guide/', ...cat.univers.map(u => `univers/${u.slug}/`), ...cat.templates.map(t => `templates/${t.slug}/`), ...legalPages.map(([s]) => s + '/')];
write(r('dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${site.url}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);
write(r('dist/robots.txt'), `User-agent: *\nDisallow: /demo/\nDisallow: /dl/\nSitemap: ${site.url}/sitemap.xml\n`);
write(r('dist/_headers'), `/assets/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n/demo/*\n  X-Robots-Tag: noindex\n/dl/*\n  X-Robots-Tag: noindex\n  Content-Disposition: attachment\n`);

// ---- Site CSS (after HTML so Tailwind sees every class) ----
sh('npx tailwindcss -c site/tailwind.config.js -i site/site.css -o dist/assets/site.css --minify');

console.log(`OK : ${cat.templates.length} template(s), ${urls.length} pages indexables, ${fs.readdirSync(r('packages')).length} zip(s).`);

function readme(t) {
  return `# ${t.title} — ${t.tagline}

Merci pour votre achat ! Ce dossier contient un site vitrine complet, prêt à être mis en ligne.

## Contenu

- \`index.html\` : la page du site. Ouvrez-la dans votre navigateur pour la voir.
- \`assets/styles.css\` : la feuille de style compilée (ne pas modifier à la main).
- \`assets/fonts/\` : les polices, hébergées avec le site (aucun appel à Google Fonts).
- \`MODIFIER-MON-SITE.html\` : ouvre le site en mode édition (textes, photos, logo, carte, liens, couleurs).
- \`sources-tailwind/\` : les sources pour changer couleurs et polices (inutile pour la mise en ligne).

## Modifier les textes (sans rien installer)

1. Double-cliquez sur \`MODIFIER-MON-SITE.html\` : votre site s'ouvre dans le navigateur, en mode édition.
2. Cliquez sur n'importe quel texte et tapez par-dessus (nom, téléphone, e-mail, tarifs, avis…).
3. Photos et logo : cliquez sur une image encadrée de jaune et choisissez votre photo (elle est redimensionnée et intégrée à la page).
4. Carte : bouton « Modifier l'adresse ». Liens (réseaux sociaux, réservation) : cliquez sur le lien puis « Modifier le lien ».
5. Couleurs : bouton « Couleurs » dans le bandeau.
6. Cliquez sur « Télécharger ma page », puis remplacez \`index.html\` dans ce dossier par le fichier téléchargé.

Guide illustré : https://kitvitrine.pages.dev/guide/

Vous préférez un éditeur de texte ? Ouvrez \`index.html\` dans VS Code ou Notepad++, cherchez le texte à changer (Ctrl+F) et remplacez-le.

## Changer les polices ou la mise en page (avancé)

1. Installez Node.js (https://nodejs.org).
2. Ouvrez un terminal dans le dossier \`sources-tailwind\` et lancez : \`npm install\`
3. Modifiez les couleurs de base ou les polices dans \`sources-tailwind/tailwind.config.js\`.
4. Recompilez : \`npm run build\` (la feuille \`assets/styles.css\` est mise à jour).

## Formulaire de contact

Le formulaire n'envoie rien tant qu'il n'est pas relié à un service.
Le plus simple : Netlify Forms (ajoutez \`data-netlify="true"\` sur la balise \`<form>\`) ou Formspree (remplacez \`action="#"\` par l'adresse fournie).

## Mettre en ligne

Glissez le dossier complet sur https://app.netlify.com/drop (gratuit, pas besoin de compte pour commencer), ou envoyez-le par FTP chez votre hébergeur (OVH, o2switch, Ionos…). Guide illustré : https://kitvitrine.pages.dev/guide/
Pensez à ajouter vos mentions légales, obligatoires en France pour un site professionnel.

## Besoin d'aide ?

Répondez simplement à l'e-mail de confirmation de commande.
`;
}

function licenceTxt(t) {
  return `LICENCE D'UTILISATION — Template « ${t.title} » — Kit Vitrine

Cette licence vous autorise à :
- utiliser le template pour UN site web, pour vous-même ou pour un client ;
- modifier librement le code, les textes, les couleurs et la mise en page.

Cette licence ne vous autorise pas à :
- revendre, redistribuer ou partager le template, modifié ou non, en tant que template ;
- l'inclure dans un générateur de sites, un thème ou une offre de templates concurrente.

Pour plusieurs sites, achetez une licence par site.
Les textes et coordonnées présents dans la démo sont fictifs et doivent être remplacés.
`;
}
