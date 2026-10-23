// Textes de l'interface, FR/EN. Le français est la langue de référence.
//
// Repris du prototype de refonte du 23 octobre 2026, avec des retraits
// assumés : le prototype promettait des délais de traitement de l'Ordre, une
// référence de dossier, un envoi de photo et un « service de l'Ordre » — rien
// de cela n'existe, l'app étant statique et non validée par l'Ordre. Les
// textes correspondants ont été réécrits (voir lib/dico.js et FAQ ci-dessous).
import { DICO } from './dico.js';

export function dico(lang) {
  const i = lang === 'EN' ? 1 : 0;
  const t = {};
  for (const k of Object.keys(DICO)) t[k] = DICO[k][i];
  return t;
}

// Libellés de catégories, d'après les précisions d'un membre du Bureau du Conseil
// de l'Ordre (courriel du 14 octobre 2026) : la première lettre du matricule
// distingue les catégories — C Géomètres-Topographes, B Géomètres-Experts, A
// Géomètres-Experts agréés en clientèle privée (numéro d'agrément) — et les
// membres honoraires sont ceux officiellement admis à l'honorariat. « Géomètre-
// Expert » n'est pas « géomètre assermenté » : ne pas employer ce second terme.
// Le prototype appelait les experts « service public » : c'était une hypothèse
// fausse, retirée.
export const CAT = {
  FR: {
    privee: { label: 'Géomètre-Expert agréé en clientèle privée', chip: 'Clientèle privée', desc: "Géomètre-Expert ayant sollicité et obtenu l'agrément pour exercer en clientèle privée. Numéro d'agrément commençant par A." },
    experts: { label: 'Géomètre-Expert', chip: 'Géomètres-Experts', desc: 'Matricule commençant par B.' },
    topo: { label: 'Géomètre-Topographe', chip: 'Géomètres-Topographes', desc: 'Matricule commençant par C.' },
    honoraires: { label: 'Membre honoraire', chip: 'Honoraires', desc: "Officiellement admis à l'honorariat par l'Ordre, au regard de son parcours et de sa contribution à la profession." }
  },
  EN: {
    privee: { label: 'Chartered Surveyor approved for private practice', chip: 'Private practice', desc: 'Chartered Surveyor (Géomètre-Expert) who applied for and obtained the approval to practise privately. Approval number starting with A.' },
    experts: { label: 'Chartered Surveyor (Géomètre-Expert)', chip: 'Chartered Surveyors', desc: 'Registration number starting with B.' },
    topo: { label: 'Land Surveyor-Topographer', chip: 'Topographers', desc: 'Registration number starting with C.' },
    honoraires: { label: 'Honorary member', chip: 'Honorary', desc: 'Officially admitted to honorary status by the Order, in view of their career and contribution to the profession.' }
  }
};

// Types de signalement. `maj` est le parcours d'un géomètre inscrit.
export const TYPES = {
  FR: [
    { v: 'faux', l: 'Une personne se dit géomètre mais n\'apparaît pas sur la carte' },
    { v: 'fiche', l: 'Les informations d\'une fiche sont fausses ou anciennes' },
    { v: 'travaux', l: 'Un bornage ou des travaux posent problème' },
    { v: 'maj', l: 'Je suis géomètre inscrit : mettre à jour ma fiche' },
    { v: 'question', l: 'J\'ai une autre question pour l\'Ordre' }
  ],
  EN: [
    { v: 'faux', l: 'Someone claims to be a surveyor but is not on the map' },
    { v: 'fiche', l: 'A profile\'s information is wrong or outdated' },
    { v: 'travaux', l: 'A boundary survey or works are causing a problem' },
    { v: 'maj', l: 'I am a registered surveyor: update my profile' },
    { v: 'question', l: 'I have another question for the Order' }
  ]
};

