// Static text pages. Text between [crochets] must be completed before opening sales.
export const legalPages = [
  ['guide', 'Guide : personnaliser et mettre en ligne votre site', `
<p>Pas besoin de savoir coder. Comptez une trentaine de minutes entre le téléchargement et votre site en ligne.</p>
<h2>1. Ouvrir le dossier</h2>
<p>Après l'achat, vous recevez un lien de téléchargement. Enregistrez le fichier .zip, puis faites un clic droit et « Extraire tout » (Windows) ou double-cliquez dessus (Mac). Vous obtenez un dossier qui contient tout le site.</p>
<h2>2. Modifier les textes, directement sur la page</h2>
<ul>
<li>Double-cliquez sur <strong>MODIFIER-MON-SITE.html</strong> : votre site s'ouvre dans votre navigateur, en mode édition.</li>
<li>Cliquez sur n'importe quel texte et tapez par-dessus : nom, slogan, tarifs, horaires, avis, questions fréquentes.</li>
<li>Le téléphone et l'e-mail se mettent à jour partout où on clique dessus.</li>
<li>Cliquez sur <strong>Télécharger ma page</strong>, puis remplacez le fichier <strong>index.html</strong> du dossier par celui qui vient d'arriver dans vos Téléchargements.</li>
</ul>
<p>Vous pouvez essayer ce mode édition avant d'acheter : ouvrez la démo d'un template et cliquez sur « Essayer l'édition ».</p>
<p>Vous êtes à l'aise avec un éditeur de texte ? Ouvrez index.html dans VS Code ou Notepad++, cherchez le texte avec Ctrl+F et remplacez-le.</p>
<h2>3. Relier le formulaire de contact</h2>
<p>Le formulaire n'envoie rien tant qu'il n'est pas relié à un service gratuit. Le plus simple :</p>
<ul>
<li><strong>Si vous publiez sur Netlify</strong> : ajoutez <code>data-netlify="true"</code> dans la balise &lt;form&gt;. Les messages arrivent dans votre espace Netlify et par e-mail.</li>
<li><strong>Ailleurs</strong> : créez un formulaire gratuit sur Formspree et remplacez <code>action="#"</code> par l'adresse qu'il vous donne.</li>
</ul>
<h2>4. Mettre le site en ligne</h2>
<ul>
<li><strong>La solution la plus simple, gratuite</strong> : ouvrez <strong>app.netlify.com/drop</strong>, créez un compte et glissez le dossier du site dans la page. Votre site est en ligne en une minute, à une adresse du type monsite.netlify.app.</li>
<li><strong>Avec votre hébergeur</strong> (OVH, o2switch, Ionos…) : envoyez le contenu du dossier par FTP ou via le gestionnaire de fichiers de votre espace client.</li>
<li><strong>Votre propre adresse</strong> (moncabinet.fr) : achetez le nom de domaine chez un registraire, puis reliez-le depuis votre hébergeur. Comptez une dizaine d'euros par an.</li>
</ul>
<h2>5. Ajouter vos mentions légales</h2>
<p>Elles sont obligatoires pour un site professionnel en France : nom ou raison sociale, adresse, SIRET, contact et hébergeur. Le lien « Mentions légales » en bas de page est prévu pour cela.</p>
<h2>Pour aller plus loin : changer les couleurs</h2>
<p>Les couleurs et les polices se règlent dans <strong>tailwind.config.js</strong>. Il faut ensuite recompiler la feuille de style avec Node.js (deux commandes, expliquées dans le fichier LISEZMOI.md du dossier).</p>`],
  ['licence', 'Licence', `
<p>Chaque achat donne droit à une licence pour <strong>un site web</strong>, que ce soit le vôtre ou celui d'un client.</p>
<h2>Ce que vous pouvez faire</h2>
<ul><li>Utiliser le template pour un site, commercial ou non.</li><li>Modifier librement le code, les textes, les couleurs et la mise en page.</li><li>Livrer le site terminé à un client.</li></ul>
<h2>Ce que vous ne pouvez pas faire</h2>
<ul><li>Revendre ou partager le template en tant que template, modifié ou non.</li><li>L'intégrer à un générateur de sites ou à une offre de templates.</li></ul>
<p>Pour plusieurs sites, achetez une licence par site.</p>`],
  ['faq', 'Questions fréquentes', `
<h2>Faut-il savoir coder ?</h2>
<p>Non. Chaque template a un mode édition : vous cliquez sur un texte, vous le modifiez, vous téléchargez votre page. Tout est expliqué dans le <a href="/guide/" class="underline">guide</a>, et vous pouvez l'essayer sur la démo avant d'acheter.</p>
<h2>Comment je reçois le template ?</h2>
<p>Un lien de téléchargement arrive par e-mail juste après le paiement. Il contient un fichier .zip avec le site prêt à publier.</p>
<h2>Où héberger le site ?</h2>
<p>Partout : Netlify (gratuit pour un site vitrine), OVH, o2switch, Ionos, ou tout hébergeur qui accepte des fichiers HTML.</p>
<h2>Le formulaire de contact fonctionne-t-il ?</h2>
<p>Il doit être relié à un service d'envoi comme Netlify Forms ou Formspree. Le guide explique comment faire en deux minutes.</p>
<h2>Et WordPress ?</h2>
<p>Les templates sont en HTML et Tailwind CSS. Ils ne s'installent pas comme un thème WordPress, mais sont plus rapides, plus sûrs et ne demandent aucune mise à jour.</p>
<h2>Puis-je être remboursé ?</h2>
<p>Le contenu est téléchargé immédiatement, vous renoncez donc au droit de rétractation au moment de l'achat. La démo en ligne vous permet de tout vérifier avant. En cas de fichier défectueux, nous le corrigeons ou le remboursons.</p>`],
  ['mentions-legales', 'Mentions légales', `
<p><strong>Éditeur du site</strong> : [Nom et prénom ou raison sociale], [statut, ex. entrepreneur individuel], [adresse], SIRET [numéro], e-mail : [adresse de contact].</p>
<p><strong>Directeur de la publication</strong> : [Nom et prénom].</p>
<p><strong>Hébergeur</strong> : Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis.</p>
<p><strong>Boutique et paiement</strong> : Shopify International Limited, Dublin, Irlande.</p>
<p>Les textes, images et codes des templates sont la propriété de l'éditeur. Les contenus des démos (noms, coordonnées, avis) sont fictifs.</p>`],
  ['cgv', 'Conditions générales de vente', `
<p>[À compléter et à faire relire avant l'ouverture des ventes.]</p>
<h2>Produits</h2><p>Kit Vitrine vend des fichiers numériques (templates de sites web) livrés par téléchargement.</p>
<h2>Prix</h2><p>Les prix sont indiqués en euros, toutes taxes comprises [ou : TVA non applicable, art. 293 B du CGI].</p>
<h2>Livraison</h2><p>Le lien de téléchargement est envoyé par e-mail dès la confirmation du paiement.</p>
<h2>Droit de rétractation</h2><p>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques fournis immédiatement, avec l'accord exprès de l'acheteur et sa renonciation à ce droit.</p>
<h2>Licence</h2><p>L'achat donne droit à la licence décrite sur la page <a href="/licence/" class="underline">Licence</a>.</p>
<h2>Médiation</h2><p>[Coordonnées du médiateur de la consommation choisi.]</p>`],
  ['confidentialite', 'Politique de confidentialité', `
<p>Ce site ne dépose aucun cookie publicitaire et n'utilise aucun outil de suivi. Les polices sont hébergées avec le site.</p>
<p>Lors d'un achat, vos données (nom, e-mail, informations de paiement) sont traitées par Shopify pour exécuter la commande et envoyer le lien de téléchargement. Elles sont conservées pendant la durée légale de conservation des factures.</p>
<p>Vous pouvez demander l'accès, la rectification ou la suppression de vos données à : [adresse de contact].</p>`],
];
