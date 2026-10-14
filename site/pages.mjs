// HTML generators for the Kit Vitrine catalog site (mise en page « explorer », mobile d'abord).
export const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const euro = n => `${n} €`;
const norm = s => (s || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export const metier = t => { const m = t.tagline.replace(/^Site vitrine pour (un |une |les )?/i, ''); return m.charAt(0).toUpperCase() + m.slice(1); };
const pagesLabel = n => n === 1 ? 'une page' : `${n} pages`;

// ---------- Icons (24px, stroke) ----------
const I = {
  search: '<path d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"/>',
  filters: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
  book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM13 4h5.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H13z"/>',
  explore: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  chat: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4v-4A1.5 1.5 0 0 1 4 14.5z"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><path d="m4 7 8 6 8-6"/>',
  back: '<path d="M15 5 8 12l7 7"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  desktop: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M9 20h6M12 16v4"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  font: '<path d="M4 19 9 5h1l5 14M6 14h7M17 19v-7M15 12h4"/>',
  zip: '<path d="M6 3h8l4 4v14H6z"/><path d="M11 6v1M11 9v1M11 12v1"/><rect x="9.5" y="14" width="3" height="3" rx=".5"/>',
  check: '<path d="M5 12.5 10 17l9-10"/>',
  bolt: '<path d="M13 3 5 13h6l-1 8 8-10h-6z"/>',
  all: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  // univers
  'sante-bien-etre': '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/><path d="M8.5 12h2l1-2 1.5 4 1-2h1.5"/>',
  animaux: '<ellipse cx="12" cy="16" rx="4" ry="3.5"/><circle cx="6.5" cy="10.5" r="1.8"/><circle cx="10" cy="6.5" r="1.8"/><circle cx="14" cy="6.5" r="1.8"/><circle cx="17.5" cy="10.5" r="1.8"/>',
  artisans: '<path d="M14 6.5 17.5 3l3.5 3.5L17.5 10zM15.8 8.2 5 19l-1.5-1.5L14.2 6.8"/><path d="M3 21h6"/>',
  restauration: '<path d="M7 3v8a2 2 0 0 0 4 0V3M9 11v10M17 21V3c-2 0-3.5 2.5-3.5 6S15 13 17 13"/>',
  commerces: '<path d="M4 9h16l-1.5-5h-13zM5 9v11h14V9"/><path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9M10 20v-5h4v5"/>',
  independants: '<rect x="3.5" y="7" width="17" height="12" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3.5 12.5h17"/>',
  tourisme: '<path d="M3 20 12 4l9 16zM12 4v16M9 20l3-5 3 5"/>',
  associations: '<circle cx="12" cy="12" r="8.5"/><path d="m12 7.5 3.5 2.5-1.3 4h-4.4L8.5 10zM12 3.5v4M15.5 10l4-1.5M14.2 14l2.3 3.5M9.8 14l-2.3 3.5M8.5 10l-4-1.5"/>',
  creatifs: '<path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/>',
  terroir: '<path d="M12 21V9M12 13c-3 0-5-2-5-5 3 0 5 2 5 5ZM12 13c3 0 5-2 5-5-3 0-5 2-5 5ZM12 9c-2.2 0-3.5-1.5-3.5-4 2.2 0 3.5 1.5 3.5 4ZM12 9c2.2 0 3.5-1.5 3.5-4-2.2 0-3.5 1.5-3.5 4Z"/>',
};
export const icon = (name, cls = 'w-6 h-6', sw = 1.8) => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[name] || I.all}</svg>`;

const logo = `<svg class="w-8 h-8 shrink-0" viewBox="0 0 32 32" aria-hidden="true"><path d="M3 9h26v5c0 2-1.6 3.5-3.25 3.5S22.5 16 22.5 14c0 2-1.6 3.5-3.25 3.5S16 16 16 14c0 2-1.6 3.5-3.25 3.5S9.5 16 9.5 14c0 2-1.6 3.5-3.25 3.5S3 16 3 14z" fill="#0E5A47"/><path d="M9.5 9h6.5v5c0 2-1.6 3.5-3.25 3.5S9.5 16 9.5 14z" fill="#F0BE3D"/><path d="M22.5 9H29v5c0 2-1.6 3.5-3.25 3.5S22.5 16 22.5 14z" fill="#F0BE3D"/><rect x="6" y="20" width="20" height="8" rx="1" fill="none" stroke="#161B26" stroke-width="2"/></svg>`;

// ---------- Layout ----------
export function layout({ site, title, description, path, body, jsonld = null, scripts = '', explore = false, tabbar = true, image = null, bodyAttrs = '', robots = '' }) {
  const url = site.url + path;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">${robots ? `<meta name="robots" content="${robots}">` : ''}
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}">${image ? `<meta property="og:image" content="${site.url}${image}">` : ''}
<meta name="theme-color" content="#FFFFFF">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/bricolage-grotesque-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body class="${tabbar ? 'pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0' : ''}" ${bodyAttrs}>
<a href="#contenu" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] bg-white px-3 py-2 rounded-lg shadow">Aller au contenu</a>
${header(explore)}
<main id="contenu">
${body}
</main>
${footer(site)}
${tabbar ? tabBar(path, site.messagerie_active) : ''}
${site.messagerie_active ? chatWidget(site.messagerie_emails, site.messagerie_delai || 'sous 48 h') : ''}
<script src="/assets/explore.js" defer></script>
${scripts}
</body>
</html>`;
}

