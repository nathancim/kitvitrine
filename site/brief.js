// Kit Vitrine — questionnaire « On s'occupe de tout » et page de suivi.
(() => {
  'use strict';
  const KEY = 'kv-demande';
  const get = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };
  const set = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* stockage indisponible */ } };
  const suiviUrl = d => `/suivi/?id=${encodeURIComponent(d.id)}&t=${encodeURIComponent(d.jeton)}`;

  // ---------------------------------------------------------------- Questionnaire
  const form = document.querySelector('[data-brief]');
  if (form) {
    const steps = [...form.querySelectorAll('[data-step]')];
    const $ = s => form.querySelector(s);
    const prev = $('[data-brief-prev]'), next = $('[data-brief-next]'), submit = $('[data-brief-submit]'), err = $('[data-brief-error]');
    let cur = 0;
    const show = i => {
      cur = i;
      steps.forEach((s, k) => { s.hidden = k !== i; });
      prev.hidden = i === 0; next.hidden = i === steps.length - 1; submit.hidden = i !== steps.length - 1;
      $('[data-brief-progress]').textContent = `Étape ${i + 1} sur ${steps.length}`;
      $('[data-brief-bar]').style.width = `${((i + 1) / steps.length) * 100}%`;
      err.textContent = '';
    };
    const valid = () => {
      for (const el of steps[cur].querySelectorAll('input,textarea,select')) {
        if (el.type === 'checkbox' && el.required && !el.checked) { err.textContent = 'Merci de cocher la case d\'accord pour continuer.'; el.focus(); return false; }
        if (el.required && !el.value.trim()) { err.textContent = 'Merci de remplir les champs marqués d\'une étoile.'; el.focus(); return false; }
        if (el.type === 'email' && el.value && !el.checkValidity()) { err.textContent = 'Cette adresse e-mail ne semble pas valide.'; el.focus(); return false; }
      }
      return true;
    };
    const top = () => form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    next.addEventListener('click', () => { if (valid()) { show(cur + 1); top(); steps[cur].querySelector('input,textarea,select')?.focus({ preventScroll: true }); } });
    prev.addEventListener('click', () => { show(cur - 1); top(); });

    // Un clic sur « Choisir … » ou un lien ?template=… préremplit le questionnaire
    document.addEventListener('click', e => { const a = e.target.closest('[data-offre]'); if (a) { const r = form.querySelector(`input[name=formule][value="${a.dataset.offre}"]`); if (r) r.checked = true; } });
    const p = new URLSearchParams(location.search);
    if (p.get('template')) form.template.value = p.get('template');
    if (p.get('formule')) { const r = form.querySelector(`input[name=formule][value="${p.get('formule')}"]`); if (r) r.checked = true; }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!valid()) return;
      const data = Object.fromEntries(new FormData(form));
      data.consentement = data.consentement === 'on';
      submit.disabled = true; const label = submit.textContent; submit.textContent = 'Envoi…';
      try {
        const r = await fetch('/api/brief', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) { err.textContent = j.erreur || 'L\'envoi a échoué. Réessayez dans un instant.'; return; }
        const d = { id: j.id, jeton: j.jeton }; set(d);
        form.hidden = true;
        const done = document.querySelector('[data-brief-done]'); done.hidden = false;
        done.querySelector('[data-brief-link]').href = suiviUrl(d);
        done.scrollIntoView({ block: 'center' });
      } catch { err.textContent = 'Pas de connexion. Vérifiez votre réseau puis réessayez.'; }
      finally { submit.disabled = false; submit.textContent = label; }
    });
    show(0);
  }

  // ---------------------------------------------------------------- Suivi
  const suivi = document.querySelector('[data-suivi]');
  if (suivi) {
    const p = new URLSearchParams(location.search);
    let d = p.get('id') && p.get('t') ? { id: p.get('id'), jeton: p.get('t') } : get();
    const intro = suivi.querySelector('[data-suivi-intro]');
    const ETAPES = [
      ['recue', 'Demande reçue', 'Nous avons bien votre questionnaire.'],
      ['en_preparation', 'Démo en préparation', 'Nous mettons vos textes dans le template.'],
      ['demo_prete', 'Démo prête', 'Regardez-la et demandez vos corrections.'],
      ['validee', 'Démo validée', 'Vous recevez le lien de paiement.'],
      ['payee', 'Mise en ligne en cours', 'Nom de domaine, hébergement, formulaire.'],
      ['en_ligne', 'Votre site est en ligne', 'Félicitations !'],
    ];
    if (!d) { intro.textContent = 'Aucune demande trouvée sur cet appareil. Utilisez le lien de suivi reçu après le questionnaire.'; return; }
    if (p.get('id')) { set(d); history.replaceState(null, '', location.pathname); }
    fetch(`/api/brief?id=${encodeURIComponent(d.id)}&t=${encodeURIComponent(d.jeton)}`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(({ demande: x }) => {
        if (x.statut === 'annulee') { intro.textContent = 'Cette demande a été clôturée. Écrivez-nous si vous souhaitez la reprendre.'; return; }
        const k = Math.max(0, ETAPES.findIndex(e => e[0] === x.statut));
        intro.textContent = `Bonjour ${x.prenom}, voici où en est votre site « ${x.entreprise} » (formule ${x.formule}).`;
        const ol = suivi.querySelector('[data-suivi-steps]'); ol.hidden = false;
        ol.innerHTML = ETAPES.map(([, t, s], i) => `<li class="relative flex gap-4 pb-7 last:pb-0">
          ${i < ETAPES.length - 1 ? `<span class="absolute left-[15px] top-8 bottom-0 w-0.5 ${i < k ? 'bg-sign' : 'bg-line'}" aria-hidden="true"></span>` : ''}
          <span class="relative z-10 grid place-items-center w-8 h-8 shrink-0 rounded-full font-bold text-sm ${i < k ? 'bg-sign text-white' : i === k ? 'bg-awning text-ink ring-4 ring-awning/30' : 'bg-mist text-ink/50'}">${i < k ? '✓' : i + 1}</span>
          <span><span class="block font-semibold ${i > k ? 'text-ink/50' : ''}">${t}${i === k ? ' <span class="ml-1 rounded-full bg-mist px-2 py-0.5 text-xs font-semibold align-middle">en cours</span>' : ''}</span><span class="text-[15px] ${i > k ? 'text-ink/40' : 'text-ink/70'}">${s}</span></span></li>`).join('');
        if (x.demo_url && /^https:\/\//.test(x.demo_url)) { const b = suivi.querySelector('[data-suivi-demo]'); b.hidden = false; b.querySelector('[data-suivi-demo-link]').href = x.demo_url; }
      })
      .catch(s => { intro.textContent = s === 404 ? 'Demande introuvable. Vérifiez votre lien de suivi.' : 'Le suivi est momentanément indisponible. Réessayez dans quelques minutes.'; });
  }
})();
