// POST /api/messages : nouvelle conversation.  GET /api/messages?id=…&t=… : lire une conversation.
import { readJSON, update, sha256, randomId, json, clean, isEmail, publicThread, handle } from '../../lib/store.js';

export const onRequestPost = ({ request, env }) => handle(async () => {
  const b = await request.json().catch(() => ({}));
  if (b.site) return json({ ok: true }); // champ piège rempli par les robots
  const prenom = clean(b.prenom, 60), email = clean(b.email, 254).toLowerCase(), texte = clean(b.message, 2000), page = clean(b.page, 200);
  if (!prenom) return json({ erreur: 'Indiquez votre prénom.' }, 400);
  if (!isEmail(email)) return json({ erreur: 'Cette adresse e-mail ne semble pas valide.' }, 400);
  if (texte.length < 2) return json({ erreur: 'Écrivez votre message.' }, 400);
  if (!b.consentement) return json({ erreur: 'Merci d\'accepter que nous conservions votre message pour vous répondre.' }, 400);
  const id = randomId(12), token = randomId(24), now = new Date().toISOString();
  const thread = {
    id, jeton_hash: await sha256(token), cree_le: now, maj_le: now, statut: 'ouvert', dernier: 'visiteur',
    prenom, email, page, consentement_le: now,
    messages: [{ de: 'visiteur', le: now, texte }],
  };
  await update(env, `conversations/${id}.json`, cur => (cur ? null : thread), `Nouvelle conversation ${id}`);
  return json({ id, jeton: token, conversation: publicThread(thread) }, 201);
});

export const onRequestGet = ({ request, env }) => handle(async () => {
  const u = new URL(request.url), id = clean(u.searchParams.get('id'), 40), t = clean(u.searchParams.get('t'), 80);
  if (!/^[a-z0-9]{6,40}$/.test(id) || !t) return json({ erreur: 'Conversation introuvable.' }, 404);
  const f = await readJSON(env, `conversations/${id}.json`);
  if (!f || f.data.jeton_hash !== await sha256(t)) return json({ erreur: 'Conversation introuvable.' }, 404);
  return json({ conversation: publicThread(f.data) });
});
