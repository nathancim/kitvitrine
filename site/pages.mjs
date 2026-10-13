// HTML generators for the Kit Vitrine catalog site.
export const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const euro = n => `${n} €`;

export function layout({ site, title, description, path, body, jsonld = null, scripts = '' }) {
  const url = site.url + path;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}">
<meta name="theme-color" content="#0E5A47">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/bricolage-grotesque-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body>
<a href="#contenu" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 rounded">Aller au contenu</a>
${header()}
<main id="contenu">
${body}
</main>
${footer(site)}
<script>
  const mb=document.getElementById('menuBtn'),mn=document.getElementById('menu');
  mb&&mb.addEventListener('click',()=>{const o=mn.classList.toggle('hidden')===false;mb.setAttribute('aria-expanded',o)});
</script>
${scripts}
</body>
</html>`;
}

const logo = `<svg class="w-8 h-8" viewBox="0 0 32 32" aria-hidden="true"><path d="M3 9h26v5c0 2-1.6 3.5-3.25 3.5S22.5 16 22.5 14c0 2-1.6 3.5-3.25 3.5S16 16 16 14c0 2-1.6 3.5-3.25 3.5S9.5 16 9.5 14c0 2-1.6 3.5-3.25 3.5S3 16 3 14z" fill="#0E5A47"/><path d="M9.5 9h6.5v5c0 2-1.6 3.5-3.25 3.5S9.5 16 9.5 14z" fill="#F0BE3D"/><path d="M22.5 9H29v5c0 2-1.6 3.5-3.25 3.5S22.5 16 22.5 14z" fill="#F0BE3D"/><rect x="6" y="20" width="20" height="8" rx="1" fill="none" stroke="#161B26" stroke-width="2"/></svg>`;

function header() {
  return `<header class="border-b border-line bg-white sticky top-0 z-40">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center gap-6">
    <a href="/" class="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight shrink-0">${logo}Kit Vitrine</a>
    <form action="/catalogue/" class="hidden md:flex flex-1 max-w-md" role="search">
      <label class="sr-only" for="hq">Rechercher un template</label>
      <input id="hq" name="q" type="search" placeholder="Rechercher : ostéopathe, boulangerie, gîte…" class="w-full rounded-md border border-line bg-mist px-4 py-2.5 text-[15px] focus:bg-white focus:border-ink focus:outline-none">
    </form>
    <nav class="hidden md:flex items-center gap-6 text-[15px] ml-auto">
      <a href="/catalogue/" class="hover:text-sign">Catalogue</a>
      <a href="/univers/" class="hover:text-sign">Métiers</a>
      <a href="/licence/" class="hover:text-sign">Licence</a>
      <a href="/faq/" class="hover:text-sign">Questions</a>
    </nav>
    <button id="menuBtn" class="md:hidden ml-auto p-2 -mr-2" aria-label="Menu" aria-expanded="false" aria-controls="menu"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
  </div>
  <div id="menu" class="hidden md:hidden border-t border-line px-4 py-4 space-y-4">
    <form action="/catalogue/" role="search"><input name="q" type="search" aria-label="Rechercher un template" placeholder="Rechercher un métier…" class="w-full rounded-md border border-line bg-mist px-4 py-3 text-base"></form>
    <nav class="grid gap-3 text-lg"><a href="/catalogue/">Catalogue</a><a href="/univers/">Métiers</a><a href="/licence/">Licence</a><a href="/faq/">Questions</a></nav>
  </div>
</header>`;
}

function footer(site) {
  return `<footer class="mt-24 bg-ink text-white/70">
  <div class="awning opacity-90"></div>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4 text-[15px]">
    <div class="md:col-span-2">
      <p class="font-display font-extrabold text-white text-xl">Kit Vitrine</p>
      <p class="mt-3 max-w-sm">${esc(site.tagline)}. Fichiers HTML et Tailwind CSS, livrés dès le paiement.</p>
    </div>
    <nav class="grid gap-2 content-start"><p class="text-white font-medium mb-1">Boutique</p><a href="/catalogue/" class="hover:text-white">Tous les templates</a><a href="/univers/" class="hover:text-white">Par métier</a><a href="/licence/" class="hover:text-white">Licence</a><a href="/faq/" class="hover:text-white">Questions fréquentes</a></nav>
    <nav class="grid gap-2 content-start"><p class="text-white font-medium mb-1">Informations</p><a href="/mentions-legales/" class="hover:text-white">Mentions légales</a><a href="/cgv/" class="hover:text-white">Conditions de vente</a><a href="/confidentialite/" class="hover:text-white">Confidentialité</a></nav>
  </div>
  <p class="mx-auto max-w-7xl px-4 sm:px-6 pb-10 text-sm text-white/50">© ${new Date().getFullYear()} Kit Vitrine</p>
