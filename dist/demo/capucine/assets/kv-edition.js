/* Kit Vitrine — mode édition intégré.
   Ouvrez index.html puis ajoutez #edition à la fin de l'adresse (ou ouvrez MODIFIER-MON-SITE.html).
   Cliquez sur un texte pour le modifier, puis « Télécharger ma page » et remplacez votre index.html.
   Ce script ne fait rien tant que l'adresse ne se termine pas par #edition. */
(function () {
  'use strict';
  var TEXT_TAGS = 'h1,h2,h3,h4,h5,h6,p,li,a,span,strong,em,dt,dd,blockquote,figcaption,summary,button,label,td,th,small,cite';
  var active = false, dirty = false, bar = null;
  var isDemo = !!document.querySelector('[data-kv-demo]');

  function hasOwnText(el) {
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3 && n.textContent.trim()) return true;
    }
    return false;
  }
  function editable() {
    return Array.prototype.filter.call(document.body.querySelectorAll(TEXT_TAGS), function (el) {
      return !el.closest('[data-kv-ui],[data-kv-demo],script,style,svg,select,option') && hasOwnText(el);
    });
  }

  function syncLink(a) {
    var t = a.textContent.trim();
    if (/^tel:/i.test(a.getAttribute('href') || '')) {
      var d = t.replace(/[^\d+]/g, '');
      if (d.charAt(0) === '0') d = '+33' + d.slice(1);
      if (d) a.setAttribute('href', 'tel:' + d);
    } else if (/^mailto:/i.test(a.getAttribute('href') || '') && /@/.test(t)) {
      a.setAttribute('href', 'mailto:' + t);
    }
  }

  function blockLinks(e) {
    if (!active) return;
    var a = e.target.closest && e.target.closest('a');
    if (a && !a.closest('[data-kv-ui]')) e.preventDefault();
    var sm = e.target.closest && e.target.closest('summary');
    if (sm) e.preventDefault();
  }

  function css() {
    var s = document.createElement('style');
    s.setAttribute('data-kv-ui', '');
    s.textContent =
      '[data-kv-edit]{outline:1px dashed rgba(14,90,71,.45);outline-offset:2px;cursor:text}' +
      '[data-kv-edit]:hover{outline:2px solid #0E5A47}' +
      '[data-kv-edit]:focus{outline:2px solid #F0BE3D;background:rgba(240,190,61,.12)}' +
      '.kv-bar{position:fixed;left:12px;right:12px;top:12px;z-index:2147483646;max-width:760px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:10px 12px 10px 16px;background:#161B26;color:#fff;border-radius:10px;font:500 14px/1.35 system-ui,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.3)}' +
      '.kv-bar p{margin:0;flex:1 1 260px}.kv-bar button{font:600 14px system-ui,sans-serif;border:0;border-radius:6px;padding:9px 14px;cursor:pointer}' +
      '.kv-dl{background:#F0BE3D;color:#161B26}.kv-quit{background:transparent;color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.35)}' +
      '.kv-bar button:focus-visible{outline:2px solid #fff;outline-offset:2px}';
    document.head.appendChild(s);
  }

  function start() {
    if (active) return;
    active = true;
    css();
    // Open collapsed sections (FAQ…) so their text can be edited; closed again on download
    document.querySelectorAll('details:not([open])').forEach(function (d) { d.setAttribute('open', ''); d.setAttribute('data-kv-opened', ''); });
    editable().forEach(function (el) {
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('data-kv-edit', '');
      el.setAttribute('spellcheck', 'true');
      el.addEventListener('input', function () { dirty = true; });
      if (el.tagName === 'A') el.addEventListener('blur', function () { syncLink(el); });
    });
    bar = document.createElement('div');
    bar.className = 'kv-bar';
    bar.setAttribute('data-kv-ui', '');
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Mode édition');
    bar.innerHTML = isDemo
      ? '<p>Mode édition (démo) : cliquez sur n\'importe quel texte pour le modifier. Le téléchargement est disponible dans le template acheté.</p><button type="button" class="kv-quit">Quitter</button>'
      : '<p>Mode édition : cliquez sur un texte pour le modifier. Téléphone et e-mail se mettent à jour tout seuls.</p><button type="button" class="kv-dl">Télécharger ma page</button><button type="button" class="kv-quit">Quitter</button>';
    document.body.appendChild(bar);
    var dl = bar.querySelector('.kv-dl');
    if (dl) dl.addEventListener('click', download);
    bar.querySelector('.kv-quit').addEventListener('click', function () {
      if (dirty && !isDemo && !confirm('Vos modifications non téléchargées seront perdues. Quitter quand même ?')) return;
      location.hash = '';
      location.reload();
    });
  }

  function download() {
    document.querySelectorAll('a[data-kv-edit]').forEach(syncLink);
    var root = document.documentElement.cloneNode(true);
    Array.prototype.forEach.call(root.querySelectorAll('[data-kv-ui]'), function (n) { n.remove(); });
    Array.prototype.forEach.call(root.querySelectorAll('[data-kv-opened]'), function (n) { n.removeAttribute('open'); n.removeAttribute('data-kv-opened'); });
    Array.prototype.forEach.call(root.querySelectorAll('[data-kv-edit]'), function (n) {
      n.removeAttribute('contenteditable'); n.removeAttribute('data-kv-edit'); n.removeAttribute('spellcheck');
    });
    var html = '<!doctype html>\n' + root.outerHTML;
    var name = (location.pathname.split('/').pop() || 'index.html');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    a.download = name;
    a.setAttribute('data-kv-ui', '');
    document.body.appendChild(a); a.click();
    setTimeout(function () { a.remove(); }, 1000);
    dirty = false;
    setTimeout(function () { alert('Fichier « ' + name + ' » téléchargé.\nRemplacez l\'ancien ' + name + ' du dossier de votre site par celui-ci (il est dans vos Téléchargements).'); }, 300);
  }

  window.addEventListener('beforeunload', function (e) { if (active && dirty && !isDemo) { e.preventDefault(); e.returnValue = ''; } });
  document.addEventListener('click', blockLinks, true);
  function check() { if (location.hash === '#edition') start(); }
  window.addEventListener('hashchange', check);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', check); else check();
})();