function searchPill(explore) {
  // Desktop: three segments. Submits to the home page; on explore pages explore.js filters live.
  return `<form action="/" role="search" class="kv-pill hidden md:flex items-center rounded-full border border-line bg-white shadow-pill hover:shadow-pill-hover transition-shadow" data-pill>
    <label class="flex flex-col px-6 py-2.5 rounded-full hover:bg-mist focus-within:bg-mist cursor-text min-w-0 w-64 lg:w-72">
      <span class="text-xs font-semibold">Métier</span>
      <input name="q" type="search" autocomplete="off" placeholder="Fleuriste, couvreur, gîte…" class="kv-q bg-transparent text-[15px] placeholder:text-ink/45 focus:outline-none min-w-0" ${explore ? 'data-live' : ''}>
    </label>
    <span class="h-8 w-px bg-line"></span>
    <button type="button" class="flex flex-col items-start px-6 py-2.5 rounded-full hover:bg-mist text-left" data-open-filters>
      <span class="text-xs font-semibold">Style</span><span class="text-[15px] text-ink/55" data-summary-style>Tous les styles</span>
    </button>
    <span class="h-8 w-px bg-line"></span>
    <button type="button" class="flex flex-col items-start pl-6 pr-2 py-2.5 rounded-full hover:bg-mist text-left" data-open-filters>
      <span class="text-xs font-semibold">Pages</span><span class="text-[15px] text-ink/55" data-summary-pages>Indifférent</span>
    </button>
    <button class="ml-2 mr-2 grid place-items-center w-12 h-12 rounded-full bg-sign text-white hover:bg-sign-deep" aria-label="Rechercher">${icon('search', 'w-5 h-5', 2.4)}</button>
  </form>`;
}

function header(explore) {
  return `<header class="kv-header sticky top-0 z-40 bg-white ${explore ? '' : 'border-b border-line'}">
  <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 h-[4.5rem] md:h-20 flex items-center gap-4">
    <a href="/" class="${explore ? 'hidden md:flex' : 'flex'} items-center gap-2 min-h-11 font-display font-bold text-xl tracking-tight shrink-0">${logo}<span>Kit Vitrine</span></a>
    ${explore ? `
    <form action="/" role="search" class="md:hidden flex-1 flex items-center gap-2 min-w-0" data-pill-mobile>
      <label class="flex-1 min-w-0 flex items-center gap-3 rounded-full bg-white border border-line shadow-pill px-4 h-14">
        ${icon('search', 'w-5 h-5 shrink-0', 2.4)}
        <span class="flex flex-col min-w-0 flex-1">
          <span class="sr-only">Rechercher un métier</span>
          <input name="q" type="search" autocomplete="off" placeholder="Quel métier ?" class="kv-q w-full bg-transparent font-semibold text-base placeholder:text-ink focus:outline-none" data-live>
          <span class="text-xs text-ink/55 truncate" data-summary-mobile>Tous les styles · toutes les tailles</span>
        </span>
      </label>
      <button type="button" class="relative grid place-items-center w-12 h-12 shrink-0 rounded-full border border-line bg-white" aria-label="Filtres" data-open-filters>${icon('filters', 'w-5 h-5')}<span class="kv-badge hidden absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-ink text-white text-[11px] font-bold grid place-items-center" data-filter-count></span></button>
    </form>` : `<a href="/" class="md:hidden ml-auto grid place-items-center w-11 h-11 rounded-full border border-line" aria-label="Rechercher un template">${icon('search', 'w-5 h-5', 2.2)}</a>`}
    <div class="hidden md:flex flex-1 justify-center">${searchPill(explore)}</div>
    <nav class="hidden md:flex items-center gap-1 shrink-0" aria-label="Navigation">
      <a href="/guide/" class="px-4 py-3 rounded-full hover:bg-mist font-medium">Guide</a>
      <a href="/favoris/" class="flex items-center gap-2 px-4 py-3 rounded-full hover:bg-mist font-medium">${icon('heart', 'w-5 h-5')}<span>Favoris</span><span class="kv-fav-count hidden text-xs font-bold bg-ink text-white rounded-full px-1.5 py-0.5"></span></a>
    </nav>
  </div>
</header>`;
}

function tabBar(path, chat) {
  const tab = (href, name, label) => {
    const on = href === '/' ? (path === '/' || path.startsWith('/univers') || path.startsWith('/catalogue')) : path.startsWith(href);
    return `<a href="${href}" class="flex flex-col items-center justify-center gap-1 min-h-14 text-[11px] font-medium ${on ? 'text-sign' : 'text-ink/60'}" ${on ? 'aria-current="page"' : ''}>${icon(name, 'w-6 h-6', on ? 2.2 : 1.8)}<span>${label}</span></a>`;
  };
  const msg = chat ? `<button type="button" class="relative flex flex-col items-center justify-center gap-1 min-h-14 text-[11px] font-medium text-ink/60" data-open-chat>${icon('chat', 'w-6 h-6')}<span>Messages</span><span class="hidden absolute top-1.5 left-1/2 ml-2 min-w-5 h-5 px-1 rounded-full bg-[#E1305A] text-white text-[11px] font-bold grid place-items-center" data-chat-badge></span></button>` : '';
  return `<nav class="kv-tabbar md:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-line pb-[env(safe-area-inset-bottom)] grid ${chat ? 'grid-cols-4' : 'grid-cols-3'}" aria-label="Navigation principale">
  ${tab('/', 'explore', 'Explorer')}${tab('/favoris/', 'heart', 'Favoris')}${tab('/guide/', 'book', 'Guide')}${msg}
</nav>`;
}