</footer>`;
}

export function card(t, univMap) {
  const u = t.univers.map(s => univMap[s]?.label).filter(Boolean)[0] || '';
  return `<article class="card group">
  <a href="/templates/${t.slug}/" class="card-thumb"><img src="/templates/${t.slug}/thumb.jpg" alt="Aperçu du template ${esc(t.title)}" loading="lazy" width="800" height="600"></a>
  <div class="mt-3 flex items-start justify-between gap-3">
    <div>
      <h3 class="font-display font-bold text-lg leading-tight"><a href="/templates/${t.slug}/" class="hover:text-sign">${esc(t.title)}</a></h3>
      <p class="text-sm text-ink/60 mt-0.5">${esc(t.tagline)}</p>
    </div>
    <p class="font-display font-bold shrink-0">${euro(t.prix)}</p>
  </div>
  <p class="mt-2 text-xs text-ink/55">${esc(u)} · ${t.pages} page${t.pages > 1 ? 's' : ''} · ${esc(t.style)}</p>
</article>`;
}

export function homePage(cat, univMap, counts) {
  const latest = cat.templates.slice(0, 8);
  const vitrine = cat.templates.slice(0, 3);
  return `
<section class="bg-mist border-b border-line">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-16 md:pt-20 md:pb-24 grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
    <div>
      <h1 class="font-display font-extrabold text-[2.6rem] leading-[1.02] sm:text-6xl tracking-tight">Le site de votre métier, déjà prêt.</h1>
      <p class="mt-6 text-lg text-ink/75 max-w-xl leading-relaxed">Des templates de sites vitrines écrits pour chaque profession, avec de vrais textes et de vraies sections. Vous remplacez le nom, le téléphone, les photos, et vous mettez en ligne.</p>
      <form action="/catalogue/" class="mt-8 flex max-w-xl gap-2" role="search">
        <label class="sr-only" for="heroq">Votre métier</label>
        <input id="heroq" name="q" type="search" placeholder="Votre métier : fleuriste, kiné, menuisier…" class="flex-1 min-w-0 rounded-md border border-ink/20 bg-white px-4 py-3.5 text-base focus:border-ink focus:outline-none">
        <button class="btn-sign">Chercher</button>
      </form>
      <p class="mt-4 text-sm text-ink/60">${cat.templates.length} template${cat.templates.length > 1 ? 's' : ''} · ${cat.univers.length} familles de métiers · nouveautés chaque jour</p>
    </div>
    <div class="relative">
      <div class="awning rounded-t-sm"></div>
      <div class="bg-white border-x-[10px] border-b-[10px] border-ink rounded-b-md p-4 sm:p-6">
        <div class="grid grid-cols-3 gap-3 sm:gap-4">
          ${vitrine.map((t, i) => `<a href="/templates/${t.slug}/" class="${i === 0 ? 'col-span-3 sm:col-span-2 sm:row-span-2' : 'hidden sm:block'} block rounded overflow-hidden border border-line bg-mist"><img src="/templates/${t.slug}/thumb.jpg" alt="${esc(t.title)}" class="w-full h-full object-cover object-top aspect-[4/3]" width="800" height="600"></a>`).join('')}
        </div>
        <p class="mt-4 text-sm flex justify-between gap-4"><span class="text-ink/60">À l'affiche</span><a href="/templates/${vitrine[0]?.slug}/" class="font-medium hover:text-sign">${esc(vitrine[0]?.title)}, ${esc(vitrine[0]?.tagline?.toLowerCase())}</a></p>
      </div>
    </div>
  </div>
</section>

<section class="mx-auto max-w-7xl px-4 sm:px-6 pt-16">
  <div class="flex items-end justify-between gap-6"><h2 class="font-display font-bold text-3xl">Par métier</h2><a href="/univers/" class="text-sm font-medium hover:text-sign">Tous les métiers</a></div>
  <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 border-t border-l border-line">
    ${cat.univers.map(u => `<a href="/univers/${u.slug}/" class="border-r border-b border-line p-5 hover:bg-mist">
      <span class="block font-display font-bold">${esc(u.label)}</span>
      <span class="block mt-1 text-sm text-ink/55">${counts[u.slug] || 0} template${(counts[u.slug] || 0) > 1 ? 's' : ''}</span></a>`).join('')}
  </div>
