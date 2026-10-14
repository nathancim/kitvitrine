// POST /api/brief : questionnaire « On s'occupe de tout » (demande de démo).
// GET  /api/brief?id=…&t=… : suivi de la demande (statut, lien de démo).
// Stockage : branche « messagerie », dossier demandes/<id>.json (voir README.md de cette branche).
import { readJSON, update, sha256, randomId, json, clean, isEmail, handle } from '../../lib/store.js';

const FORMULES = { 'cle-en-main': 'Clé en main', serenite: 'Sérénité' };
const TEXTES = { entreprise: 100, metier: 100, ville: 100, presentation: 2000, prestations: 3000, horaires: 600, tel_public: 30, email_public: 254, adresse: 200, liens: 800, domaine: 100, telephone: 30, remarques: 1500, template: 60 };

export const onRequestPost = ({ request, env }) => handle(async () => {
  const b = await request.json().catch(() => ({}));
  if (b.site) return json({ ok: true }); // champ piège rempli par les robots
  const prenom = clean(b.prenom, 60), email = clean(b.email, 254).toLowerCase();
  const formule = FORMULES[b.formule] ? b.formule : 'serenite';
  const f = Object.fromEntries(Object.entries(TEXTES).map(([k, n]) => [k, clean(b[k], n)]));
  if (!f.entreprise || !f.metier || !f.ville || f.presentation.length < 10) return json({ erreur: 'Merci de remplir les champs marqués d\'une étoile.' }, 400);
  if (!prenom) return json({ erreur: 'Indiquez votre prénom.' }, 400);
  if (!isEmail(email)) return json({ erreur: 'Cette adresse e-mail ne semble pas valide.' }, 400);
  if (!b.consentement) return json({ erreur: 'Merci d\'accepter que nous conservions ces informations.' }, 400);
  const id = randomId(12), token = randomId(24), now = new Date().toISOString();
  const demande = {
    id, jeton_hash: await sha256(token), cree_le: now, maj_le: now, statut: 'recue', transmis: false,
    formule, prenom, email, consentement_le: now,
    domaine_existant: b.domaine_existant === 'oui', ...f,
    demo_url: '', historique: [{ le: now, statut: 'recue' }],
  };
  await update(env, `demandes/${id}.json`, cur => (cur ? null : demande), `Nouvelle demande de démo ${id}`);
  return json({ id, jeton: token }, 201);
});

export const onRequestGet = ({ request, env }) => handle(async () => {
  const u = new URL(request.url), id = clean(u.searchParams.get('id'), 40), t = clean(u.searchParams.get('t'), 80);
  if (!/^[a-z0-9]{6,40}$/.test(id) || !t) return json({ erreur: 'Demande introuvable.' }, 404);
  const r = await readJSON(env, `demandes/${id}.json`);
  if (!r || r.data.jeton_hash !== await sha256(t)) return json({ erreur: 'Demande introuvable.' }, 404);
  const d = r.data;
  return json({ demande: { statut: d.statut, prenom: d.prenom, entreprise: d.entreprise, formule: FORMULES[d.formule] || d.formule, demo_url: d.demo_url || '', maj_le: d.maj_le } });
});