function footer(site) {
  return `<footer class="mt-20 md:mt-28 bg-ink text-white/70">
  <div class="awning"></div>
  <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 text-[15px]">
    <div class="lg:col-span-2">
      <p class="flex items-center gap-2 font-display font-bold text-white text-xl">Kit Vitrine</p>
      <p class="mt-3 max-w-sm leading-relaxed">${esc(site.tagline)}. Fichiers HTML et Tailwind CSS, pensés d'abord pour le téléphone.</p>
    </div>
    <nav class="grid gap-1 content-start" aria-label="Boutique"><p class="text-white font-medium mb-1">Boutique</p><a href="/" class="py-2.5 hover:text-white">Tous les templates</a><a href="/univers/" class="py-2.5 hover:text-white">Par métier</a><a href="/guide/" class="py-2.5 hover:text-white">Guide de mise en ligne</a><a href="/licence/" class="py-2.5 hover:text-white">Licence</a><a href="/faq/" class="py-2.5 hover:text-white">Questions fréquentes</a></nav>
    <nav class="grid gap-1 content-start" aria-label="Informations"><p class="text-white font-medium mb-1">Informations</p><a href="/mentions-legales/" class="py-2.5 hover:text-white">Mentions légales</a><a href="/cgv/" class="py-2.5 hover:text-white">Conditions de vente</a><a href="/confidentialite/" class="py-2.5 hover:text-white">Confidentialité</a></nav>
  </div>
  <p class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 pb-10 text-sm text-white/50">© ${new Date().getFullYear()} Kit Vitrine</p>
</footer>`;
}


function chatWidget(emails, delai) {
  return `<button type="button" class="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-3 h-14 pl-5 pr-6 rounded-full bg-ink text-white font-semibold shadow-card hover:bg-black" data-open-chat>
  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z"/></svg>
  <span>Une question ?</span><span class="hidden min-w-5 h-5 px-1 rounded-full bg-[#E1305A] text-[11px] font-bold grid place-items-center" data-chat-badge></span>
</button>
<dialog class="kv-chat" aria-labelledby="chat-t" data-emails="${emails ? 'oui' : 'non'}" data-delai="${delai}">
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-3 px-4 h-16 border-b border-line shrink-0">
      <span class="grid place-items-center w-10 h-10 rounded-full bg-mist shrink-0">${logo}</span>
      <div class="min-w-0 flex-1"><h2 id="chat-t" class="font-semibold leading-tight">Kit Vitrine</h2><p class="text-[13px] text-ink/60 leading-tight">Réponse ${delai}</p></div>
      <form method="dialog"><button class="grid place-items-center w-11 h-11 rounded-full hover:bg-mist" aria-label="Fermer la messagerie">${icon('close', 'w-5 h-5', 2.2)}</button></form>
    </div>
    <p class="px-4 py-2 text-[12px] leading-snug text-ink/55 bg-mist/60 border-b border-line">Les réponses sont rédigées par l'assistant IA de Kit Vitrine. Les demandes particulières (devis, sur-mesure) sont transmises à l'équipe.</p>
    <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3" data-chat-list aria-live="polite"></div>
    <form class="shrink-0 border-t border-line p-4 grid gap-3" data-chat-first>
      <label class="grid gap-1"><span class="text-sm font-semibold">Votre message</span> <textarea name="message" required rows="2" maxlength="2000" class="kv-input resize-none" placeholder="Votre question ou votre projet…"></textarea></label>
      <div class="grid grid-cols-2 gap-3">
        <label class="grid gap-1 min-w-0"><span class="text-sm font-semibold">Prénom</span><input name="prenom" required maxlength="60" autocomplete="given-name" class="kv-input"></label>
        <label class="grid gap-1 min-w-0"><span class="text-sm font-semibold">E-mail</span><input name="email" type="email" required autocomplete="email" class="kv-input" placeholder="${emails ? 'pour la réponse' : 'si besoin'}"></label>
      </div>
      <label class="hidden" aria-hidden="true">Site<input name="site" tabindex="-1" autocomplete="off"></label>
      <label class="flex items-start gap-3 text-[13px] leading-snug text-ink/70 min-h-11"><input type="checkbox" name="consentement" required class="mt-0.5 w-5 h-5 shrink-0 accent-ink"><span>J'accepte que Kit Vitrine conserve mon message et mon e-mail pour me répondre (<a href="/confidentialite/" class="underline">confidentialité</a>).</span></label>
      <p class="text-sm text-[#B4443A]" data-chat-error role="alert"></p>
      <button type="submit" class="h-12 rounded-xl bg-sign text-white font-semibold hover:bg-sign-deep">Envoyer</button>
    </form>
    <form class="shrink-0 border-t border-line p-3 flex items-end gap-2" data-chat-reply hidden>
      <label class="flex-1"><span class="sr-only">Votre message</span><textarea rows="2" maxlength="2000" class="kv-input resize-none w-full" placeholder="Écrire un message…"></textarea></label>
      <button type="submit" class="h-12 px-5 rounded-xl bg-sign text-white font-semibold shrink-0">Envoyer</button>
    </form>
  </div>
</dialog>
<script src="/assets/chat.js" defer></script>`;
}

// ---------- Explore (home, univers, catalogue, favoris) ----------
function categoryBar(cat, current) {
  const item = (slug, label, href, ic) => `<a href="${href}" class="kv-cat group shrink-0 snap-start flex flex-col items-center gap-1.5 pt-3 pb-2.5 min-w-[4.25rem] text-xs font-medium border-b-2 ${current === slug ? 'border-ink text-ink' : 'border-transparent text-ink/60 hover:text-ink hover:border-line'}" data-cat="${slug}" ${current === slug ? 'aria-current="true"' : ''}>${icon(ic, 'w-6 h-6', 1.6)}<span class="whitespace-nowrap">${esc(label)}</span></a>`;
  const short = { 'sante-bien-etre': 'Santé', animaux: 'Animaux', artisans: 'Artisans', restauration: 'Restaurants', commerces: 'Commerces', independants: 'Indépendants', tourisme: 'Gîtes', associations: 'Sport', creatifs: 'Créatifs', terroir: 'Terroir' };
  return `<div class="kv-catbar sticky top-[4.5rem] md:top-20 z-30 bg-white border-b border-line">
  <div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 flex items-center gap-6">
    <nav class="flex-1 min-w-0 flex gap-3 sm:gap-8 overflow-x-auto no-scrollbar snap-x scroll-px-4 -mx-4 px-4 sm:mx-0 sm:px-0" aria-label="Métiers">
      ${item('', 'Tous', '/', 'all')}
      ${cat.univers.map(u => item(u.slug, short[u.slug] || u.label, `/univers/${u.slug}/`, u.slug)).join('')}
    </nav>
    <button type="button" class="hidden md:flex relative items-center gap-2 shrink-0 h-12 px-4 rounded-xl border border-line hover:border-ink text-sm font-semibold" data-open-filters>${icon('filters', 'w-5 h-5')}Filtres<span class="kv-badge hidden absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-ink text-white text-[11px] font-bold grid place-items-center" data-filter-count></span></button>
  </div>
</div>`;
}