</section>

<section class="mx-auto max-w-7xl px-4 sm:px-6 pt-20">
  <div class="flex items-end justify-between gap-6"><h2 class="font-display font-bold text-3xl">Derniers arrivés</h2><a href="/catalogue/" class="text-sm font-medium hover:text-sign">Voir tout le catalogue</a></div>
  <div class="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">${latest.map(t => card(t, univMap)).join('')}</div>
</section>

<section class="mx-auto max-w-7xl px-4 sm:px-6 pt-24">
  <h2 class="font-display font-bold text-3xl">De l'achat à la mise en ligne</h2>
  <ol class="mt-10 grid md:grid-cols-3 gap-10">
    <li><p class="font-display font-extrabold text-5xl text-sign">1</p><h3 class="mt-3 font-display font-bold text-xl">Choisissez et testez</h3><p class="mt-2 text-ink/70 leading-relaxed">Chaque template a une démo en ligne. Parcourez-la sur ordinateur et sur téléphone avant d'acheter.</p></li>
    <li><p class="font-display font-extrabold text-5xl text-sign">2</p><h3 class="mt-3 font-display font-bold text-xl">Téléchargez</h3><p class="mt-2 text-ink/70 leading-relaxed">Le fichier .zip arrive par e-mail dès le paiement : HTML, CSS compilé, polices incluses et guide en français.</p></li>
    <li><p class="font-display font-extrabold text-5xl text-sign">3</p><h3 class="mt-3 font-display font-bold text-xl">Personnalisez et publiez</h3><p class="mt-2 text-ink/70 leading-relaxed">Modifiez les textes dans n'importe quel éditeur, puis déposez le dossier sur Netlify, OVH, o2switch ou tout autre hébergeur.</p></li>
  </ol>
</section>

<section class="mx-auto max-w-7xl px-4 sm:px-6 pt-24">
  <div class="grid md:grid-cols-4 gap-px bg-line border border-line rounded-md overflow-hidden">
    ${[['Textes déjà rédigés', 'Des contenus pensés pour le métier, pas du faux latin.'], ['Rapide et sans dépendance', 'Du HTML statique : pas de base de données, pas de plugin à mettre à jour.'], ['Polices hébergées en local', 'Aucun appel à Google Fonts, plus simple pour le RGPD.'], ['Utilisable sur tous les écrans', 'Testé sur téléphone, tablette et ordinateur.']].map(([a, b]) => `<div class="bg-white p-6"><h3 class="font-display font-bold">${a}</h3><p class="mt-2 text-sm text-ink/65 leading-relaxed">${b}</p></div>`).join('')}
  </div>
</section>`;
}

export function cataloguePage(cat) {
  const opt = (name, value, label) => `<label class="chip" data-f="${name}"><input type="checkbox" class="sr-only" name="${name}" value="${esc(value)}">${label}</label>`;
  return `
<section class="mx-auto max-w-7xl px-4 sm:px-6 pt-10">
  <h1 class="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">Catalogue</h1>
  <div class="mt-6 flex flex-col sm:flex-row gap-3">
    <label class="sr-only" for="q">Rechercher</label>
    <input id="q" type="search" placeholder="Métier, style, mot-clé…" class="flex-1 rounded-md border border-ink/20 px-4 py-3 text-base focus:border-ink focus:outline-none" autocomplete="off">
    <div class="flex gap-3">
      <button id="filtersBtn" class="btn-line lg:hidden flex-1" aria-controls="filters" aria-expanded="false">Filtres <span id="fcount" class="hidden rounded-full bg-sign text-white text-xs px-2 py-0.5"></span></button>
      <label class="sr-only" for="sort">Trier</label>
      <select id="sort" class="rounded-md border border-line bg-white px-3 py-3 text-[15px] flex-1 sm:flex-none">
        <option value="recent">Plus récents</option><option value="prix-asc">Prix croissant</option><option value="prix-desc">Prix décroissant</option><option value="az">De A à Z</option>
      </select>
    </div>
  </div>
