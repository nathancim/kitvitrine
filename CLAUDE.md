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
- **Mode édition** : le build ajoute automatiquement `assets/kv-edition.js` (textes, photos, logo, carte, liens, couleurs) à la démo et au zip. Ne pas l'ajouter soi-même. Pour qu'il fonctionne :
  - Textes : chaque texte modifiable dans une balise texte simple (`h1`–`h6`, `p`, `li`, `a`, `span`, `dt`, `dd`, `blockquote`, `figcaption`, `summary`, `label`) plutôt que directement dans une `div` ; téléphone/e-mail dans des liens `tel:` / `mailto:`.
  - **Logo** : le pictogramme SVG du logo porte `data-kv-logo="Logo"` (le nom reste un texte à côté, dans un `span`).
  - **Photos** : 1 à 3 emplacements photo. L'illustration SVG principale (héros) et éventuellement une illustration de galerie portent `data-kv-image="<description de la photo attendue>"`, soit sur le `svg`, soit sur son conteneur s'il a une hauteur fixe (aspect-ratio ou h-…). Le client clique dessus pour mettre sa photo.
  - **Carte** : si le métier a une adresse ou une zone (commerce, cabinet, restaurant, artisan), ajouter un bloc `<div data-kv-map="<ville ou adresse fictive>" class="mt-6 md:h-56 rounded-… overflow-hidden text-…"></div>` dans la section accès/zone/contact, avec le commentaire `<!-- Carte : l'adresse se change en mode édition (« Modifier l'adresse ») ou dans data-kv-map -->`. Pas de hauteur fixe sur mobile (le bloc fait une ligne et le plan se charge au clic) ; `md:h-56` ou plus sur ordinateur.
  - **Couleurs** : couleurs du `tailwind.config.js` en hexadécimal (le build les convertit en variables CSS) et ajouter `kvCouleurs: { <nom>: '<libellé en français>', … }` (couleur principale, accent, fonds, texte : 4 à 7 entrées). Utiliser les classes Tailwind (`bg-…`, `text-…`, `fill-…`) plutôt que des couleurs en dur pour tout ce qui doit suivre le changement de couleur (les dessins SVG peuvent garder des couleurs en dur).
- Copier la structure de fichiers de `templates/equilibre/` (`package.json`, `tailwind.config.js` avec `content: { relative: true, files: ['./*.html'] }`).

### 2 bis. Mobile d'abord (bloquant)
La majorité des visiteurs d'un artisan ou d'un commerce arrivent sur téléphone. Concevoir d'abord pour un écran de 390 px, puis enrichir pour l'ordinateur (`md:` / `lg:`).
- **Barre d'action fixée en bas** sur mobile uniquement (`md:hidden`, `position: fixed; bottom: 0`, `padding-bottom: env(safe-area-inset-bottom)`) avec les 1 ou 2 actions du métier : « Appeler » (`tel:`) + « Devis » / « Réserver » / « Rendez-vous ». Ajouter un `padding-bottom` au `body` sur mobile pour qu'elle ne cache rien.
- **Page courte** : 8 écrans maximum sur mobile. Pour y arriver : listes de cartes, avis et galeries en **carrousel horizontal** (`flex overflow-x-auto snap-x snap-mandatory`, cartes à `w-[82%]` ou `min-w-[280px]`, `scroll-padding`, bord de la carte suivante visible) ; listes longues en accordéon ; textes plus courts sur mobile ; sections à `py-14` sur mobile (`md:py-24` ensuite).
- **Jamais deux colonnes de texte côte à côte sous 640 px** (pas de `grid-cols-2` avec des paragraphes sur mobile) : une colonne ou un carrousel.
- **Zones tactiles de 44 px minimum** : boutons, liens du menu, `summary` des FAQ (`py-4`), liens téléphone/e-mail (`inline-flex min-h-11 items-center`), logo (`min-h-11`).
- **Boutons d'action pleine largeur sur mobile** (`w-full sm:w-auto`), empilés.
- **Typographie** : texte courant 16 px minimum, titres en `clamp()` ou `text-4xl sm:text-6xl` (jamais de titre qui déborde) ; champs de formulaire en 16 px minimum (sinon l'iPhone zoome).
- **Premier écran** : nom, promesse, et un bouton d'action visible sans faire défiler. L'illustration du héros passe sous le texte et reste compacte (hauteur max ~40 % de l'écran).
- **Menu mobile** : bouton avec `aria-expanded`, panneau plein écran ou déroulant avec liens de 48 px de haut, fermeture au clic sur un lien.

### 3. Enregistrer la fiche
Ajouter l'entrée **à la fin** de `catalog.json > templates` avec tous les champs : `slug, title, tagline, description, univers, style, couleur, pages, prix, date (AAAA-MM-JJ, heure de Paris), tags, sections, palette, shopify_url: "", shopify_product_id: ""`.
- `title` : un nom court et évocateur, unique. `tagline` : « Site vitrine pour <métier> ».
- Prix : 29 € pour une page, 39 € pour 2 à 4 pages, 49 € au-delà.
- `tags` : 6 à 10 mots que tape un client (métier, synonymes, spécialités).

### 4. Construire et vérifier
1. `node build.mjs` (s'arrête en cas de fiche invalide : corriger).
2. **Contrôle mobile obligatoire** : `python3 tools/audit-mobile.py <slug>` doit afficher « OK ». Sinon, corriger chaque point listé et relancer jusqu'à « OK ». Ne jamais publier un template « À CORRIGER ».
3. Regarder avec Read `shots/<slug>/mobile.jpg` (rendu téléphone, créé par l'audit) **puis** `shots/<slug>/thumb.jpg` et `full.jpg`. Corriger tout défaut visible (chevauchement, texte coupé, carrousel qui ne montre pas la carte suivante, barre fixe qui cache du contenu) avant de continuer.

### 5. Publier (directement, sans validation : le propriétaire vérifie sur la boutique)
1. `git add -A && git commit -m "Nouveau template : <title> (<métier>)"`, puis `git pull --rebase` (quelqu'un a pu pousser entre-temps ; en cas de conflit uniquement dans `dist/`, `shots/` ou `packages/` : `git checkout --ours -- dist shots packages`, relancer `node build.mjs` qui régénère tout, puis `git add -A` et `git rebase --continue` ; en cas de conflit dans `catalog.json`, garder les deux fiches), puis `git push`. `node build.mjs` a créé `dl_token` dans la fiche et copié le zip dans `dist/dl/<dl_token>/` (lien de téléchargement secret, non indexé).
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