function filterDialog(cat) {
  const chip = (name, value, label) => `<label class="kv-chip"><input type="checkbox" name="${name}" value="${esc(value)}" class="sr-only">${label}</label>`;
  return `<dialog class="kv-sheet" aria-labelledby="ft">
  <form method="dialog" class="flex flex-col max-h-[88vh] md:max-h-[80vh]">
    <div class="relative flex items-center justify-center h-16 border-b border-line shrink-0">
      <button value="cancel" class="absolute left-3 grid place-items-center w-11 h-11 rounded-full hover:bg-mist" aria-label="Fermer">${icon('close', 'w-5 h-5', 2.2)}</button>
      <h2 id="ft" class="font-semibold">Filtres</h2>
    </div>
    <div class="overflow-y-auto px-6 py-2 divide-y divide-line">
      <fieldset class="py-6"><legend class="float-left w-full font-display font-bold text-xl mb-4">Style</legend><div class="clear-both flex flex-wrap gap-2.5">${cat.styles.map(s => chip('style', s, esc(s))).join('')}</div></fieldset>
      <fieldset class="py-6"><legend class="float-left w-full font-display font-bold text-xl mb-4">Couleur dominante</legend><div class="clear-both flex flex-wrap gap-2.5">${Object.entries(cat.couleurs).map(([k, v]) => chip('couleur', k, `<span class="w-4 h-4 rounded-full border border-black/10" style="background:${v}"></span>${k[0].toUpperCase() + k.slice(1)}`)).join('')}</div></fieldset>
      <fieldset class="py-6"><legend class="float-left w-full font-display font-bold text-xl mb-4">Taille du site</legend><div class="clear-both flex flex-wrap gap-2.5">${chip('pages', '1', 'Une page')}${chip('pages', 'multi', 'Plusieurs pages')}</div></fieldset>
      <fieldset class="py-6"><legend class="float-left w-full font-display font-bold text-xl mb-4">Trier par</legend>
        <div class="clear-both grid gap-1">${[['recent', 'Les plus récents'], ['prix-asc', 'Prix croissant'], ['prix-desc', 'Prix décroissant'], ['az', 'Ordre alphabétique']].map(([v, l], i) => `<label class="flex items-center justify-between min-h-12 cursor-pointer"><span>${l}</span><input type="radio" name="tri" value="${v}" ${i === 0 ? 'checked' : ''} class="w-5 h-5 accent-ink"></label>`).join('')}</div>
      </fieldset>
    </div>
    <div class="flex items-center justify-between gap-4 px-6 py-4 border-t border-line shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <button type="button" class="font-semibold underline underline-offset-4 min-h-11" data-reset>Tout effacer</button>
      <button value="ok" class="h-12 px-6 rounded-xl bg-ink text-white font-semibold" data-apply>Afficher les templates</button>
    </div>
  </form>
</dialog>`;
}

export function card(t, univMap, { eager = false, isNew = false } = {}) {
  const u = t.univers.map(s => univMap[s]?.label).filter(Boolean);
  const text = norm([t.title, t.tagline, t.description, t.style, t.couleur, ...(t.tags || []), ...u].join(' '));
  return `<article class="kv-card" data-slug="${t.slug}" data-u="${t.univers.join(' ')}" data-style="${esc(t.style)}" data-couleur="${t.couleur}" data-pages="${t.pages}" data-prix="${t.prix}" data-date="${t.date}" data-title="${esc(norm(t.title))}" data-text="${esc(text)}">
  <div class="relative">
    <div class="kv-slides flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-2xl bg-mist aspect-[4/3]" tabindex="-1">
      <a href="/templates/${t.slug}/" class="snap-center shrink-0 w-full h-full" tabindex="-1" aria-hidden="true"><img src="/templates/${t.slug}/thumb.jpg" alt="" width="800" height="600" ${eager ? '' : 'loading="lazy"'} class="w-full h-full object-cover object-top"></a>
      <a href="/templates/${t.slug}/" class="snap-center shrink-0 w-full h-full" tabindex="-1" aria-hidden="true"><img src="/templates/${t.slug}/phone.jpg" alt="" width="800" height="600" loading="lazy" class="w-full h-full object-cover"></a>
    </div>
    <div class="kv-dots pointer-events-none absolute bottom-3 inset-x-0 flex justify-center gap-1.5" aria-hidden="true"><span class="on"></span><span></span></div>
    ${isNew ? '<span class="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[13px] font-semibold shadow-sm">Nouveau</span>' : ''}
    <button type="button" class="kv-heart absolute top-2 right-2 grid place-items-center w-11 h-11" aria-pressed="false" aria-label="Ajouter ${esc(t.title)} aux favoris" data-fav="${t.slug}">${icon('heart', 'w-7 h-7', 2)}</button>
  </div>
  <a href="/templates/${t.slug}/" class="block mt-3">
    <h3 class="flex justify-between gap-3 font-semibold text-[15px] leading-snug"><span>${esc(metier(t))}</span></h3>
    <p class="text-[15px] text-ink/60 leading-snug">Template ${esc(t.title)} · ${esc(t.style)}</p>
    <p class="mt-1 text-[15px] leading-snug"><span class="font-semibold">${euro(t.prix)}</span> <span class="text-ink/60">· ${pagesLabel(t.pages)}</span></p>
  </a>
</article>`;
}