export const FAQ = {
  FR: [
    { q: 'Comment savoir si un géomètre a le droit d\'exercer ?', a: 'Cherchez son nom ou son numéro d\'inscription (une lettre suivie de trois chiffres, par exemple A055). S\'il apparaît avec la mention « Inscrit au tableau 2026 », il figure au tableau de l\'Ordre pour cette année. En cas de doute, demandez confirmation à l\'Ordre.' },
    { q: 'Quelle différence entre les types de géomètres ?', a: "La première lettre du matricule les distingue : C pour les Géomètres-Topographes, B pour les Géomètres-Experts. Les Géomètres-Experts agréés en clientèle privée ont un numéro d'agrément commençant par A. Les membres honoraires sont ceux que l'Ordre a officiellement admis à l'honorariat. « Géomètre-Expert » et « géomètre assermenté » ne désignent pas nécessairement le même statut." },
    { q: 'Le géomètre qu\'on m\'a présenté n\'apparaît pas. Que faire ?', a: 'Vérifiez l\'orthographe du nom ou cherchez son numéro. S\'il reste introuvable, ne versez aucune somme et signalez-le à l\'Ordre.' },
    { q: 'Combien coûte un bornage ?', a: 'Les honoraires sont encadrés par l\'Ordre. Demandez toujours un devis écrit et signé avant le début des travaux, et un reçu pour chaque versement.' },
    { q: 'Ma position est-elle enregistrée ?', a: 'Non. « Autour de moi » utilise votre position uniquement dans votre navigateur, pour trier la liste. Elle n\'est ni envoyée ni conservée.' },
    { q: 'Puis-je utiliser la carte sans internet ?', a: 'Une fois la page chargée, la liste des géomètres reste consultable sans connexion. Le fond de carte, lui, a besoin d\'une connexion.' },
    { q: 'Je suis géomètre : comment corriger ma fiche ?', a: 'Ouvrez le menu, puis « Vous êtes géomètre ? ». Indiquez la correction et l\'emplacement de votre cabinet : un message est préparé pour l\'Ordre, qui décide de la publier.' }
  ],
  EN: [
    { q: 'How do I know if a surveyor may practise?', a: 'Search their name or registration number (one letter followed by three digits, e.g. A055). If they appear as “Registered for 2026”, they are on the Order\'s register for this year. If in doubt, ask the Order to confirm.' },
    { q: 'What is the difference between surveyor types?', a: 'The first letter of the registration number tells them apart: C for Land Surveyor-Topographers, B for Chartered Surveyors (Géomètres-Experts). Chartered Surveyors approved for private practice have an approval number starting with A. Honorary members are those the Order has officially admitted to honorary status. “Géomètre-Expert” and “sworn surveyor” do not necessarily mean the same status.' },
    { q: 'The surveyor I was introduced to is not listed. What should I do?', a: 'Check the spelling or search their number. If they still cannot be found, pay nothing and report it to the Order.' },
    { q: 'How much does a boundary survey cost?', a: 'Fees are regulated by the Order. Always ask for a written, signed quote before work starts, and a receipt for every payment.' },
    { q: 'Is my location stored?', a: 'No. “Near me” uses your location only in your browser, to sort the list. It is never sent or kept.' },
    { q: 'Can I use the map without internet?', a: 'Once the page is loaded, the list of surveyors stays available offline. The base map needs a connection.' },
    { q: 'I am a surveyor: how do I correct my profile?', a: 'Open the menu, then “Are you a surveyor?”. Enter the correction and your office location: a message is prepared for the Order, which decides whether to publish it.' }
  ]
};

const REG_EN = {
  'Centre': 'Centre', 'Littoral': 'Littoral', 'Ouest': 'West', 'Nord-Ouest': 'North-West', 'Sud-Ouest': 'South-West',
  'Est': 'East', 'Sud': 'South', 'Extrême-Nord': 'Far North', 'Nord': 'North', 'Adamaoua': 'Adamawa', 'Hors Cameroun': 'Outside Cameroon'
};

/** Nom de région dans la langue de l'interface. */
export function nomRegion(region, lang) {
  return lang === 'EN' ? (REG_EN[region] || region) : region;
}

/** Les deux écritures d'une région, pour la recherche. */
export function nomsRegion(region) {
  return [region, REG_EN[region] || region];
}

/** « 3 géomètres » / « 1 géomètre » — l'anglais et le français ont chacun leurs formes. */
export function pluriel(n, lang, fr, en) {
  const [fs, fp] = fr;
  const [es, ep] = en;
  return n + ' ' + (lang === 'EN' ? (n > 1 ? ep : es) : (n > 1 ? fp : fs));
}

/** 2026-08-19 → 19.08.2026 (JJ.MM.AAAA, convention du système de design). */
export function dateCourte(iso) {
  if (!iso) return '';
  const [a, m, j] = String(iso).split('-');
  return j && m && a ? `${j}.${m}.${a}` : iso;
}