</section>
<section class="mx-auto max-w-7xl px-4 sm:px-6 pt-8 grid lg:grid-cols-[260px_1fr] gap-10">
  <aside id="filters" class="hidden lg:block space-y-8" aria-label="Filtres">
    <fieldset><legend class="font-display font-bold mb-3">Métier</legend><div class="flex flex-wrap gap-2">${cat.univers.map(u => opt('univers', u.slug, esc(u.label))).join('')}</div></fieldset>
    <fieldset><legend class="font-display font-bold mb-3">Style</legend><div class="flex flex-wrap gap-2">${cat.styles.map(s => opt('style', s, esc(s))).join('')}</div></fieldset>
    <fieldset><legend class="font-display font-bold mb-3">Couleur dominante</legend><div class="flex flex-wrap gap-2">${Object.entries(cat.couleurs).map(([k, v]) => opt('couleur', k, `<span class="w-3.5 h-3.5 rounded-full border border-black/10" style="background:${v}"></span>${k[0].toUpperCase() + k.slice(1)}`)).join('')}</div></fieldset>
    <fieldset><legend class="font-display font-bold mb-3">Nombre de pages</legend><div class="flex flex-wrap gap-2">${opt('pages', '1', 'Une page')}${opt('pages', 'multi', 'Plusieurs pages')}</div></fieldset>
    <button id="reset" class="text-sm underline underline-offset-4 hover:text-sign">Effacer les filtres</button>
  </aside>
  <div>
    <p id="count" class="text-sm text-ink/60" aria-live="polite"></p>
    <div id="grid" class="mt-5 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3"></div>
    <div id="empty" class="hidden mt-6 rounded-md border border-line bg-mist p-8">
      <p class="font-display font-bold text-xl">Aucun template ne correspond à cette recherche.</p>
      <p class="mt-2 text-ink/70">Essayez un mot plus général (par exemple « santé » plutôt que « podologue ») ou retirez un filtre. De nouveaux templates arrivent chaque jour.</p>
      <button id="reset2" class="btn-line mt-5">Effacer la recherche et les filtres</button>
    </div>
    <div class="mt-12 text-center"><button id="more" class="btn-line hidden">Afficher plus de templates</button></div>
  </div>
</section>`;
}

export function universIndexPage(cat, counts) {
  return `
<section class="mx-auto max-w-7xl px-4 sm:px-6 pt-10">
  <h1 class="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">Templates par métier</h1>
  <p class="mt-4 text-lg text-ink/70 max-w-2xl">Chaque famille regroupe des sites écrits pour des professions précises : les sections, les textes et les appels à l'action changent d'un métier à l'autre.</p>
  <div class="mt-10 grid sm:grid-cols-2 gap-px bg-line border border-line rounded-md overflow-hidden">
    ${cat.univers.map(u => `<a href="/univers/${u.slug}/" class="bg-white p-6 hover:bg-mist"><span class="flex justify-between gap-4 font-display font-bold text-xl"><span>${esc(u.label)}</span><span class="text-ink/45 font-medium text-base">${counts[u.slug] || 0}</span></span><span class="block mt-2 text-ink/65">${esc(u.description)}</span></a>`).join('')}
  </div>
</section>`;
}

export function universPage(u, list, univMap) {
  return `
<section class="mx-auto max-w-7xl px-4 sm:px-6 pt-10">
  <nav class="text-sm text-ink/55" aria-label="Fil d'Ariane"><a href="/" class="hover:text-ink">Accueil</a> / <a href="/univers/" class="hover:text-ink">Métiers</a> / <span class="text-ink">${esc(u.label)}</span></nav>
  <h1 class="mt-4 font-display font-extrabold text-4xl sm:text-5xl tracking-tight">Templates de sites ${esc(u.label.toLowerCase())}</h1>
  <p class="mt-4 text-lg text-ink/70 max-w-2xl">${esc(u.description)} ${list.length ? `${list.length} modèle${list.length > 1 ? 's' : ''} disponible${list.length > 1 ? 's' : ''}, avec démo en ligne.` : ''}</p>
  ${list.length ? `<div class="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">${list.map(t => card(t, univMap)).join('')}</div>`
    : `<div class="mt-10 rounded-md border border-line bg-mist p-8"><p class="font-display font-bold text-xl">Les premiers templates de cette famille arrivent bientôt.</p><p class="mt-2 text-ink/70">En attendant, parcourez le <a href="/catalogue/" class="underline underline-offset-4">catalogue complet</a> : beaucoup de modèles s'adaptent facilement à un métier proche.</p></div>`}
