// POST /api/messages/<id> : le visiteur ajoute un message à sa conversation.
import { update, sha256, json, clean, publicThread, handle } from '../../../lib/store.js';

export const onRequestPost = ({ request, env, params }) => handle(async () => {
  const id = clean(params.id, 40);
  const b = await request.json().catch(() => ({}));
  const texte = clean(b.message, 2000), t = clean(b.jeton, 80);
  if (!/^[a-z0-9]{6,40}$/.test(id) || !t) return json({ erreur: 'Conversation introuvable.' }, 404);
  if (texte.length < 1) return json({ erreur: 'Écrivez votre message.' }, 400);
  const h = await sha256(t);
  let refus = null;
  const next = await update(env, `conversations/${id}.json`, cur => {
    if (!cur || cur.jeton_hash !== h) { refus = json({ erreur: 'Conversation introuvable.' }, 404); return null; }
    if (cur.messages.length >= 40) { refus = json({ erreur: 'Cette conversation est très longue : écrivez-nous dans une nouvelle conversation.' }, 429); return null; }
    const now = new Date().toISOString();
    cur.messages.push({ de: 'visiteur', le: now, texte });
    cur.maj_le = now; cur.dernier = 'visiteur';
    if (cur.statut === 'clos') cur.statut = 'ouvert';
    return cur;
  }, `Message visiteur ${id}`);
  if (refus) return refus;
  return json({ conversation: publicThread(next) });
});
