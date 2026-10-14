// Page « On s'occupe de tout » (offres Clé en main / Sérénité + questionnaire) et page de suivi.
import { esc, metier } from './pages.mjs';

export const OFFRES = [
  {
    id: 'cle-en-main', nom: 'Clé en main', prix: '149 €', mensuel: '12 € / mois', annuel: 'ou 120 € / an',
    pitch: 'Votre site en ligne, à votre nom, sans rien toucher.',
    inclus: [
      'Le template de votre choix, rempli avec vos textes, photos et logo',
      'Nom de domaine à votre nom (.fr ou .com) inclus',
      'Hébergement rapide et sécurisé (https)',
      'Formulaire de contact relié à votre e-mail',
      'Mentions légales préparées',
      'Référencement de base : titres, descriptions, déclaration à Google',
      'Une série de corrections avant la mise en ligne',
    ],
    ensuite: 'Ensuite, vous modifiez vous-même votre site avec le mode édition et nous le remettons en ligne.',
  },
  {
    id: 'serenite', nom: 'Sérénité', prix: '249 €', mensuel: '19 € / mois', annuel: '',
    pitch: 'Tout Clé en main, et nous faisons vivre votre site pour vous.',
    inclus: [
      'Tout ce que comprend Clé en main',
      '3 modifications par mois : textes, photos, horaires, tarifs, une section',
      'En ligne sous 72 h ouvrées, sur simple message',
      'Sauvegarde de chaque version, retour en arrière possible',
      'Vérification mensuelle : site en ligne, formulaire, liens',
      'Deux séries de corrections avant la mise en ligne',
    ],
    ensuite: 'Vous nous écrivez ce qu\'il faut changer, on s\'en occupe.',
    reco: true,
  },
];

const check = '<svg class="w-5 h-5 mt-0.5 shrink-0 text-sign" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12.5 9.5 17.5 19.5 7"/></svg>';

function offerCard(o) {
  return `<article class="relative flex flex-col rounded-3xl border ${o.reco ? 'border-ink shadow-card' : 'border-line'} bg-white p-6 md:p-8">
    ${o.reco ? '<p class="absolute -top-3.5 left-6 rounded-full bg-awning px-3 py-1 text-sm font-semibold">Le plus choisi</p>' : ''}
    <h3 class="font-display font-bold text-2xl md:text-3xl">${o.nom}</h3>
    <p class="mt-2 text-ink/70">${o.pitch}</p>
    <p class="mt-5 flex flex-wrap items-baseline gap-x-2"><span class="font-display font-extrabold text-4xl">${o.prix}</span><span class="text-ink/70">à la mise en ligne</span></p>
    <p class="mt-1 text-ink/80"><span class="font-semibold">puis ${o.mensuel}</span>${o.annuel ? ` <span class="text-ink/60">${o.annuel}</span>` : ''}</p>
    <ul class="mt-6 space-y-3 text-[15px] md:text-base">${o.inclus.map(i => `<li class="flex gap-3">${check}<span>${i}</span></li>`).join('')}</ul>
    <p class="mt-6 rounded-xl bg-mist p-4 text-[15px] text-ink/75">${o.ensuite}</p>
    <a href="#questionnaire" data-offre="${o.id}" class="${o.reco ? 'btn-sign' : 'btn-line'} mt-6 w-full justify-center">Choisir ${o.nom}</a>
  </article>`;
}

const field = (label, input, hint = '') => `<label class="flex flex-col gap-1.5"><span class="font-semibold">${label}</span>${hint ? `<span class="text-sm text-ink/60 -mt-1">${hint}</span>` : ''}${input}</label>`;

