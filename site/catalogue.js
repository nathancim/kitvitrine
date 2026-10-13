// Client-side search and filters for /catalogue/. Data: /data/catalog.json
(async () => {
  const norm = s => (s || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const $ = id => document.getElementById(id);
  const PAGE = 24;
  let shown = PAGE;

  const data = await fetch('/data/catalog.json').then(r => r.json());
  const univ = Object.fromEntries(data.univers.map(u => [u.slug, u]));
  const items = data.templates.map(t => ({
    ...t,
    _text: norm([t.title, t.tagline, t.description, t.style, t.couleur, ...(t.tags || []), ...t.univers.map(s => univ[s]?.label + ' ' + univ[s]?.description)].join(' '))
  }));

  const q = $('q'), sort = $('sort'), grid = $('grid');
  const boxes = [...document.querySelectorAll('#filters input[type=checkbox]')];

  // Restore state from URL
  const params = new URLSearchParams(location.search);
  q.value = params.get('q') || '';
  sort.value = params.get('tri') || 'recent';
  boxes.forEach(b => { if (params.getAll(b.name).includes(b.value)) b.checked = true; });

  const selected = name => boxes.filter(b => b.name === name && b.checked).map(b => b.value);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const card = t => `<article class="card group">
    <a href="/templates/${t.slug}/" class="card-thumb"><img src="/templates/${t.slug}/thumb.jpg" alt="Aperçu du template ${esc(t.title)}" loading="lazy" width="800" height="600"></a>
    <div class="mt-3 flex items-start justify-between gap-3"><div>
      <h3 class="font-display font-bold text-lg leading-tight"><a href="/templates/${t.slug}/" class="hover:text-sign">${esc(t.title)}</a></h3>
      <p class="text-sm text-ink/60 mt-0.5">${esc(t.tagline)}</p></div>
      <p class="font-display font-bold shrink-0">${t.prix} €</p></div>
    <p class="mt-2 text-xs text-ink/55">${esc(univ[t.univers[0]]?.label || '')} · ${t.pages} page${t.pages > 1 ? 's' : ''} · ${esc(t.style)}</p>
  </article>`;

  function render(resetPaging = true) {
    if (resetPaging) shown = PAGE;
    const terms = norm(q.value).split(/\s+/).filter(Boolean);
    const fu = selected('univers'), fs = selected('style'), fc = selected('couleur'), fp = selected('pages');

    let res = items.filter(t =>
      terms.every(w => t._text.includes(w)) &&
      (!fu.length || t.univers.some(s => fu.includes(s))) &&
      (!fs.length || fs.includes(t.style)) &&
      (!fc.length || fc.includes(t.couleur)) &&
      (!fp.length || fp.some(p => p === '1' ? t.pages === 1 : t.pages > 1))
    );
    const s = sort.value;
    res.sort((a, b) => s === 'prix-asc' ? a.prix - b.prix : s === 'prix-desc' ? b.prix - a.prix : s === 'az' ? a.title.localeCompare(b.title, 'fr') : b.date.localeCompare(a.date));

    grid.innerHTML = res.slice(0, shown).map(card).join('');
    $('count').textContent = `${res.length} template${res.length > 1 ? 's' : ''}`;
    $('empty').classList.toggle('hidden', res.length > 0);
    $('more').classList.toggle('hidden', res.length <= shown);

    boxes.forEach(b => b.parentElement.classList.toggle('chip-on', b.checked));
    const n = boxes.filter(b => b.checked).length;
    $('fcount').textContent = n; $('fcount').classList.toggle('hidden', !n);

    const p = new URLSearchParams();
    if (q.value.trim()) p.set('q', q.value.trim());
    if (s !== 'recent') p.set('tri', s);
    boxes.filter(b => b.checked).forEach(b => p.append(b.name, b.value));
    history.replaceState(null, '', p.toString() ? '?' + p : location.pathname);
  }

  let timer;
  q.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(render, 120); });
  sort.addEventListener('change', () => render());
  boxes.forEach(b => b.addEventListener('change', () => render()));
  $('more').addEventListener('click', () => { shown += PAGE; render(false); });
  const reset = () => { boxes.forEach(b => b.checked = false); q.value = ''; render(); q.focus(); };
  $('reset').addEventListener('click', reset);
  $('reset2').addEventListener('click', reset);
  $('filtersBtn').addEventListener('click', e => {
    const f = $('filters'); const open = f.classList.toggle('hidden') === false;
    e.currentTarget.setAttribute('aria-expanded', open);
  });

  render();
})();
