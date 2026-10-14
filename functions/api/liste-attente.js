// POST /api/liste-attente : être prévenu à l'ouverture des ventes.
import { update, randomId, json, clean, isEmail, handle } from '../../lib/store.js';

export const onRequestPost = ({ request, env }) => handle(async () => {
  const b = await request.json().catch(() => ({}));
  if (b.site) return json({ ok: true });
  const email = clean(b.email, 254).toLowerCase(), template = clean(b.template, 60);
  if (!isEmail(email)) return json({ erreur: 'Cette adresse e-mail ne semble pas valide.' }, 400);
  const now = new Date().toISOString();
  await update(env, `liste-attente/${now.slice(0, 10)}-${randomId(8)}.json`, cur => (cur ? null : { email, template, inscrit_le: now }), 'Inscription liste d\'attente');
  return json({ ok: true }, 201);
});
