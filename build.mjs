// Kit Vitrine build: compiles every template, packages the .zip files,
// generates catalog images and the static site in dist/.
// Usage: node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import * as P from './site/pages.mjs';
import { legalPages } from './site/legal.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const r = (...p) => path.join(ROOT, ...p);
const sh = cmd => execSync(cmd, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const write = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const FORCE = process.argv.includes('--force');
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
<!-- Bandeau ajouté uniquement sur la démo Kit Vitrine -->
<div data-kv-demo style="position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px 10px 16px;background:#161B26;color:#fff;border-radius:10px;font:500 14px/1.3 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25);max-width:640px;margin:0 auto">
  <span>Démo du template <strong>${P.esc(t.title)}</strong> · ${t.prix} €</span>
  <span style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">
  <a href="#edition" style="color:#fff;padding:8px 12px;border-radius:6px;text-decoration:none;white-space:nowrap;box-shadow:inset 0 0 0 1px rgba(255,255,255,.35)">Essayer l'édition</a>
  <a href="/templates/${t.slug}/" style="background:#F0BE3D;color:#161B26;padding:8px 14px;border-radius:6px;text-decoration:none;white-space:nowrap;font-weight:600">Voir l'offre</a>
  </span>
</div>
`;

// Built-in edit mode (tools/kv-edition.js), added to every demo and every zip
const EDIT_JS = r('tools/kv-edition.js');
const withEdit = html => html.includes('kv-edition.js') ? html : html.replace('</body>', '<script src="assets/kv-edition.js" defer></script>\n</body>');
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
  if (FORCE || mtime(path.join(tdir, 'assets/styles.css')) < newest)
    sh(`npx tailwindcss -c templates/${t.slug}/tailwind.config.js -i templates/${t.slug}/src/input.css -o templates/${t.slug}/assets/styles.css --minify`);

  // Demo (public): site + bandeau
  const demo = r('dist/demo', t.slug);
  fs.cpSync(path.join(tdir, 'assets'), path.join(demo, 'assets'), { recursive: true });
  const html = fs.readFileSync(path.join(tdir, 'index.html'), 'utf8');
  fs.copyFileSync(EDIT_JS, path.join(demo, 'assets/kv-edition.js'));
  write(path.join(demo, 'index.html'), withEdit(html).replace('</body>', demoBar(t) + '</body>').replace('<head>', '<head>\n  <meta name="robots" content="noindex">'));
  for (const f of fs.readdirSync(tdir)) if (f.endsWith('.html') && f !== 'index.html')
    write(path.join(demo, f), withEdit(fs.readFileSync(path.join(tdir, f), 'utf8')).replace('</body>', demoBar(t) + '</body>'));

  // Images (cached in shots/, regenerated when the template changes)
  const shots = r('shots', t.slug);
  if (mtime(path.join(shots, 'full.jpg')) < Math.max(mtime(path.join(tdir, 'index.html')), mtime(path.join(tdir, 'assets/styles.css'))))
    sh(`python3 tools/shots.py templates/${t.slug}/index.html shots/${t.slug}`);
  for (const f of ['thumb.jpg', 'full.jpg']) { fs.mkdirSync(r('dist/templates', t.slug), { recursive: true }); fs.copyFileSync(path.join(shots, f), r('dist/templates', t.slug, f)); }

  // Package for buyers (never deployed)
  const zip = r('packages', `kitvitrine-${t.slug}.zip`);
  if (!FORCE && mtime(zip) >= Math.max(...walk(tdir).map(mtime), mtime(EDIT_JS), mtime(r('build.mjs')))) continue;
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
  for (const f of fs.readdirSync(stage)) if (f.endsWith('.html')) write(path.join(stage, f), withEdit(fs.readFileSync(path.join(stage, f), 'utf8')));
  fs.copyFileSync(EDIT_JS, path.join(stage, 'assets/kv-edition.js'));
  write(path.join(stage, 'MODIFIER-MON-SITE.html'), EDIT_LAUNCHER);
  write(path.join(stage, 'LISEZMOI.md'), readme(t));
  write(path.join(stage, 'LICENCE.txt'), licenceTxt(t));
  fs.rmSync(zip, { force: true });
  execSync(`zip -qr "${zip}" .`, { cwd: stage });
}
fs.rmSync(r('.stage'), { recursive: true, force: true });
// Buyer downloads (secret, unlisted URLs)
for (const t of cat.templates) { const d = r('dist/dl', t.dl_token); fs.mkdirSync(d, { recursive: true }); fs.copyFileSync(r('packages', `kitvitrine-${t.slug}.zip`), path.join(d, `kitvitrine-${t.slug}.zip`)); }

// ---- Site pages ----
const univMap = Object.fromEntries(cat.univers.map(u => [u.slug, u]));
const counts = {};
for (const t of cat.templates) for (const u of t.univers) counts[u] = (counts[u] || 0) + 1;
const page = (p, o) => write(r('dist', p, 'index.html'), P.layout({ site, ...o, path: '/' + (p ? p + '/' : '') }));

page('', {
  title: 'Kit Vitrine — Templates de sites vitrines par métier',
  description: `${site.tagline}. Templates HTML et Tailwind CSS avec textes rédigés, démo en ligne et téléchargement immédiat.`,
  body: P.homePage(cat, univMap, counts),
  jsonld: { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url, potentialAction: { '@type': 'SearchAction', target: site.url + '/catalogue/?q={search_term_string}', 'query-input': 'required name=search_term_string' } }
});
page('catalogue', {
  title: 'Catalogue des templates — Kit Vitrine',
  description: 'Recherchez un template de site vitrine par métier, style, couleur ou nombre de pages.',
  body: P.cataloguePage(cat),
  scripts: '<script src="/assets/catalogue.js" defer></script>'
});
page('univers', { title: 'Templates par métier — Kit Vitrine', description: 'Tous les métiers couverts par les templates Kit Vitrine.', body: P.universIndexPage(cat, counts) });
for (const u of cat.univers) {
  const list = cat.templates.filter(t => t.univers.includes(u.slug));
  page(`univers/${u.slug}`, { title: `Templates de sites ${u.label.toLowerCase()} — Kit Vitrine`, description: `${u.description} Templates de sites vitrines prêts à l'emploi, démo en ligne.`, body: P.universPage(u, list, univMap) });
}
for (const t of cat.templates) {
  const related = cat.templates.filter(o => o.slug !== t.slug && o.univers.some(u => t.univers.includes(u))).slice(0, 4);
  page(`templates/${t.slug}`, {
    title: `${t.title} — ${t.tagline} | Kit Vitrine`,
    description: t.description.slice(0, 155),
    body: P.templatePage(t, univMap, related, site),
    jsonld: { '@context': 'https://schema.org', '@type': 'Product', name: `Template ${t.title}`, description: t.description, image: `${site.url}/templates/${t.slug}/thumb.jpg`, brand: { '@type': 'Brand', name: site.name }, offers: { '@type': 'Offer', price: t.prix, priceCurrency: 'EUR', availability: t.shopify_url ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder', url: `${site.url}/templates/${t.slug}/` } }
  });
}
for (const [slug, title, html] of legalPages) page(slug, { title: `${title} — Kit Vitrine`, description: title, body: P.textPage(title, html) });
write(r('dist/404.html'), P.layout({ site, path: '/404', title: 'Page introuvable — Kit Vitrine', description: 'Page introuvable', body: `<section class="mx-auto max-w-3xl px-4 sm:px-6 pt-16"><h1 class="font-display font-extrabold text-4xl">Cette page n'existe pas ou plus.</h1><p class="mt-4 text-ink/70">Le template a peut-être changé de nom. Cherchez-le dans le catalogue.</p><p class="mt-8 flex gap-3"><a href="/catalogue/" class="btn-sign">Ouvrir le catalogue</a><a href="/" class="btn-line">Accueil</a></p></section>` }));

// ---- Data, assets, SEO files ----
const pub = { univers: cat.univers.map(({ slug, label, description }) => ({ slug, label, description })), templates: cat.templates.map(({ _i, sections, palette, dl_token, shopify_product_id, ...t }) => t) };
write(r('dist/data/catalog.json'), JSON.stringify(pub));
fs.copyFileSync(r('site/catalogue.js'), r('dist/assets/catalogue.js'));
write(r('dist/favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#fff"/><path d="M3 9h26v5c0 2-1.6 3.5-3.25 3.5S22.5 16 22.5 14c0 2-1.6 3.5-3.25 3.5S16 16 16 14c0 2-1.6 3.5-3.25 3.5S9.5 16 9.5 14c0 2-1.6 3.5-3.25 3.5S3 16 3 14z" fill="#0E5A47"/><rect x="6" y="20" width="20" height="8" rx="1" fill="none" stroke="#161B26" stroke-width="2"/></svg>`);
const urls = ['', 'catalogue/', 'univers/', ...cat.univers.map(u => `univers/${u.slug}/`), ...cat.templates.map(t => `templates/${t.slug}/`), ...legalPages.map(([s]) => s + '/')];
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
- \`src/input.css\` et \`tailwind.config.js\` : les sources pour changer couleurs et polices.

## Modifier les textes (sans rien installer)

1. Double-cliquez sur \`MODIFIER-MON-SITE.html\` : votre site s'ouvre dans le navigateur, en mode édition.
2. Cliquez sur n'importe quel texte et tapez par-dessus (nom, téléphone, e-mail, tarifs, avis…).
3. Cliquez sur « Télécharger ma page », puis remplacez \`index.html\` dans ce dossier par le fichier téléchargé.

Guide illustré : https://kitvitrine.pages.dev/guide/

Vous préférez un éditeur de texte ? Ouvrez \`index.html\` dans VS Code ou Notepad++, cherchez le texte à changer (Ctrl+F) et remplacez-le.

## Changer les couleurs ou les polices

1. Installez Node.js (https://nodejs.org).
2. Dans ce dossier, lancez : \`npm install\`
3. Modifiez les couleurs dans \`tailwind.config.js\`.
4. Recompilez : \`npm run build\` (ou \`npm run dev\` pour recompiler à chaque modification).

## Formulaire de contact

Le formulaire n'envoie rien tant qu'il n'est pas relié à un service.
Le plus simple : Netlify Forms (ajoutez \`data-netlify="true"\` sur la balise \`<form>\`) ou Formspree (remplacez \`action="#"\` par l'adresse fournie).

## Mettre en ligne

Glissez le dossier complet sur https://app.netlify.com/drop, ou envoyez-le par FTP chez votre hébergeur (OVH, o2switch, Ionos…).
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
