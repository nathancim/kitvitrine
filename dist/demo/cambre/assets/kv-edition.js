/* Kit Vitrine — mode édition intégré (version 2 : textes, photos, logo, carte, liens, couleurs).
   Ouvrez MODIFIER-MON-SITE.html (ou ajoutez #edition à l'adresse de index.html).
   - Textes : cliquez et tapez.
   - Photos et logo : cliquez sur l'image, choisissez une photo (elle est redimensionnée et intégrée à la page).
   - Carte : bouton « Modifier l'adresse ».
   - Liens (réseaux sociaux, réservation…) : cliquez sur le lien puis « Modifier le lien ».
   - Couleurs : bouton « Couleurs » dans la barre.
   Puis « Télécharger ma page » et remplacez votre index.html.
   Hors mode édition, ce script affiche seulement les cartes (chargées au clic, pour le respect de la vie privée). */
(function () {
  'use strict';
  var TEXT_TAGS = 'h1,h2,h3,h4,h5,h6,p,li,a,span,strong,em,dt,dd,blockquote,figcaption,summary,button,label,td,th,small,cite';
  var active = false, dirty = false, bar = null, linkTip = null, currentLink = null;
  var isDemo = !!document.querySelector('[data-kv-demo]');
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var ui = function (el) { el.setAttribute('data-kv-ui', ''); return el; };

  // ---------------------------------------------------------------- Carte (toujours active)
  function mapUrl(addr) { return 'https://www.google.com/maps?q=' + encodeURIComponent(addr) + '&output=embed'; }
  function renderMap(el) {
    var addr = el.getAttribute('data-kv-map') || '';
    $$('[data-kv-gen]', el).forEach(function (n) { n.remove(); });
    var box = document.createElement('div');
    box.setAttribute('data-kv-gen', '');
    box.style.cssText = 'position:relative;width:100%;height:100%;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px 14px;padding:10px 14px;text-align:center;background:repeating-linear-gradient(45deg,rgba(127,127,127,.08) 0 12px,rgba(127,127,127,.03) 12px 24px);border-radius:inherit;font:500 15px/1.4 system-ui,sans-serif;color:inherit';
    box.innerHTML = '<a target="_blank" rel="noopener" title="Ouvrir dans Google Maps" style="display:inline-flex;align-items:center;gap:6px;min-height:44px;color:inherit;text-decoration:underline;text-underline-offset:3px"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg><span class="kv-map-addr"></span></a>' +
      '<button type="button" style="min-height:44px;padding:0 18px;border-radius:999px;border:1.5px solid currentColor;background:transparent;color:inherit;font:600 15px system-ui,sans-serif;cursor:pointer">Afficher le plan</button>';
    box.querySelector('.kv-map-addr').textContent = addr;
    box.querySelector('a').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(addr);
    box.querySelector('button').addEventListener('click', function () {
      if (active) return;
      var f = document.createElement('iframe');
      f.setAttribute('data-kv-gen', '');
      f.title = 'Plan : ' + addr; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
      f.src = mapUrl(addr);
      f.style.cssText = 'display:block;width:100%;height:100%;min-height:240px;border:0;border-radius:inherit';
      box.replaceWith(f);
    });
    el.appendChild(box);
    if (active) {
      var edit = ui(document.createElement('button'));
      edit.type = 'button'; edit.className = 'kv-map-edit'; edit.textContent = 'Modifier l\'adresse';
      edit.addEventListener('click', function (e) {
        e.preventDefault();
        var v = prompt('Adresse affichée sur la carte :', el.getAttribute('data-kv-map') || '');
        if (v && v.trim()) { el.setAttribute('data-kv-map', v.trim()); dirty = true; renderMap(el); }
      });
      box.appendChild(edit);
    }
  }
  function renderMaps() { $$('[data-kv-map]').forEach(renderMap); }

  // ---------------------------------------------------------------- Mode édition
  function hasOwnText(el) {
    for (var i = 0; i < el.childNodes.length; i++) { var n = el.childNodes[i]; if (n.nodeType === 3 && n.textContent.trim()) return true; }
    return false;
  }
  function editable() {
    return $$(TEXT_TAGS, document.body).filter(function (el) {
      return !el.closest('[data-kv-ui],[data-kv-demo],[data-kv-gen],script,style,svg,select,option') && hasOwnText(el);
    });
  }
  function syncLink(a) {
    var t = a.textContent.trim(), h = a.getAttribute('href') || '';
    if (/^tel:/i.test(h)) { var d = t.replace(/[^\d+]/g, ''); if (d.charAt(0) === '0') d = '+33' + d.slice(1); if (d) a.setAttribute('href', 'tel:' + d); }
    else if (/^mailto:/i.test(h) && /@/.test(t)) a.setAttribute('href', 'mailto:' + t);
  }
  function blockNav(e) {
    if (!active) return;
    var a = e.target.closest && e.target.closest('a');
    if (a && !a.closest('[data-kv-ui]')) e.preventDefault();
    if (e.target.closest && e.target.closest('summary')) e.preventDefault();
  }

  // Photos et logo
  var picker = null, pickTarget = null;
  function imageTargets() {
    return $$('[data-kv-image],[data-kv-logo],img').filter(function (el) {
      if (el.closest('[data-kv-ui],[data-kv-demo],[data-kv-gen]')) return false;
      if (el.tagName === 'IMG' && el.parentElement && el.parentElement.closest('[data-kv-image],[data-kv-logo]')) return false;
      return true;
    });
  }
  function resize(file, isLogo, done) {
    var img = new Image(), url = URL.createObjectURL(file);
    img.onload = function () {
      var max = isLogo ? 480 : 1600, w = img.naturalWidth, h = img.naturalHeight, k = Math.min(1, max / Math.max(w, h));
      var c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      done(isLogo || /png|svg|webp/.test(file.type) && isLogo ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = function () { URL.revokeObjectURL(url); alert('Ce fichier n\'est pas une image lisible. Essayez une photo JPG ou PNG.'); };
    img.src = url;
  }
  function applyImage(el, data) {
    var isLogo = el.hasAttribute('data-kv-logo');
    var alt = el.getAttribute('data-kv-image') || el.getAttribute('data-kv-logo') || el.getAttribute('alt') || '';
    if (el.tagName === 'IMG') { el.src = data; el.removeAttribute('srcset'); return; }
    var im = document.createElement('img');
    im.src = data; im.alt = alt && alt !== 'true' ? alt : '';
    im.style.cssText = isLogo ? 'display:block;height:100%;max-height:inherit;width:auto;object-fit:contain' : 'display:block;width:100%;height:100%;object-fit:cover;border-radius:inherit';
    if (el.tagName.toLowerCase() === 'svg') {
      var wrap = document.createElement('span');
      wrap.setAttribute(isLogo ? 'data-kv-logo' : 'data-kv-image', alt || 'true');
      wrap.setAttribute('class', el.getAttribute('class') || '');
      wrap.style.display = isLogo ? 'inline-block' : 'block';
      if (isLogo) { wrap.style.width = 'auto'; wrap.style.maxWidth = '180px'; }
      wrap.appendChild(im); el.replaceWith(wrap); markImage(wrap);
    } else { el.innerHTML = ''; el.appendChild(im); }
  }
  function markImage(el) {
    el.setAttribute('data-kv-img', '');
    el.setAttribute('title', el.hasAttribute('data-kv-logo') ? 'Cliquez pour remplacer le logo' : 'Cliquez pour remplacer la photo');
  }
  function onImageClick(e) {
    if (!active) return;
    var el = e.target.closest && e.target.closest('[data-kv-img]');
    if (!el || e.target.closest('[data-kv-ui]')) return;
    e.preventDefault(); e.stopPropagation();
    pickTarget = el; picker.value = ''; picker.click();
  }

  // Liens
  function showLinkTip(a) {
    var h = a.getAttribute('href') || '';
    if (/^(tel:|mailto:|#)/i.test(h) || a.closest('[data-kv-ui]')) { hideLinkTip(); return; }
    currentLink = a;
    var r = a.getBoundingClientRect();
    linkTip.style.top = Math.min(window.innerHeight - 56, r.bottom + 8) + 'px';
    linkTip.style.left = Math.max(8, Math.min(window.innerWidth - 260, r.left)) + 'px';
    linkTip.querySelector('span').textContent = h.length > 32 ? h.slice(0, 32) + '…' : h;
    linkTip.hidden = false;
  }
  function hideLinkTip() { if (linkTip) linkTip.hidden = true; }

  // Couleurs : <meta name="kv-couleurs" content="--kv-a=Libellé|--kv-a-deep;--kv-b=Libellé"> (ajoutée par Kit Vitrine)
  function colorVars() {
    var m = document.querySelector('meta[name="kv-couleurs"]');
    if (!m || !m.content) return [];
    return m.content.split(';').map(function (p) {
      var parts = p.split('|'), kv = parts[0].split('=');
      return { v: kv[0].trim(), label: (kv[1] || kv[0]).trim(), derived: parts.slice(1).map(function (d) { return d.trim(); }).filter(Boolean) };
    }).filter(function (x) { return x.v; });
  }
  function allVars() { var o = []; colorVars().forEach(function (x) { o.push(x.v); o = o.concat(x.derived); }); return o; }
  function getVar(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
  function parseTrip(t) { var p = t.split(/[\s,]+/).map(Number); return p.length >= 3 && !p.some(isNaN) ? p.slice(0, 3) : [0, 0, 0]; }
  function toHex(trip) { return '#' + parseTrip(trip).map(function (n) { return ('0' + n.toString(16)).slice(-2); }).join(''); }
  function hexRgb(hex) { var n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function rgbHsl(c) {
    var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), h = 0, s = 0, l = (mx + mn) / 2, d = mx - mn;
    if (d) { s = d / (1 - Math.abs(2 * l - 1)); h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
    return [h, s, l];
  }
  function hslRgb(c) {
    var h = c[0], s = c[1], l = c[2], k = (1 - Math.abs(2 * l - 1)) * s, x = k * (1 - Math.abs((h / 60) % 2 - 1)), m = l - k / 2, r = 0, g = 0, b = 0;
    if (h < 60) { r = k; g = x; } else if (h < 120) { r = x; g = k; } else if (h < 180) { g = k; b = x; } else if (h < 240) { g = x; b = k; } else if (h < 300) { r = x; b = k; } else { r = k; b = x; }
    return [r, g, b].map(function (v) { return Math.round((v + m) * 255); });
  }
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
  function colorPanel() {
    var vars = colorVars(); if (!vars.length) return null;
    var p = ui(document.createElement('div')); p.className = 'kv-colors'; p.hidden = true;
    p.innerHTML = '<p><strong>Couleurs du site</strong><br><small>Les dessins de la page gardent leurs couleurs d\'origine.</small></p>';
    vars.forEach(function (x) {
      // Écarts d'origine entre la couleur et ses variantes (plus foncée, plus claire…), conservés au changement
      var base0 = rgbHsl(parseTrip(getVar(x.v)));
      var der0 = x.derived.map(function (d) { return { v: d, hsl: rgbHsl(parseTrip(getVar(d))) }; });
      var l = document.createElement('label'); var i = document.createElement('input');
      i.type = 'color'; i.value = toHex(getVar(x.v));
      i.addEventListener('input', function () {
        var rgb = hexRgb(i.value), nb = rgbHsl(rgb), root = document.documentElement.style;
        root.setProperty(x.v, rgb.join(' '));
        der0.forEach(function (d) {
          var h = (nb[0] + d.hsl[0] - base0[0] + 360) % 360;
          root.setProperty(d.v, hslRgb([h, clamp(nb[1] + d.hsl[1] - base0[1]), clamp(nb[2] + d.hsl[2] - base0[2])]).join(' '));
        });
        dirty = true;
      });
      l.appendChild(i); l.appendChild(document.createTextNode(' ' + x.label)); p.appendChild(l);
    });
    var reset = document.createElement('button'); reset.type = 'button'; reset.className = 'kv-reset'; reset.textContent = 'Couleurs d\'origine';
    reset.addEventListener('click', function () {
      allVars().forEach(function (v) { document.documentElement.style.removeProperty(v); });
      var st = document.getElementById('kv-couleurs'); if (st) st.remove();
      $$('input[type=color]', p).forEach(function (inp, k) { inp.value = toHex(getVar(vars[k].v)); });
      dirty = true;
    });
    p.appendChild(reset);
    document.body.appendChild(p);
    return p;
  }

  function css() {
    var s = ui(document.createElement('style'));
    s.textContent =
      '[data-kv-edit]{outline:1px dashed rgba(14,90,71,.45);outline-offset:2px;cursor:text}' +
      '[data-kv-edit]:hover{outline:2px solid #0E5A47}' +
      '[data-kv-edit]:focus{outline:2px solid #F0BE3D;background:rgba(240,190,61,.12)}' +
      '[data-kv-img]{outline:3px dashed #F0BE3D !important;outline-offset:3px;cursor:copy !important}' +
      '[data-kv-img]:hover{outline-style:solid !important;filter:brightness(.92)}' +
      '.kv-bar{position:fixed;left:12px;right:12px;top:12px;z-index:2147483646;max-width:820px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;padding:10px 12px 10px 16px;background:#161B26;color:#fff;border-radius:10px;font:500 14px/1.35 system-ui,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.3)}' +
      '.kv-bar p{margin:0;flex:1 1 280px}.kv-bar button,.kv-tip button,.kv-map-edit{font:600 14px system-ui,sans-serif;border:0;border-radius:6px;padding:9px 14px;min-height:40px;cursor:pointer}' +
      '.kv-dl{background:#F0BE3D;color:#161B26}.kv-quit,.kv-col{background:transparent;color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.35)}' +
      '.kv-bar button:focus-visible,.kv-tip button:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
      '.kv-tip{position:fixed;z-index:2147483646;display:flex;align-items:center;gap:8px;padding:6px 6px 6px 12px;background:#161B26;color:#fff;border-radius:8px;font:500 13px system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.25);max-width:280px}.kv-tip span{opacity:.7;overflow:hidden;white-space:nowrap}.kv-tip button{background:#F0BE3D;color:#161B26}' +
      '.kv-map-edit{position:absolute;top:10px;right:10px;background:#F0BE3D;color:#161B26}' +
      '.kv-colors{position:fixed;z-index:2147483646;top:84px;right:12px;width:260px;max-height:70vh;overflow:auto;padding:14px 16px;background:#fff;color:#161B26;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.25);font:500 14px/1.4 system-ui,sans-serif}.kv-colors p{margin:0 0 10px}.kv-colors small{color:#5b6270}.kv-colors label{display:flex;align-items:center;gap:10px;min-height:44px}.kv-colors input{width:44px;height:32px;border:1px solid #ddd;border-radius:6px;padding:0;background:none}.kv-reset{margin-top:8px;min-height:40px;padding:0 12px;border:1px solid #ccd;border-radius:6px;background:#fff;font:600 13px system-ui,sans-serif;cursor:pointer}';
    document.head.appendChild(s);
  }

  function start() {
    if (active) return;
    active = true;
    css();
    $$('details:not([open])').forEach(function (d) { d.setAttribute('open', ''); d.setAttribute('data-kv-opened', ''); });
    editable().forEach(function (el) {
      el.setAttribute('contenteditable', 'true'); el.setAttribute('data-kv-edit', ''); el.setAttribute('spellcheck', 'true');
      el.addEventListener('input', function () { dirty = true; });
      if (el.tagName === 'A') el.addEventListener('blur', function () { syncLink(el); });
    });
    imageTargets().forEach(markImage);
    picker = ui(document.createElement('input')); picker.type = 'file'; picker.accept = 'image/*'; picker.hidden = true;
    picker.addEventListener('change', function () {
      var f = picker.files && picker.files[0]; if (!f || !pickTarget) return;
      var t = pickTarget;
      resize(f, t.hasAttribute('data-kv-logo'), function (data) { applyImage(t, data); dirty = true; });
    });
    document.body.appendChild(picker);
    document.addEventListener('click', onImageClick, true);

    linkTip = ui(document.createElement('div')); linkTip.className = 'kv-tip'; linkTip.hidden = true;
    linkTip.innerHTML = '<span></span><button type="button">Modifier le lien</button>';
    linkTip.querySelector('button').addEventListener('mousedown', function (e) { e.preventDefault(); });
    linkTip.querySelector('button').addEventListener('click', function () {
      if (!currentLink) return;
      var v = prompt('Adresse du lien (par exemple votre page Instagram ou de réservation) :', currentLink.getAttribute('href') || 'https://');
      if (v && v.trim()) { currentLink.setAttribute('href', v.trim()); dirty = true; showLinkTip(currentLink); }
    });
    document.body.appendChild(linkTip);
    document.addEventListener('focusin', function (e) { var a = e.target.closest && e.target.closest('a'); if (a && active) showLinkTip(a); else if (!(e.target.closest && e.target.closest('.kv-tip'))) hideLinkTip(); });
    window.addEventListener('scroll', hideLinkTip, { passive: true });

    var panel = colorPanel();
    renderMaps();

    bar = ui(document.createElement('div')); bar.className = 'kv-bar';
    bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Mode édition');
    bar.innerHTML = '<p>' + (isDemo ? 'Mode édition (démo) : ' : 'Mode édition : ') + 'cliquez sur un texte pour le modifier, sur une photo encadrée de jaune pour la remplacer.</p>' +
      (panel ? '<button type="button" class="kv-col" aria-expanded="false">Couleurs</button>' : '') +
      (isDemo ? '' : '<button type="button" class="kv-dl">Télécharger ma page</button>') +
      '<button type="button" class="kv-quit">Quitter</button>';
    document.body.appendChild(bar);
    var col = bar.querySelector('.kv-col');
    if (col) col.addEventListener('click', function () { panel.hidden = !panel.hidden; col.setAttribute('aria-expanded', !panel.hidden); });
    var dl = bar.querySelector('.kv-dl'); if (dl) dl.addEventListener('click', download);
    bar.querySelector('.kv-quit').addEventListener('click', function () {
      if (dirty && !isDemo && !confirm('Vos modifications non téléchargées seront perdues. Quitter quand même ?')) return;
      location.hash = ''; location.reload();
    });
  }

  function download() {
    $$('a[data-kv-edit]').forEach(syncLink);
    var root = document.documentElement.cloneNode(true);
    $$('[data-kv-ui]', root).forEach(function (n) { n.remove(); });
    $$('[data-kv-gen]', root).forEach(function (n) { n.remove(); });
    $$('[data-kv-opened]', root).forEach(function (n) { n.removeAttribute('open'); n.removeAttribute('data-kv-opened'); });
    $$('[data-kv-edit]', root).forEach(function (n) { n.removeAttribute('contenteditable'); n.removeAttribute('data-kv-edit'); n.removeAttribute('spellcheck'); });
    $$('[data-kv-img]', root).forEach(function (n) { n.removeAttribute('data-kv-img'); n.removeAttribute('title'); });
    // Couleurs choisies : écrites dans une feuille de style de la page
    var inline = document.documentElement.style;
    var decl = allVars().map(function (v) { var c = inline.getPropertyValue(v) || (document.getElementById('kv-couleurs') ? getVar(v) : ''); return c ? v + ':' + c.trim() + ';' : ''; }).join('');
    root.removeAttribute('style');
    var head = root.querySelector('head'), old = head.querySelector('#kv-couleurs');
    if (decl) { var st = old || document.createElement('style'); st.id = 'kv-couleurs'; st.textContent = ':root{' + decl + '}'; if (!old) head.appendChild(st); }
    var html = '<!doctype html>\n' + root.outerHTML;
    var name = (location.pathname.split('/').pop() || 'index.html');
    var a = ui(document.createElement('a'));
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' })); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { a.remove(); }, 1000);
    dirty = false;
    setTimeout(function () { alert('Fichier « ' + name + ' » téléchargé.\nRemplacez l\'ancien ' + name + ' du dossier de votre site par celui-ci (il est dans vos Téléchargements).'); }, 300);
  }

  window.addEventListener('beforeunload', function (e) { if (active && dirty && !isDemo) { e.preventDefault(); e.returnValue = ''; } });
  document.addEventListener('click', blockNav, true);
  function check() { if (location.hash === '#edition') start(); else renderMaps(); }
  window.addEventListener('hashchange', function () { if (location.hash === '#edition') start(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', check); else check();
})();
