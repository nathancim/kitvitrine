// Kit Vitrine — messagerie (réponses rédigées par l'assistant, par lots, sous 2 h de 8 h à 22 h).
(() => {
  'use strict';
  const dlg = document.querySelector('dialog.kv-chat');
  if (!dlg) return;
  const $ = s => dlg.querySelector(s);
  const KEY = 'kv-conversation', SEEN = 'kv-conversation-vu';
  const get = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* stockage indisponible */ } };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = iso => { const d = new Date(iso); return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); };

  let conv = get(KEY);           // { id, jeton }
  let thread = null, timer = null;
  const list = $('[data-chat-list]'), first = $('[data-chat-first]'), reply = $('[data-chat-reply]'), err = $('[data-chat-error]');

  // Arrivée depuis le lien d'un e-mail : /messages/?id=…&t=…
  const p = new URLSearchParams(location.search);
  if (p.get('id') && p.get('t')) { conv = { id: p.get('id'), jeton: p.get('t') }; set(KEY, conv); history.replaceState(null, '', location.pathname); }

  const badge = n => document.querySelectorAll('[data-chat-badge]').forEach(b => { b.textContent = n; b.classList.toggle('hidden', !n); });
  const unread = () => thread ? thread.messages.filter(m => m.de !== 'visiteur').length - (get(SEEN) || 0) : 0;

  function render() {
    const intro = `<div class="kv-bubble kv-them">Bonjour ! Une question sur un template, sa mise en ligne, ou un projet à nous raconter ? Écrivez-nous : la réponse arrive ici et par e-mail, sous 2 h entre 8 h et 22 h.</div>`;
    if (!thread) { list.innerHTML = intro; first.hidden = false; reply.hidden = true; return; }
    list.innerHTML = intro + thread.messages.map(m => `<div class="kv-bubble ${m.de === 'visiteur' ? 'kv-me' : 'kv-them'}">${esc(m.texte).replace(/\n/g, '<br>')}<span class="kv-time">${m.de === 'visiteur' ? 'Vous' : 'Kit Vitrine'} · ${fmt(m.le)}</span></div>`).join('');
    const last = thread.messages[thread.messages.length - 1];
    if (last && last.de === 'visiteur') list.insertAdjacentHTML('beforeend', '<p class="kv-pending">Message reçu. Réponse ici et par e-mail sous 2 h (8 h – 22 h).</p>');
    if (thread.statut === 'clos') list.insertAdjacentHTML('beforeend', '<p class="kv-pending">Conversation terminée. Écrivez un nouveau message pour la rouvrir.</p>');
    first.hidden = true; reply.hidden = false;
    list.scrollTop = list.scrollHeight;
  }

  async function load() {
    if (!conv) return;
    try {
      const r = await fetch(`/api/messages?id=${encodeURIComponent(conv.id)}&t=${encodeURIComponent(conv.jeton)}`, { cache: 'no-store' });
      if (r.status === 404) { conv = null; thread = null; set(KEY, null); render(); return; }
      if (!r.ok) return;
      thread = (await r.json()).conversation;
      if (dlg.open) { set(SEEN, thread.messages.filter(m => m.de !== 'visiteur').length); badge(0); render(); } else badge(unread());
    } catch { /* hors ligne : on réessaiera */ }
  }

  async function send(url, body, btn) {
    err.textContent = ''; btn.disabled = true; const label = btn.textContent; btn.textContent = 'Envoi…';
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { err.textContent = j.erreur || 'L\'envoi a échoué. Réessayez dans un instant.'; return null; }
      return j;
    } catch { err.textContent = 'Pas de connexion. Vérifiez votre réseau puis réessayez.'; return null; }
    finally { btn.disabled = false; btn.textContent = label; }
  }

  first.addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(first);
    const j = await send('/api/messages', { prenom: f.get('prenom'), email: f.get('email'), message: f.get('message'), consentement: f.get('consentement') === 'on', site: f.get('site'), page: location.pathname }, first.querySelector('button[type=submit]'));
    if (!j) return;
    conv = { id: j.id, jeton: j.jeton }; set(KEY, conv); thread = j.conversation; set(SEEN, 0); first.reset(); render();
  });
  reply.addEventListener('submit', async e => {
    e.preventDefault();
    const ta = reply.querySelector('textarea'); if (!ta.value.trim()) return;
    const j = await send(`/api/messages/${encodeURIComponent(conv.id)}`, { jeton: conv.jeton, message: ta.value }, reply.querySelector('button[type=submit]'));
    if (!j) return;
    thread = j.conversation; ta.value = ''; render();
  });
  reply.querySelector('textarea').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) reply.requestSubmit(); });

  const open = () => { render(); dlg.showModal(); load(); clearInterval(timer); timer = setInterval(load, 60000); };
  document.addEventListener('click', e => { if (e.target.closest('[data-open-chat]')) { e.preventDefault(); open(); } });
  dlg.addEventListener('close', () => clearInterval(timer));
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

  render();
  load();
  if (document.body.hasAttribute('data-open-chat-now')) open();
})();