export function offrePage(cat) {
  const tpl = [...cat.templates].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
  const steps = [
    ['Vous choisissez', 'Un template du catalogue et la formule qui vous convient.'],
    ['Vous nous parlez de vous', 'Un questionnaire de 5 minutes : activité, prestations, horaires, coordonnées.'],
    ['Nous préparons votre démo', 'Votre site avec vos textes, visible sur un lien privé, sous 5 jours ouvrés. Gratuit et sans engagement.'],
    ['Vous validez, on met en ligne', 'Vous demandez vos corrections, vous réglez, et votre site est en ligne à votre nom.'],
  ];
  return `
<section class="mx-auto max-w-6xl px-4 sm:px-6 pt-8 md:pt-16">
  <p class="inline-flex rounded-full bg-mist px-3 py-1 text-sm font-semibold">Pas le temps ? On s'en charge</p>
  <h1 class="mt-4 font-display font-extrabold text-[2.4rem] leading-[1.05] sm:text-6xl tracking-tight max-w-3xl">Votre site vitrine en ligne, sans rien toucher.</h1>
  <p class="mt-5 text-lg text-ink/75 max-w-2xl">Vous choisissez un template, vous répondez à quelques questions. Nous préparons votre site avec vos textes, vous le voyez avant de payer, puis nous le mettons en ligne avec votre nom de domaine.</p>
  <div class="mt-7 flex flex-col sm:flex-row gap-3">
    <a href="#questionnaire" class="btn-sign w-full sm:w-auto justify-center">Recevoir ma démo gratuite</a>
    <a href="#formules" class="btn-line w-full sm:w-auto justify-center">Voir les formules</a>
  </div>
</section>

<section class="mx-auto max-w-6xl px-4 sm:px-6 pt-14 md:pt-20" aria-labelledby="etapes">
  <h2 id="etapes" class="font-display font-bold text-3xl md:text-4xl">Comment ça se passe</h2>
  <ol class="mt-6 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-4 no-scrollbar">
    ${steps.map(([t, d], i) => `<li class="snap-start shrink-0 w-[78%] sm:w-auto rounded-2xl border border-line bg-white p-5"><p class="font-display font-extrabold text-3xl text-sign">${i + 1}</p><h3 class="mt-2 font-display font-bold text-xl">${t}</h3><p class="mt-2 text-ink/70">${d}</p></li>`).join('')}
  </ol>
</section>

<section id="formules" class="mx-auto max-w-6xl px-4 sm:px-6 pt-14 md:pt-20 scroll-mt-20" aria-labelledby="formules-titre">
  <h2 id="formules-titre" class="font-display font-bold text-3xl md:text-4xl">Deux formules, tout compris</h2>
  <p class="mt-3 text-ink/70 max-w-2xl">Le template, le nom de domaine et l'hébergement sont inclus. Engagement de 12 mois pour l'abonnement, puis sans engagement.</p>
  <div class="mt-8 grid md:grid-cols-2 gap-6 md:gap-8 items-start">${OFFRES.map(offerCard).join('')}</div>
  <p class="mt-6 text-ink/70">Vous préférez tout faire vous-même ? Chaque template s'achète aussi seul, à partir de 29 €, avec le <a href="/guide/" class="underline underline-offset-4">guide de mise en ligne</a>.</p>
</section>

<section id="questionnaire" class="mx-auto max-w-3xl px-4 sm:px-6 pt-14 md:pt-20 scroll-mt-20" aria-labelledby="q-titre">
  <h2 id="q-titre" class="font-display font-bold text-3xl md:text-4xl">Recevoir ma démo gratuite</h2>
  <p class="mt-3 text-ink/70">5 minutes. Rien à payer maintenant : vous ne réglez que si la démo vous plaît.</p>
  <form data-brief class="mt-8 rounded-3xl border border-line bg-white p-5 md:p-8" novalidate>
    <p class="text-sm font-semibold text-ink/60" data-brief-progress>Étape 1 sur 4</p>
    <div class="mt-2 h-1.5 rounded-full bg-mist overflow-hidden"><div class="h-full w-1/4 bg-sign transition-[width] duration-300" data-brief-bar></div></div>

    <fieldset data-step="1" class="mt-6 space-y-5">
      <legend class="font-display font-bold text-2xl">Formule et template</legend>
      <div class="grid sm:grid-cols-2 gap-3">
        ${OFFRES.map((o, i) => `<label class="flex items-start gap-3 rounded-2xl border border-line p-4 cursor-pointer has-[:checked]:border-ink has-[:checked]:bg-mist"><input type="radio" name="formule" value="${o.id}" class="mt-1 w-5 h-5 accent-[#0E5A47]" ${i === 1 ? 'checked' : ''}><span><span class="block font-semibold">${o.nom}</span><span class="text-sm text-ink/70">${o.prix} puis ${o.mensuel}</span></span></label>`).join('')}
      </div>
      ${field('Le template qui vous plaît', `<select name="template" class="kv-input"><option value="">Je ne sais pas encore : conseillez-moi</option>${tpl.map(t => `<option value="${t.slug}">${esc(t.title)} · ${esc(metier(t))}</option>`).join('')}</select>`, 'Vous pourrez en changer après la démo.')}
    </fieldset>

    <fieldset data-step="2" class="mt-6 space-y-5" hidden>
      <legend class="font-display font-bold text-2xl">Votre activité</legend>
      ${field('Nom de votre entreprise *', '<input name="entreprise" required maxlength="100" class="kv-input" autocomplete="organization">')}
      <div class="grid sm:grid-cols-2 gap-5">
        ${field('Votre métier *', '<input name="metier" required maxlength="100" class="kv-input" placeholder="Ex. ostéopathe, plombier, crêperie">')}
        ${field('Ville ou secteur *', '<input name="ville" required maxlength="100" class="kv-input" autocomplete="address-level2">')}
      </div>
      ${field('Présentez votre activité en quelques phrases *', '<textarea name="presentation" required rows="4" maxlength="2000" class="kv-input" placeholder="Depuis quand, pour qui, ce qui vous rend différent…"></textarea>')}
      ${field('Vos prestations et tarifs', '<textarea name="prestations" rows="4" maxlength="3000" class="kv-input" placeholder="Une par ligne, avec le prix si vous souhaitez l\'afficher"></textarea>')}
      ${field('Vos horaires', '<textarea name="horaires" rows="2" maxlength="600" class="kv-input" placeholder="Ex. du lundi au vendredi, 9 h – 18 h"></textarea>')}
    </fieldset>

    <fieldset data-step="3" class="mt-6 space-y-5" hidden>
      <legend class="font-display font-bold text-2xl">Ce qui s'affiche sur votre site</legend>
      <div class="grid sm:grid-cols-2 gap-5">
        ${field('Téléphone affiché', '<input name="tel_public" type="tel" maxlength="30" class="kv-input">')}
        ${field('E-mail affiché', '<input name="email_public" type="email" maxlength="254" class="kv-input">')}
      </div>
      ${field('Adresse (si vous recevez du public)', '<input name="adresse" maxlength="200" class="kv-input" autocomplete="street-address">')}
      ${field('Réseaux sociaux, avis Google, prise de rendez-vous', '<textarea name="liens" rows="2" maxlength="800" class="kv-input" placeholder="Collez vos liens, un par ligne"></textarea>')}
      <div class="space-y-3">
        <p class="font-semibold">Nom de domaine</p>
        <label class="flex items-center gap-3 min-h-11"><input type="radio" name="domaine_existant" value="non" checked class="w-5 h-5 accent-[#0E5A47]"> Je n'en ai pas encore</label>
        <label class="flex items-center gap-3 min-h-11"><input type="radio" name="domaine_existant" value="oui" class="w-5 h-5 accent-[#0E5A47]"> J'en ai déjà un</label>
        ${field('Nom souhaité ou actuel', '<input name="domaine" maxlength="100" class="kv-input" placeholder="Ex. plomberie-martin.fr">', 'Nous vérifions sa disponibilité.')}
      </div>
      <p class="rounded-xl bg-mist p-4 text-[15px] text-ink/75">Photos et logo : nous vous les demanderons après la démo. En attendant, nous utilisons les illustrations du template.</p>
    </fieldset>

    <fieldset data-step="4" class="mt-6 space-y-5" hidden>
      <legend class="font-display font-bold text-2xl">Pour vous envoyer la démo</legend>
      <div class="grid sm:grid-cols-2 gap-5">
        ${field('Prénom *', '<input name="prenom" required maxlength="60" class="kv-input" autocomplete="given-name">')}
        ${field('E-mail *', '<input name="email" type="email" required maxlength="254" class="kv-input" autocomplete="email">')}
      </div>
      ${field('Téléphone', '<input name="telephone" type="tel" maxlength="30" class="kv-input" autocomplete="tel">', 'Facultatif, si vous préférez qu\'on vous appelle.')}
      ${field('Autre chose à nous dire ?', '<textarea name="remarques" rows="3" maxlength="1500" class="kv-input"></textarea>')}
      <input name="site" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true">
      <label class="flex items-start gap-3"><input type="checkbox" name="consentement" required class="mt-1 w-5 h-5 shrink-0 accent-[#0E5A47]"><span class="text-[15px] text-ink/75">J'accepte que Kit Vitrine conserve ces informations pour préparer ma démo et me recontacter. <a href="/confidentialite/" class="underline">En savoir plus</a></span></label>
    </fieldset>

    <p class="mt-5 min-h-6 text-[15px] font-semibold text-red-700" data-brief-error role="alert"></p>
    <div class="mt-2 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
      <button type="button" class="btn-line w-full sm:w-auto justify-center" data-brief-prev hidden>Retour</button>
      <button type="button" class="btn-sign w-full sm:w-auto justify-center sm:ml-auto" data-brief-next>Continuer</button>
      <button type="submit" class="btn-sign w-full sm:w-auto justify-center sm:ml-auto" data-brief-submit hidden>Envoyer ma demande</button>
    </div>
  </form>
  <div data-brief-done hidden class="mt-8 rounded-3xl border border-ink bg-white p-6 md:p-8">
    <h3 class="font-display font-bold text-2xl">C'est reçu, merci !</h3>
    <p class="mt-3 text-ink/75">Nous préparons votre démo et vous l'envoyons sous 5 jours ouvrés. Vous pouvez suivre l'avancement à tout moment :</p>
    <a href="#" class="btn-sign mt-5 w-full sm:w-auto justify-center" data-brief-link>Suivre ma demande</a>
    <p class="mt-3 text-sm text-ink/60">Ce lien est personnel : gardez-le. Il est aussi enregistré sur cet appareil.</p>
  </div>
</section>

<section class="mx-auto max-w-3xl px-4 sm:px-6 pt-14 md:pt-20" aria-labelledby="faq-offre">
  <h2 id="faq-offre" class="font-display font-bold text-3xl md:text-4xl">Questions fréquentes</h2>
  <div class="mt-6 divide-y divide-line border-y border-line">
    ${[
      ['La démo est-elle vraiment gratuite ?', 'Oui. Vous ne payez qu\'après avoir vu votre site et décidé de le mettre en ligne. Sans réponse de votre part, la démo est supprimée au bout de 30 jours.'],
      ['Le nom de domaine m\'appartient-il ?', 'Oui, il est enregistré à votre nom. Si vous arrêtez l\'abonnement après la période d\'engagement, nous vous le transférons avec les fichiers de votre site.'],
      ['Et après 12 mois ?', 'L\'abonnement continue sans engagement : vous pouvez l\'arrêter à tout moment, avec un mois de préavis.'],
      ['Puis-je passer de Clé en main à Sérénité ?', 'Oui, à tout moment, en payant simplement la différence de mise en ligne.'],
      ['Qui fait les modifications de la formule Sérénité ?', 'Vous nous écrivez depuis votre espace, nous appliquons la modification et vous prévenons quand c\'est en ligne. Une demande qui dépasse le forfait fait l\'objet d\'un devis avant tout travail.'],
    ].map(([q, a]) => `<details class="group"><summary class="flex items-center justify-between gap-4 py-4 min-h-14 cursor-pointer list-none font-semibold text-lg">${q}<span class="text-2xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary><p class="pb-5 text-ink/75">${a}</p></details>`).join('')}
  </div>
</section>`;
}

export function suiviPage() {
  return `<section class="mx-auto max-w-2xl px-4 sm:px-6 pt-10 md:pt-16" data-suivi>
  <h1 class="font-display font-bold text-3xl md:text-4xl">Suivi de votre demande</h1>
  <p class="mt-3 text-ink/70" data-suivi-intro>Chargement…</p>
  <ol class="mt-8 space-y-0" data-suivi-steps hidden></ol>
  <div data-suivi-demo hidden class="mt-8 rounded-3xl border border-ink bg-white p-6"><h2 class="font-display font-bold text-2xl">Votre démo est prête</h2><p class="mt-2 text-ink/75">Regardez-la tranquillement, puis dites-nous ce qu'il faut corriger dans la messagerie.</p><a href="#" target="_blank" rel="noopener" class="btn-sign mt-5 w-full sm:w-auto justify-center" data-suivi-demo-link>Voir ma démo</a></div>
  <p class="mt-8"><button type="button" class="btn-line w-full sm:w-auto justify-center" data-open-chat>Une question ? Écrivez-nous</button></p>
</section>`;
}