export function explorePage(cat, univMap, { current = '', intro = null, favoris = false } = {}) {
  const now = new Date(cat.templates[0]?.date || Date.now());
  const isNew = t => (now - new Date(t.date)) / 864e5 < 3;
  const list = cat.templates;
  return `
${categoryBar(cat, current)}
<section class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 pt-6 md:pt-8" data-explore data-current="${current}" ${favoris ? 'data-favoris' : ''}>
  ${intro || ''}
  <div class="flex items-baseline justify-between gap-4">
    <p class="text-[15px] text-ink/60" data-count aria-live="polite">${favoris ? '' : `${list.length} template${list.length > 1 ? 's' : ''}`}</p>
  </div>
  <div class="mt-4 grid gap-x-6 gap-y-10 grid-cols-1 min-[560px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-grid>
    ${list.map((t, i) => card(t, univMap, { eager: i < 4, isNew: isNew(t) })).join('\n')}
  </div>
  <div class="hidden mt-8 rounded-2xl border border-line p-8 text-center" data-empty>
    ${favoris
      ? `<p class="font-display font-bold text-2xl">Aucun favori pour l'instant</p><p class="mt-2 text-ink/65">Touchez le cœur sur un template pour le retrouver ici.</p><a href="/" class="mt-6 inline-flex items-center h-12 px-6 rounded-xl bg-ink text-white font-semibold">Explorer les templates</a>`
      : `<p class="font-display font-bold text-2xl">Aucun template ne correspond</p><p class="mt-2 text-ink/65 max-w-md mx-auto">Essayez un mot plus général (« santé » plutôt que « podologue ») ou retirez un filtre. De nouveaux templates arrivent chaque jour.</p><button type="button" class="mt-6 inline-flex items-center h-12 px-6 rounded-xl border border-ink font-semibold" data-reset>Effacer la recherche et les filtres</button>`}
  </div>
  <div class="mt-12 text-center"><button type="button" class="hidden h-12 px-6 rounded-xl border border-ink font-semibold" data-more>Afficher plus de templates</button></div>
</section>
${filterDialog(cat)}`;
}

export function homeIntro(cat) {
  return `<div class="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
    <h1 class="font-display font-bold text-[1.75rem] leading-tight md:text-4xl tracking-tight max-w-2xl">Le site de votre métier, déjà écrit. Il ne reste qu'à mettre votre nom.</h1>
    <p class="text-ink/65 max-w-md md:text-right">Démo en ligne, textes modifiables en un clic, pensé d'abord pour le téléphone. <a href="/guide/" class="font-semibold text-ink underline underline-offset-4">Comment ça marche</a></p>
  </div>`;
}

export function universIntro(u, n) {
  return `<div class="mb-6 md:mb-8">
    <nav class="text-sm text-ink/55" aria-label="Fil d'Ariane"><a href="/" class="inline-flex items-center min-h-11 hover:text-ink">Accueil</a> / <a href="/univers/" class="inline-flex items-center min-h-11 hover:text-ink">Métiers</a> / <span class="text-ink">${esc(u.label)}</span></nav>
    <h1 class="font-display font-bold text-[1.75rem] leading-tight md:text-4xl tracking-tight">Templates de sites ${esc(u.label.toLowerCase())}</h1>
    <p class="mt-2 text-ink/65 max-w-2xl">${esc(u.description)}${n ? '' : ' Les premiers modèles de cette famille arrivent bientôt : en attendant, beaucoup de templates s\'adaptent à un métier proche.'}</p>
  </div>`;
}

export function universIndexPage(cat, counts) {
  return `
<section class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 pt-8">
  <h1 class="font-display font-bold text-3xl md:text-4xl tracking-tight">Templates par métier</h1>
  <p class="mt-3 text-ink/65 max-w-2xl">Chaque famille regroupe des sites écrits pour des professions précises : les sections, les textes et les boutons d'action changent d'un métier à l'autre.</p>
  <div class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    ${cat.univers.map(u => `<a href="/univers/${u.slug}/" class="flex items-start gap-4 rounded-2xl border border-line p-5 hover:border-ink hover:shadow-pill transition-shadow">
      <span class="grid place-items-center w-12 h-12 rounded-xl bg-mist shrink-0">${icon(u.slug, 'w-6 h-6', 1.7)}</span>
      <span class="min-w-0"><span class="flex justify-between gap-3 font-semibold"><span>${esc(u.label)}</span><span class="text-ink/45 font-normal">${counts[u.slug] || 0}</span></span><span class="block mt-1 text-[15px] text-ink/60 leading-snug">${esc(u.description)}</span></span></a>`).join('')}
  </div>
</section>`;
}

// ---------- Template page ----------
const waitlist = t => `<form class="kv-waitlist mt-4 rounded-2xl border border-line p-5" data-waitlist="${t.slug}">
  <p class="font-semibold">Les ventes ouvrent bientôt</p>
  <p class="mt-1 text-[15px] text-ink/60">Laissez votre e-mail : un seul message, le jour de l'ouverture.</p>
  <label class="hidden" aria-hidden="true">Site<input name="site" tabindex="-1" autocomplete="off"></label>
  <div class="mt-3 flex gap-2"><label class="flex-1 min-w-0"><span class="sr-only">Votre e-mail</span><input name="email" type="email" required autocomplete="email" placeholder="vous@exemple.fr" class="kv-input w-full"></label><button class="h-12 px-4 rounded-xl bg-ink text-white font-semibold shrink-0">Me prévenir</button></div>
  <p class="mt-2 text-sm" role="status" data-waitlist-msg></p>
