# Kit Vitrine — procédure de la tâche planifiée

Boutique de templates de sites vitrines (HTML + Tailwind CSS) classés par métier.
Site : https://kitvitrine.pages.dev (Cloudflare Pages publie `dist/` à chaque push sur `main` (projet « kitvitrine »)).
Paiement : boutique Shopify connectée, app « Digital Products ». Livraison : produit « lien » vers un Google Doc qui contient le lien de téléchargement du zip.
Langue : tout est en français (textes, fiches, commits).

## Arborescence

- `catalog.json` : la base du catalogue (univers, styles, couleurs, une fiche par template).
- `templates/<slug>/` : sources d'un template (`index.html`, `tailwind.config.js`, `src/input.css`, `package.json`, `assets/`).
- `build.mjs` : compile les templates modifiés, prend les captures (`shots/`), crée les zips (`packages/`), génère `dist/`. `node build.mjs --force` reconstruit tout.
- `site/` : gabarits et styles du site catalogue. Ne pas modifier pendant une exécution planifiée.

## Déroulé d'une exécution (UN template par exécution)

### 0. Préparer
1. `npm ci` (ou `npm install`) puis `python3 -c "import playwright"` pour vérifier les captures.
2. **Ventes fermées pour l'instant** : tant que `site.ventes_ouvertes` vaut `false` dans `catalog.json`, ne fais AUCUNE action Shopify ni Google Drive (pas de rattrapage, pas de produit, pas de Doc) : le template est seulement publié sur le site, avec la mention « Bientôt en vente ». Seul Nathan passe ce réglage à `true`.
3. Rattrapage (uniquement si `site.ventes_ouvertes` vaut `true`) : pour chaque fiche dont `shopify_url` est vide, reprendre l'étape 5 (points 3 à 5) pour la mettre en vente, sauf si `shopify_product_id` pointe vers un produit déjà actif (alors seulement renseigner `shopify_url`).

### 1. Choisir le sujet
- Prendre l'univers qui a **le moins** de templates (à égalité, celui dont le dernier ajout est le plus ancien).
- Choisir un **métier précis** pas encore couvert dans cet univers (ex. « podologue », pas « santé »). Vérifier avec `grep` dans `catalog.json` que le métier n'existe pas déjà.
- Choisir un style et une couleur **différents des 3 derniers templates ajoutés**.

### 2. Concevoir (qualité avant tout)
- Lire la skill `frontend-design` avant d'écrire le code.
- Mise en page **structurellement différente** des templates existants : ne pas reprendre la même trame en changeant les couleurs. Varier le héros, la grille, le rythme des sections.
- Textes réalistes et spécifiques au métier, en français, coordonnées fictives (`06 00 00 00 00`, `contact@exemple.fr`), noms de clients au prénom seulement.
- **Aucune image externe ni photo de banque d'images** : illustrations en SVG/CSS uniquement.
- **Polices hébergées en local** via `@fontsource/<famille>` (npm), copiées dans `assets/fonts/`, déclarées en `@font-face` dans `src/input.css`. Jamais de Google Fonts.
- Obligatoire : responsive mobile, menu mobile fonctionnel, focus clavier visible, `prefers-reduced-motion` respecté, formulaire de contact avec le commentaire expliquant comment le relier.
- **Mode édition** : le build ajoute automatiquement `assets/kv-edition.js` (édition des textes dans le navigateur) à la démo et au zip. Ne pas l'ajouter soi-même. Mettre chaque texte modifiable dans une balise texte simple (`h1`–`h6`, `p`, `li`, `a`, `span`, `dt`, `dd`, `blockquote`, `figcaption`, `summary`, `label`) plutôt que directement dans une `div`, et garder téléphone/e-mail dans des liens `tel:` / `mailto:`.
- Copier la structure de fichiers de `templates/equilibre/` (`package.json`, `tailwind.config.js` avec `content: { relative: true, files: ['./*.html'] }`).

### 3. Enregistrer la fiche
Ajouter l'entrée **à la fin** de `catalog.json > templates` avec tous les champs : `slug, title, tagline, description, univers, style, couleur, pages, prix, date (AAAA-MM-JJ, heure de Paris), tags, sections, palette, shopify_url: "", shopify_product_id: ""`.
- `title` : un nom court et évocateur, unique. `tagline` : « Site vitrine pour <métier> ».
- Prix : 29 € pour une page, 39 € pour 2 à 4 pages, 49 € au-delà.
- `tags` : 6 à 10 mots que tape un client (métier, synonymes, spécialités).

### 4. Construire et vérifier
1. `node build.mjs` (s'arrête en cas de fiche invalide : corriger).
2. Regarder `shots/<slug>/thumb.jpg` et `full.jpg` avec Read, et une capture mobile (`python3 shoot.py <chemin>/index.html /tmp/<slug> full`). Corriger tout défaut visible avant de continuer.

### 5. Publier (directement, sans validation : le propriétaire vérifie sur la boutique)
1. `git add -A && git commit -m "Nouveau template : <title> (<métier>)"` puis `git push`. `node build.mjs` a créé `dl_token` dans la fiche et copié le zip dans `dist/dl/<dl_token>/` (lien de téléchargement secret, non indexé).
Si `site.ventes_ouvertes` vaut `false`, s'arrêter après les points 1 et 2, puis passer au compte rendu.
2. Attendre que Cloudflare Pages ait publié : vérifier (WebFetch, plusieurs essais espacés, 5 min max) que `https://kitvitrine.pages.dev/templates/<slug>/` répond.
3. Créer la fiche de téléchargement dans Google Drive, dossier « Kit Vitrine — téléchargements clients » (id `13zRGx6roucARUSY8XWG-PiybC9rH58-q`, partagé « tous les utilisateurs disposant du lien ») : `create_file` avec `parentId` = ce dossier, titre « Kit Vitrine — <title> — Téléchargement », `contentMimeType` `text/plain` (converti en Google Doc). Contenu : remerciement, lien `https://kitvitrine.pages.dev/dl/<dl_token>/kitvitrine-<slug>.zip`, 3 étapes de démarrage (dézipper, ouvrir LISEZMOI.md, publier), rappel de licence (un site).
4. Shopify : `create-digital-product-from-link` (titre « Template <title> — <tagline> », url = viewUrl du Google Doc, name « Télécharger votre template »), puis `update-product` (prix, description HTML avec lien de la démo `https://kitvitrine.pages.dev/demo/<slug>/`, SKU `KV-<SLUG>`, image `https://kitvitrine.pages.dev/templates/<slug>/thumb.jpg`), puis `publish-digital-product` avec le titre actuel.
5. Lire `onlineStoreUrl` du produit (graphql_query sur `product(id)`) et l'enregistrer dans `shopify_url`, ainsi que `shopify_product_id`. `node build.mjs`, commit, push.
6. Si une étape Shopify ou Drive échoue : laisser le template en ligne sur le site (bouton « Bientôt en vente »), ne rien publier de bancal, signaler l'incident.

### 6. Compte rendu (via SendUserMessage)
Trois lignes : le template créé (nom, métier, lien de la fiche), le produit Shopify publié (lien, ou « ventes fermées »), et tout problème rencontré.

## Règles
- En cas d'échec d'une étape (build, push, Shopify), ne pas insister en boucle : noter le problème dans le compte rendu et s'arrêter proprement, sans laisser de fiche à moitié remplie dans `catalog.json`.
- Ne jamais supprimer ni réécrire un template existant.
- Ne jamais toucher à l'ordinateur du propriétaire.
