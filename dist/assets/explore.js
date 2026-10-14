// Kit Vitrine — recherche, filtres, favoris et petits comportements d'interface.
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const norm = s => (s || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  // ---------- Favoris (stockage local, tolérant aux navigateurs qui le bloquent) ----------
  const FKEY = 'kv-favoris';
  const readFavs = () => { try { return JSON.parse(localStorage.getItem(FKEY)) || []; } catch { return []; } };
  const writeFavs = f => { try { localStorage.setItem(FKEY, JSON.stringify(f)); } catch { /* stockage indisponible */ } };
  let favs = readFavs();
  const paintFavs = () => {
    $$('[data-fav]').forEach(b => {
      const on = favs.includes(b.dataset.fav);
      b.setAttribute('aria-pressed', on);
      const lbl = b.getAttribute('aria-label') || '';
      b.setAttribute('aria-label', on ? lbl.replace(/^Ajouter/, 'Retirer').replace(/aux favoris$/, 'des favoris') : lbl.replace(/^Retirer/, 'Ajouter').replace(/des favoris$/, 'aux favoris'));
    });
    $$('.kv-fav-count').forEach(c => { c.textContent = favs.length; c.classList.toggle('hidden', !favs.length); });
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-fav]');
    if (!b) return;
    e.preventDefault();
    const s = b.dataset.fav;
    favs = favs.includes(s) ? favs.filter(x => x !== s) : [...favs, s];
    writeFavs(favs); paintFavs();
    if (explore && explore.hasAttribute('data-favoris')) apply(false);
  });

  // ---------- Points des mini-carrousels et compteur de galerie ----------
  const syncDots = el => {
    const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    const dots = el.parentElement.querySelector('.kv-dots');
    if (dots) [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
    const cnt = el.parentElement.querySelector('[data-gallery-count]');
    if (cnt) cnt.textContent = `${i + 1} / ${el.children.length}`;
  };
  document.addEventListener('scroll', e => { if (e.target.classList && e.target.classList.contains('kv-slides')) syncDots(e.target); }, true);

  // ---------- Onglets téléphone / ordinateur (page template) ----------
  $$('.kv-tab').forEach(t => t.addEventListener('click', () => {
    $$('.kv-tab').forEach(x => x.setAttribute('aria-selected', x === t));
    $$('[data-view-img]').forEach(img => img.classList.toggle('hidden', img.dataset.viewImg !== t.dataset.view));
    const vp = $('[data-viewport]'); if (vp) vp.scrollTop = 0;
  }));
  const back = $('[data-back]');
  if (back) back.addEventListener('click', e => { if (document.referrer.startsWith(location.origin)) { e.preventDefault(); history.back(); } });

  // ---------- Exploration : recherche + filtres ----------
  const explore = $('[data-explore]');
  const sheet = $('dialog.kv-sheet');
  paintFavs();
  if (!explore) {
    // Ailleurs, la barre de recherche renvoie simplement vers l'accueil (comportement du formulaire).
    $$('[data-open-filters]').forEach(b => b.addEventListener('click', () => { location.href = '/?filtres=1'; }));
    return;
  }

  const grid = $('[data-grid]', explore);
  const cards = $$('.kv-card', grid);
  const PAGE = 24;
  let shown = PAGE;
  const current = explore.dataset.current || '';
  const qInputs = $$('.kv-q');
  const params = new URLSearchParams(location.search);
  const state = { q: params.get('q') || '', style: params.getAll('style'), couleur: params.getAll('couleur'), pages: params.getAll('pages'), tri: params.get('tri') || 'recent' };
  qInputs.forEach(i => { i.value = state.q; });

  const chipInputs = sheet ? $$('input[type=checkbox]', sheet) : [];
  const syncSheet = () => {
    chipInputs.forEach(i => { i.checked = state[i.name].includes(i.value); i.parentElement.classList.toggle('on', i.checked); });
    if (sheet) $$('input[name=tri]', sheet).forEach(r => { r.checked = r.value === state.tri; });
  };
  const readSheet = () => {
    ['style', 'couleur', 'pages'].forEach(k => { state[k] = chipInputs.filter(i => i.name === k && i.checked).map(i => i.value); });
    const r = sheet && $('input[name=tri]:checked', sheet); state.tri = r ? r.value : 'recent';
  };

  const matches = (c, st) => {
    const terms = norm(st.q).split(/\s+/).filter(Boolean);
    const d = c.dataset;
    return terms.every(w => d.text.includes(w)) &&
      (!current || d.u.split(' ').includes(current)) &&
      (!st.style.length || st.style.includes(d.style)) &&
      (!st.couleur.length || st.couleur.includes(d.couleur)) &&
      (!st.pages.length || st.pages.some(p => p === '1' ? d.pages === '1' : +d.pages > 1)) &&
      (!explore.hasAttribute('data-favoris') || favs.includes(d.slug));
  };
  const sorters = {
    recent: (a, b) => b.dataset.date.localeCompare(a.dataset.date),
    'prix-asc': (a, b) => a.dataset.prix - b.dataset.prix,
    'prix-desc': (a, b) => b.dataset.prix - a.dataset.prix,
    az: (a, b) => a.dataset.title.localeCompare(b.dataset.title, 'fr'),
  };

  const summary = () => {
    const n = state.style.length + state.couleur.length + state.pages.length;
    $$('[data-filter-count]').forEach(b => { b.textContent = n; b.classList.toggle('hidden', !n); });
    const styleTxt = state.style.length ? state.style.join(', ') : 'Tous les styles';
    const pagesTxt = state.pages.length === 1 ? (state.pages[0] === '1' ? 'Une page' : 'Plusieurs pages') : 'Indifférent';
    $$('[data-summary-style]').forEach(e => { e.textContent = styleTxt; });
    $$('[data-summary-pages]').forEach(e => { e.textContent = pagesTxt; });
    $$('[data-summary-mobile]').forEach(e => { e.textContent = `${state.style.length ? styleTxt : 'Tous les styles'} · ${state.pages.length === 1 ? pagesTxt.toLowerCase() : 'toutes les tailles'}`; });
  };

  function apply(resetPaging = true) {
    if (resetPaging) shown = PAGE;
    const ok = cards.filter(c => matches(c, state)).sort(sorters[state.tri] || sorters.recent);
    ok.forEach(c => grid.appendChild(c));
    cards.forEach(c => { c.hidden = true; });
    ok.slice(0, shown).forEach(c => { c.hidden = false; });
    const fav = explore.hasAttribute('data-favoris');
    $('[data-count]', explore).textContent = ok.length ? `${ok.length} template${ok.length > 1 ? 's' : ''}${fav ? ' en favori' : ''}` : '';
    $('[data-empty]', explore).classList.toggle('hidden', ok.length > 0);
    $('[data-more]', explore).classList.toggle('hidden', ok.length <= shown);
    const live = sheet && $('[data-apply]', sheet);
    if (live) {
      const preview = cards.filter(c => matches(c, { ...state, ...pendingSheetState() })).length;
      live.textContent = preview ? `Afficher ${preview} template${preview > 1 ? 's' : ''}` : 'Aucun résultat';
    }
    summary();
    const p = new URLSearchParams();
    if (state.q.trim()) p.set('q', state.q.trim());
    ['style', 'couleur', 'pages'].forEach(k => state[k].forEach(v => p.append(k, v)));
    if (state.tri !== 'recent') p.set('tri', state.tri);
    history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
  }
  const pendingSheetState = () => {
    if (!sheet || !sheet.open) return {};
    const st = {}; ['style', 'couleur', 'pages'].forEach(k => { st[k] = chipInputs.filter(i => i.name === k && i.checked).map(i => i.value); });
    return st;
  };

  // Recherche en direct, champs synchronisés
  let timer;
  qInputs.forEach(i => i.addEventListener('input', () => {
    state.q = i.value; qInputs.forEach(o => { if (o !== i) o.value = i.value; });
    clearTimeout(timer); timer = setTimeout(() => apply(), 120);
  }));
  $$('form[role=search]').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); apply(); grid.scrollIntoView({ behavior: 'smooth', block: 'start' }); document.activeElement.blur(); }));

  // Feuille de filtres
  if (sheet) {
    $$('[data-open-filters]').forEach(b => b.addEventListener('click', () => { syncSheet(); sheet.showModal(); apply(false); }));
    chipInputs.forEach(i => i.addEventListener('change', () => { i.parentElement.classList.toggle('on', i.checked); apply(false); }));
    sheet.addEventListener('close', () => { if (sheet.returnValue === 'ok') { readSheet(); apply(); } else { syncSheet(); summary(); } });
    sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close('cancel'); });
  }
  $$('[data-reset]').forEach(b => b.addEventListener('click', () => {
    state.q = ''; state.style = []; state.couleur = []; state.pages = []; state.tri = 'recent';
    qInputs.forEach(i => { i.value = ''; }); syncSheet(); apply(false);
  }));
  $('[data-more]', explore).addEventListener('click', () => { shown += PAGE; apply(false); });

  syncSheet();
  apply();
  if (params.get('filtres') === '1' && sheet) { sheet.showModal(); }
})();