</form>`;
export function templatePage(t, univMap, related, site) {
  const univ = t.univers.map(s => univMap[s]).filter(Boolean);
  const salesOpen = site.ventes_ouvertes && t.shopify_url;
  const buy = salesOpen
    ? `<a href="${esc(t.shopify_url)}" class="flex items-center justify-center h-14 rounded-xl bg-sign text-white font-semibold text-lg hover:bg-sign-deep">Acheter</a>`
    : `<p class="flex items-center justify-center h-14 rounded-xl bg-mist text-ink/60 font-semibold">Bientôt en vente</p>`;
  const perk = (ic, title, text) => `<li class="flex gap-4"><span class="mt-0.5 text-ink">${icon(ic, 'w-7 h-7', 1.6)}</span><div><p class="font-semibold">${title}</p><p class="text-ink/60 text-[15px] leading-snug">${text}</p></div></li>`;
  const slides = [
    ['thumb.jpg', `Aperçu ordinateur du template ${t.title}`],
    ['phone.jpg', `Aperçu téléphone du template ${t.title}`],
  ];
  return `
<article class="mx-auto max-w-[1120px] md:px-6 lg:px-10 md:pt-6">
  <!-- Galerie : plein écran à faire glisser sur téléphone, grille sur ordinateur -->
  <div class="relative md:hidden">
    <div class="kv-slides flex overflow-x-auto snap-x snap-mandatory no-scrollbar aspect-[4/3] bg-mist" data-gallery>
      ${slides.map(([f, a], i) => `<img src="/templates/${t.slug}/${f}" alt="${esc(a)}" width="800" height="600" ${i ? 'loading="lazy"' : ''} class="snap-center shrink-0 w-full h-full object-cover object-top">`).join('')}
    </div>
    <a href="/" class="absolute top-3 left-3 grid place-items-center w-11 h-11 rounded-full bg-white shadow" aria-label="Retour aux templates" data-back>${icon('back', 'w-5 h-5', 2.4)}</a>
    <button type="button" class="kv-heart-plain absolute top-3 right-3 grid place-items-center w-11 h-11 rounded-full bg-white shadow" aria-pressed="false" aria-label="Ajouter aux favoris" data-fav="${t.slug}">${icon('heart', 'w-5 h-5', 2)}</button>
    <span class="absolute bottom-3 right-3 rounded-md bg-black/60 text-white text-xs font-semibold px-2.5 py-1" data-gallery-count>1 / ${slides.length}</span>
  </div>

  <div class="px-4 md:px-0">
    <nav class="hidden md:block text-sm text-ink/55" aria-label="Fil d'Ariane"><a href="/" class="hover:text-ink">Accueil</a> / <a href="/univers/${univ[0]?.slug}/" class="hover:text-ink">${esc(univ[0]?.label)}</a> / <span class="text-ink">${esc(t.title)}</span></nav>
    <div class="mt-5 md:mt-3 flex items-start justify-between gap-4">
      <h1 class="font-display font-bold text-[1.7rem] md:text-[2rem] leading-tight tracking-tight">${esc(t.title)}, site vitrine pour ${esc(metier(t).toLowerCase())}</h1>
      <button type="button" class="kv-heart-plain hidden md:flex items-center gap-2 shrink-0 px-3 py-2 rounded-lg hover:bg-mist font-semibold underline underline-offset-4" aria-pressed="false" aria-label="Ajouter aux favoris" data-fav="${t.slug}">${icon('heart', 'w-5 h-5', 2)}<span>Enregistrer</span></button>
    </div>
  </div>

  <div class="hidden md:grid mt-6 grid-cols-[2fr_1fr] gap-2 rounded-2xl overflow-hidden h-[440px]">
    <a href="/demo/${t.slug}/" target="_blank" rel="noopener" class="block bg-mist overflow-hidden"><img src="/templates/${t.slug}/thumb.jpg" alt="${esc(slides[0][1])}" width="800" height="600" class="w-full h-full object-cover object-top hover:opacity-95"></a>
    <a href="/demo/${t.slug}/" target="_blank" rel="noopener" class="block bg-mist overflow-hidden"><img src="/templates/${t.slug}/phone.jpg" alt="${esc(slides[1][1])}" width="800" height="600" class="w-full h-full object-cover hover:opacity-95"></a>
  </div>

  <div class="px-4 md:px-0 mt-6 md:mt-10 grid md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_380px] gap-10 lg:gap-20 items-start">
    <div class="min-w-0">
      <p class="text-lg font-semibold">${esc(univ.map(u => u.label).join(' · '))}</p>
      <p class="text-ink/60">${pagesLabel(t.pages)} · style ${esc(t.style.toLowerCase())} · HTML + Tailwind CSS</p>
      <ul class="mt-6 py-6 border-y border-line space-y-5">
        ${perk('phone', 'Pensé d\'abord pour le téléphone', 'Barre d\'appel fixe en bas d\'écran, boutons faciles à toucher, page courte.')}
        ${perk('edit', 'Textes modifiables en un clic', 'Ouvrez le mode édition, cliquez sur un texte, tapez. Aucun logiciel à installer.')}
        ${perk('bolt', 'Rapide et sans entretien', 'Du HTML statique : pas de base de données, pas d\'extension à mettre à jour.')}
      </ul>
      <p class="mt-6 leading-relaxed text-ink/85">${esc(t.description)}</p>

      <h2 class="mt-10 font-display font-bold text-2xl">Voir la page entière</h2>
      <div class="mt-4 inline-flex rounded-full bg-mist p-1" role="tablist" aria-label="Type d'écran">
        <button type="button" role="tab" aria-selected="true" class="kv-tab flex items-center gap-2 h-11 px-4 rounded-full font-semibold" data-view="phone">${icon('phone', 'w-5 h-5')}Téléphone</button>
        <button type="button" role="tab" aria-selected="false" class="kv-tab flex items-center gap-2 h-11 px-4 rounded-full font-semibold" data-view="desktop">${icon('desktop', 'w-5 h-5')}Ordinateur</button>
      </div>
      <div class="mt-4 rounded-2xl border border-line bg-mist overflow-hidden">
        <div class="h-[560px] overflow-y-auto overscroll-contain flex justify-center" data-viewport tabindex="0" aria-label="Aperçu de la page entière, faites défiler">
          <img src="/templates/${t.slug}/phone-full.jpg" alt="Page entière sur téléphone" width="390" loading="lazy" class="w-[300px] sm:w-[340px] h-auto self-start shadow-sm" data-view-img="phone">
          <img src="/templates/${t.slug}/full.jpg" alt="Page entière sur ordinateur" width="1000" loading="lazy" class="hidden w-full h-auto self-start" data-view-img="desktop">
        </div>
      </div>

      <h2 class="mt-10 font-display font-bold text-2xl">Sections incluses</h2>
      <ul class="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-3">${t.sections.map(s => `<li class="flex gap-3">${icon('check', 'w-5 h-5 mt-0.5 shrink-0 text-sign', 2.4)}<span>${esc(s)}</span></li>`).join('')}</ul>

      <h2 class="mt-10 font-display font-bold text-2xl">Dans le fichier .zip</h2>
      <ul class="mt-4 space-y-4">
        ${perk('zip', 'Le site prêt à publier', 'index.html, feuille de style compilée et illustrations.')}
        ${perk('edit', 'MODIFIER-MON-SITE.html', 'Le mode édition pour changer les textes dans le navigateur.')}
        ${perk('font', 'Les polices, hébergées avec le site', 'Aucun appel à Google Fonts, plus simple pour le RGPD.')}
        ${perk('book', 'Un guide en français et la licence', 'Et les sources Tailwind pour changer les couleurs.')}
      </ul>
      ${!salesOpen && site.messagerie_active ? `<div class="md:hidden mt-10" id="prevenu">${waitlist(t)}</div>` : ''}
      <div class="mt-8 flex items-center gap-3"><span class="text-[15px] text-ink/60">Couleurs :</span>${t.palette.map(c => `<span class="w-7 h-7 rounded-full border border-black/10" style="background:${c}" title="${c}"></span>`).join('')}</div>
    </div>

    <aside class="hidden md:block sticky top-28">
      <div class="rounded-2xl border border-line p-6 shadow-card">
        <p><span class="font-display font-bold text-2xl">${euro(t.prix)}</span> <span class="text-ink/60">· licence pour un site</span></p>
        <div class="mt-5 grid gap-3">
          <a href="/demo/${t.slug}/" target="_blank" rel="noopener" class="flex items-center justify-center h-14 rounded-xl bg-ink text-white font-semibold text-lg hover:bg-black">Ouvrir la démo</a>
          ${buy}
        </div>
        <p class="mt-4 text-center text-sm text-ink/60">Téléchargement immédiat après le paiement</p>
        <ul class="mt-5 pt-5 border-t border-line space-y-2 text-[15px]">
          <li><a href="/demo/${t.slug}/#edition" target="_blank" rel="noopener" class="underline underline-offset-4 hover:text-sign">Essayer le mode édition</a></li>
          <li><a href="/guide/" class="underline underline-offset-4 hover:text-sign">Comment le mettre en ligne</a></li>
          ${site.messagerie_active ? '<li><button type="button" class="underline underline-offset-4 hover:text-sign" data-open-chat>Poser une question</button></li>' : ''}
        </ul>
      </div>
      ${!salesOpen && site.messagerie_active ? waitlist(t) : ''}
    </aside>
  </div>