</section>`;
}

export function templatePage(t, univMap, related, site) {
  const univ = t.univers.map(s => univMap[s]).filter(Boolean);
  const buy = t.shopify_url
    ? `<a href="${esc(t.shopify_url)}" class="btn-sign w-full py-4 text-lg">Acheter, ${euro(t.prix)}</a>`
    : `<p class="btn w-full py-4 text-lg bg-mist text-ink/60 cursor-not-allowed" aria-disabled="true">Bientôt en vente</p>`;
  return `
<section class="mx-auto max-w-7xl px-4 sm:px-6 pt-8">
  <nav class="text-sm text-ink/55" aria-label="Fil d'Ariane"><a href="/" class="hover:text-ink">Accueil</a> / <a href="/univers/${univ[0]?.slug}/" class="hover:text-ink">${esc(univ[0]?.label)}</a> / <span class="text-ink">${esc(t.title)}</span></nav>
  <div class="mt-6 grid lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-14 items-start">
    <div>
      <a href="/demo/${t.slug}/" class="block rounded-md border border-line overflow-hidden bg-mist" target="_blank" rel="noopener">
        <img src="/templates/${t.slug}/full.jpg" alt="Capture complète du template ${esc(t.title)}" class="w-full" width="1440" height="2400">
      </a>
    </div>
    <div class="lg:sticky lg:top-24">
      <h1 class="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">${esc(t.title)}</h1>
      <p class="mt-2 text-lg text-ink/70">${esc(t.tagline)}</p>
      <div class="mt-6 grid gap-3">
        ${buy}
        <a href="/demo/${t.slug}/" target="_blank" rel="noopener" class="btn-line w-full py-4">Ouvrir la démo en ligne</a>
      </div>
      <p class="mt-3 text-sm text-ink/60">Paiement sécurisé, téléchargement immédiat, licence pour un site.</p>
      <p class="mt-8 leading-relaxed text-ink/80">${esc(t.description)}</p>
      <dl class="mt-8 grid grid-cols-2 gap-px bg-line border border-line rounded-md overflow-hidden text-[15px]">
        <div class="bg-white p-4"><dt class="text-ink/55 text-sm">Pages</dt><dd class="font-medium">${t.pages === 1 ? 'Une page' : t.pages + ' pages'}</dd></div>
        <div class="bg-white p-4"><dt class="text-ink/55 text-sm">Style</dt><dd class="font-medium">${esc(t.style)}</dd></div>
        <div class="bg-white p-4"><dt class="text-ink/55 text-sm">Technique</dt><dd class="font-medium">HTML + Tailwind CSS</dd></div>
        <div class="bg-white p-4"><dt class="text-ink/55 text-sm">Couleurs</dt><dd class="flex gap-1.5 mt-1">${t.palette.map(c => `<span class="w-5 h-5 rounded-full border border-black/10" style="background:${c}" title="${c}"></span>`).join('')}</dd></div>
      </dl>
      <h2 class="mt-10 font-display font-bold text-xl">Sections incluses</h2>
      <ul class="mt-3 grid gap-2 text-ink/80">${t.sections.map(s => `<li class="flex gap-2.5"><svg class="w-5 h-5 text-sign shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M7.7 13.3 4.4 10l-1.1 1.1 4.4 4.4 9-9-1.1-1.1z"/></svg>${esc(s)}</li>`).join('')}</ul>
      <h2 class="mt-10 font-display font-bold text-xl">Dans le fichier .zip</h2>
      <ul class="mt-3 grid gap-2 text-ink/80 list-disc pl-5">
        <li>Le site prêt à publier (index.html, CSS compilé, polices)</li>
        <li>Les sources Tailwind pour changer couleurs et polices</li>
        <li>Un guide de personnalisation en français</li>
        <li>La licence d'utilisation</li>
      </ul>
      <p class="mt-8 flex flex-wrap gap-2">${univ.map(u => `<a href="/univers/${u.slug}/" class="chip">${esc(u.label)}</a>`).join('')}</p>
    </div>
  </div>
</section>
${related.length ? `<section class="mx-auto max-w-7xl px-4 sm:px-6 pt-24"><h2 class="font-display font-bold text-3xl">Dans la même famille</h2><div class="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">${related.map(r => card(r, univMap)).join('')}</div></section>` : ''}`;
}

export function textPage(title, html) {
  return `<section class="mx-auto max-w-3xl px-4 sm:px-6 pt-10"><h1 class="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">${esc(title)}</h1><div class="prose-kv mt-8 text-[17px]">${html}</div></section>`;
}
