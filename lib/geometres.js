import tableau from '../data/ocr-draft/tableau-ogec-2026.json' with { type: 'json' };
import { resolveVille } from './villes.js';

// Statut de la source : voir data/ocr-draft/README.md. Toutes les colonnes
// du Tableau OGEC sont publiables (décision du 17 août 2026, document
// officiel déjà public) — la publicabilité et l'exactitude de la
// transcription sont deux axes différents, ce champ ne couvre que le second.
//
// `verifie` depuis la relecture du 19 août 2026 : listes 1 et 2 (45
// entrées) relues intégralement, listes 3 et 4 échantillonnées largement,
// plus un contrôle structurel intégral (identifiants et noms sans doublon,
// emails syntaxiquement valides) — zéro écart trouvé nulle part. Reste hors
// du périmètre de ce statut : la validation institutionnelle par l'Ordre
// lui-même (qui répond d'une erreur), toujours ouverte — voir BRIEF.md §1.
// Inscriptions ajoutées après la transcription du tableau, d'après une décision
// de l'Ordre (champ `decision` de la ligne). Elles n'ont pas été relues : le
// statut « relue » ci-dessus ne les couvre pas, l'interface le dit.
const AJOUTS = Object.values(tableau.listes).flat().filter(r => r.decision);

export const SOURCE = {
  ajouts: { n: AJOUTS.length, decisions: [...new Set(AJOUTS.map(r => r.decision))] },
  document: tableau.source,
  dateTranscription: tableau.date_transcription,
  dateVerification: tableau.date_verification || null,
  statut: tableau.date_verification ? 'verifie' : 'brouillon-non-verifie'
};

// Un profil = une des 4 listes du tableau. Le symbole de carte est un couple
// forme + teinte (carré plein, rond plein, losange, rond vide) : la forme porte
// l'information, la teinte seule ne suffit pas à un daltonien. Libellés et
// descriptions : lib/i18n.js (CAT). Les slugs restent ceux du prototype
// d'août 2026 pour ne pas casser les liens et les ids existants.
export const PROFILS = [
  { slug: 'privee', cle: 'geometres_autorises', symbole: 'carre-plein' },
  { slug: 'experts', cle: 'geometres_experts', symbole: 'rond-plein' },
  { slug: 'topo', cle: 'geometres_topographes', symbole: 'losange' },
  { slug: 'honoraires', cle: 'geometres_experts_honoraires', symbole: 'rond' }
];

// Catégories proposées en puces de filtre. Les honoraires n'exercent plus :
// ils ne sont inclus que sur demande (ou quand on cherche un nom précis).
export const PROFILS_ACTIFS = PROFILS.filter(p => p.slug !== 'honoraires').map(p => p.slug);

const PROFIL_BY_CLE = Object.fromEntries(PROFILS.map(p => [p.cle, p]));

// Dispersion déterministe (pas de Math.random — même rendu à chaque build)
// autour du centroïde de ville, uniquement pour éviter que les points d'une
// même ville se superposent pile. Position au chef-lieu déclaré, pas à
// l'adresse exacte — le tableau n'en donne pas (voir CLAUDE.md).
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}

/**
 * Numéros de téléphone d'une cellule « contact » du tableau. Les cellules
 * mélangent séparateurs (« / »), indicatifs, mentions (« whatsapp ») : on
 * garde chaque numéro tel qu'écrit pour l'affichage, et on en tire une forme
 * composable (`tel:`). Un numéro à 9 chiffres commençant par 6 est un mobile
 * camerounais : indicatif +237.
 */
export function parseTelephones(contact) {
  if (!contact) return [];
  return contact.split('/').map(s => s.trim()).filter(Boolean).map(brut => {
    // Mentions entre parenthèses sans chiffre (« (whatsapp) ») : retirées de
    // l'affichage comme du numéro. « (+237) » garde son indicatif.
    const affiche = brut.replace(/\s*\([^\d+)]*\)/g, '').replace(/[a-z].*$/i, '').trim();
    let compose = affiche.replace(/[^\d+]/g, '');
    if (compose.length < 6) return null;
    if (!compose.startsWith('+') && compose.length === 9 && compose.startsWith('6')) compose = '+237' + compose;
    return { affiche, compose };
  }).filter(Boolean);
}

function buildGeometres() {
  const out = [];
  for (const [cle, rows] of Object.entries(tableau.listes)) {
    const profil = PROFIL_BY_CLE[cle];
    if (!profil) continue;
    for (const row of rows) {
      if (!row.nom) continue;
      const villeInfo = resolveVille(row.adresse);
      const id = `${profil.slug}-${row.numero_agrement || row.matricule || row.numero}`;
      const jitter = (hashSeed(id) - 0.5) * 0.09;
      const jitter2 = (hashSeed(id + '·') - 0.5) * 0.09;
      out.push({
        id,
        nom: row.nom,
        identifiant: row.numero_agrement || row.matricule || '',
        cabinet: row.cabinet || row.lieu_service || '',
        adresse: row.adresse || '',
        contact: row.contact || '',
        telephones: parseTelephones(row.contact),
        email: row.email || '',
        decision: row.decision || '',
        profil: profil.slug,
        ville: villeInfo.ville,
        pays: villeInfo.pays,
        region: villeInfo.region,
        villeResolue: villeInfo.resolue,
        // Centre de la ville : sert aux distances. Le point affiché sur la
        // carte (lat/lon) est dispersé autour — jamais à utiliser pour mesurer.
        centre: villeInfo.resolue ? [villeInfo.lat, villeInfo.lon] : null,
        lat: villeInfo.resolue ? villeInfo.lat + jitter : null,
        lon: villeInfo.resolue ? villeInfo.lon + jitter2 : null
      });
    }
  }
  return out.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
}

let cache = null;
export function getGeometres() {
  if (!cache) cache = buildGeometres();
  return cache;
}

export function getProfil(slug) {
  return PROFILS.find(p => p.slug === slug);
}

/** Comparateur matricule : lettre de série puis numéro (A011 < A033 < B053). */
export function parMatricule(a, b) {
  const ma = String(a.identifiant).match(/^([A-Za-z]*)(\d*)/);
  const mb = String(b.identifiant).match(/^([A-Za-z]*)(\d*)/);
  return ma[1].localeCompare(mb[1], 'fr')
    || (Number(ma[2]) - Number(mb[2]))
    || a.identifiant.localeCompare(b.identifiant, 'fr');
}

/**
 * Agrégats par ville : un point par ville, avec son centroïde réel
 * (resolveVille est déterministe par nom de ville) et sa région. Sert aux
 * listes de lieux ; la carte, elle, agrège la liste filtrée à la volée.
 */
export function getVilles() {
  const geometres = getGeometres();
  const byVille = new Map();
  for (const g of geometres) {
    if (!g.villeResolue) continue;
    if (!byVille.has(g.ville)) {
      byVille.set(g.ville, { ville: g.ville, pays: g.pays, region: g.region, lat: g.centre[0], lon: g.centre[1], count: 0 });
    }
    byVille.get(g.ville).count += 1;
  }
  return [...byVille.values()].sort((a, b) => b.count - a.count);
}

export function getNonLocalisesCount() {
  return getGeometres().filter(g => !g.villeResolue).length;
}