</article>

${related.length ? `<section class="mx-auto max-w-[1120px] px-4 md:px-6 lg:px-10 mt-14 pt-10 border-t border-line">
  <h2 class="font-display font-bold text-2xl">Dans la même famille</h2>
  <div class="mt-6 -mx-4 px-4 md:mx-0 md:px-0 flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-4 no-scrollbar">${related.map(r => `<div class="snap-start shrink-0 w-[78%] min-[560px]:w-[46%] md:w-auto">${card(r, univMap)}</div>`).join('')}</div>
</section>` : ''}

<!-- Barre fixe téléphone : prix + démo -->
<div class="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-4">
  <div class="min-w-0"><p class="font-semibold">${euro(t.prix)} <span class="font-normal text-ink/60">· un site</span></p><p class="text-sm ${salesOpen ? 'text-sign' : 'text-ink/60'} underline underline-offset-2">${salesOpen ? `<a href="${esc(t.shopify_url)}">Acheter maintenant</a>` : (site.messagerie_active ? '<a href="#prevenu">Être prévenu de l\'ouverture</a>' : 'Bientôt en vente')}</p></div>
  <a href="/demo/${t.slug}/" class="flex items-center h-12 px-6 rounded-xl bg-sign text-white font-semibold shrink-0">Voir la démo</a>
</div>`;
}

export function textPage(title, html) {
  return `<section class="mx-auto max-w-3xl px-4 sm:px-6 pt-8 md:pt-10"><h1 class="font-display font-bold text-3xl sm:text-4xl tracking-tight">${esc(title)}</h1><div class="prose-kv mt-8 text-[17px]">${html}</div></section>`;
}
export function guidePage() {
  const fig = (src, alt, caption, w, h) => `<figure class="mt-6"><img src="/assets/guide/${src}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" class="w-full rounded-md border border-line bg-mist"><figcaption class="mt-2 text-sm text-ink/60">${caption}</figcaption></figure>`;
  const step = (n, title, body) => `<li class="grid sm:grid-cols-[3.5rem_1fr] gap-x-6 pt-12 first:pt-0"><p class="font-display font-extrabold text-5xl text-sign leading-none" aria-hidden="true">${n}</p><div><h2 class="font-display font-bold text-2xl sm:text-3xl">${title}</h2><div class="mt-4 space-y-4 text-[17px] leading-relaxed text-ink/80">${body}</div></div></li>`;
  return `
