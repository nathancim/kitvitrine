// Stockage de la messagerie dans le dépôt GitHub, branche « messagerie » (jamais publiée sur le site).
// Nécessite la variable secrète GITHUB_TOKEN dans le projet Cloudflare Pages
// (jeton GitHub à accès limité au dépôt, permission « Contents : read and write »).
const REPO = 'nathancim/kitvitrine';
const BRANCH = 'messagerie';
const API = `https://api.github.com/repos/${REPO}/contents/`;

const b64 = s => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
const unb64 = s => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\n/g, '')), c => c.charCodeAt(0)));

function headers(env) {
  if (!env.GITHUB_TOKEN) throw new Response(JSON.stringify({ erreur: 'Messagerie pas encore configurée.' }), { status: 503, headers: { 'content-type': 'application/json' } });
  return { Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'kitvitrine-messagerie', 'X-GitHub-Api-Version': '2022-11-28' };
}

export async function readJSON(env, path) {
  const r = await fetch(`${API}${path}?ref=${BRANCH}`, { headers: headers(env) });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub lecture ${r.status}`);
  const j = await r.json();
  return { data: JSON.parse(unb64(j.content)), sha: j.sha };
}

export async function writeJSON(env, path, data, sha, message) {
  const r = await fetch(`${API}${path}`, {
    method: 'PUT', headers: { ...headers(env), 'content-type': 'application/json' },
    body: JSON.stringify({ message, branch: BRANCH, content: b64(JSON.stringify(data, null, 2) + '\n'), ...(sha ? { sha } : {}) }),
  });
  if (r.status === 409 || r.status === 422) return false; // modifié entre-temps : à relire
  if (!r.ok) throw new Error(`GitHub écriture ${r.status}`);
  return true;
}

// Lecture-modification-écriture avec une nouvelle tentative si le fichier a changé entre-temps.
export async function update(env, path, fn, message) {
  for (let i = 0; i < 3; i++) {
    const cur = await readJSON(env, path);
    const next = await fn(cur ? cur.data : null);
    if (!next) return null;
    if (await writeJSON(env, path, next, cur && cur.sha, message)) return next;
  }
  throw new Error('Conflit d\'écriture répété');
}

export async function sha256(s) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
}
export const randomId = (n = 16) => [...crypto.getRandomValues(new Uint8Array(n))].map(b => b.toString(36).padStart(2, '0').slice(-1)).join('');

export const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
export const clean = (s, max) => String(s ?? '').replace(/\u0000/g, '').trim().slice(0, max);
export const isEmail = s => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/.test(s);

// Ce que le visiteur a le droit de voir (jamais l'e-mail, jamais le jeton).
export const publicThread = t => ({ id: t.id, statut: t.statut, prenom: t.prenom, messages: t.messages.map(m => ({ de: m.de, le: m.le, texte: m.texte })) });

export async function handle(fn) {
  try { return await fn(); }
  catch (e) { if (e instanceof Response) return e; return json({ erreur: 'Le service est momentanément indisponible. Réessayez dans quelques minutes.' }, 502); }
}