<section class="mx-auto max-w-4xl px-4 sm:px-6 pt-8 md:pt-10">
  <h1 class="font-display font-bold text-3xl sm:text-4xl tracking-tight">Personnaliser et mettre en ligne votre site</h1>
  <p class="mt-4 text-lg text-ink/70 max-w-2xl">Aucune connaissance technique nécessaire. Comptez une trentaine de minutes entre le téléchargement et votre site en ligne.</p>
  <ol class="mt-14 border-t border-line pt-12">
    ${step(1, 'Ouvrir le dossier', `
      <p>Après l'achat, vous recevez un lien de téléchargement. Enregistrez le fichier .zip, puis faites un clic droit et <strong>Extraire tout</strong> (Windows) ou double-cliquez dessus (Mac). Vous obtenez un dossier qui contient tout le site.</p>
      ${fig('g-dossier.svg', 'Le fichier zip devient un dossier contenant index.html, MODIFIER-MON-SITE.html et les autres fichiers', 'Le fichier à ouvrir pour modifier vos textes est surligné.', 720, 360)}`)}
    ${step(2, 'Modifier les textes, directement sur la page', `
      <p>Double-cliquez sur <strong>MODIFIER-MON-SITE.html</strong> : votre site s'ouvre dans votre navigateur avec un bandeau « Mode édition ». Cliquez sur n'importe quel texte et tapez par-dessus : nom, slogan, tarifs, horaires, avis, questions fréquentes.</p>
      ${fig('g-edition.jpg', 'Capture du mode édition : le titre de la page est sélectionné et remplacé par un nouveau texte', 'Le texte en cours de modification est encadré en jaune. Les pointillés montrent ce qui est modifiable.', 1200, 680)}
      <p>Le numéro de téléphone et l'adresse e-mail se mettent à jour partout où l'on clique dessus. Vous pouvez essayer ce mode sur la démo de chaque template avant d'acheter, avec le bouton <strong>Essayer l'édition</strong>.</p>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Photos et logo</strong> : cliquez sur une image encadrée de jaune et choisissez une photo de votre ordinateur ou de votre téléphone. Elle est redimensionnée et intégrée à la page.</li>
        <li><strong>Carte</strong> : bouton « Modifier l'adresse » sur le plan. Pour vos visiteurs, le plan se charge seulement quand ils cliquent sur « Afficher le plan » (pas de cookie Google sans leur accord).</li>
        <li><strong>Liens</strong> (Instagram, Facebook, réservation en ligne…) : cliquez sur le lien puis sur « Modifier le lien ».</li>
        <li><strong>Couleurs</strong> : bouton « Couleurs » dans le bandeau, puis choisissez vos teintes. « Couleurs d'origine » annule.</li>
      </ul>`)}
    ${step(3, 'Enregistrer vos modifications', `
      <p>Cliquez sur <strong>Télécharger ma page</strong>. Un fichier <strong>index.html</strong> arrive dans vos Téléchargements : déplacez-le dans le dossier du site et acceptez de remplacer l'ancien.</p>
      ${fig('g-telecharger.jpg', 'Le bandeau du mode édition avec le bouton Télécharger ma page', 'Pensez à télécharger avant de fermer l\'onglet : le navigateur vous prévient s\'il reste des modifications.', 800, 90)}`)}
    ${step(4, 'Mettre le site en ligne avec Netlify Drop', `
      <p>C'est la solution la plus simple, et elle est gratuite. Ouvrez <strong>app.netlify.com/drop</strong> et glissez le dossier du site dans la zone prévue. Pas besoin de compte pour commencer.</p>
      ${fig('g-drop.svg', 'Illustration : le dossier du site est glissé dans la zone de dépôt de Netlify Drop', 'Glissez le dossier entier, pas seulement le fichier index.html.', 720, 400)}
      <p>Votre site est en ligne en quelques secondes, à une adresse attribuée automatiquement. <strong>Créez un compte gratuit</strong> pour le conserver : vous pourrez ensuite renommer l'adresse, et republier en glissant à nouveau le dossier après chaque modification.</p>
      ${fig('g-enligne.svg', 'Illustration : la page de confirmation avec l\'adresse du site en netlify.app', 'Illustration simplifiée : les écrans de Netlify peuvent évoluer, mais les étapes restent les mêmes.', 720, 400)}
      <p>Vous avez déjà un hébergeur (OVH, o2switch, Ionos…) ? Envoyez le contenu du dossier par FTP ou par le gestionnaire de fichiers de votre espace client.</p>`)}
    ${step(5, 'Relier le formulaire de contact', `
      <p>Le formulaire n'envoie rien tant qu'il n'est pas relié à un service. Sur Netlify, ouvrez <strong>index.html</strong> avec le Bloc-notes, cherchez <code class="bg-mist px-1 rounded">&lt;form</code> et ajoutez <code class="bg-mist px-1 rounded">data-netlify="true"</code> juste après. Les messages arrivent dans votre espace Netlify et par e-mail. Ailleurs, utilisez Formspree (gratuit) et remplacez <code class="bg-mist px-1 rounded">action="#"</code> par l'adresse qu'il vous donne.</p>`)}
    ${step(6, 'Ajouter vos mentions légales et votre adresse', `
      <p>Les mentions légales sont obligatoires pour un site professionnel en France : nom ou raison sociale, adresse, SIRET, contact et hébergeur. Le lien prévu en bas de page est là pour ça.</p>
      <p>Pour une adresse à votre nom (moncabinet.fr), achetez le nom de domaine chez un registraire (une dizaine d'euros par an), puis reliez-le depuis les réglages de votre site sur Netlify.</p>`)}
  </ol>
  <div class="mt-16 rounded-md border border-line bg-mist p-6">
    <h2 class="font-display font-bold text-xl">Pour aller plus loin : polices et mise en page</h2>
    <p class="mt-2 text-ink/75 leading-relaxed">Les couleurs se changent directement dans le mode édition. Pour changer les polices ou la mise en page, les sources sont dans <strong>sources-tailwind/</strong> et la feuille de style se recompile avec Node.js en deux commandes. Tout est expliqué dans le fichier LISEZMOI.md du dossier.</p>
  </div>
</section>`;
}
