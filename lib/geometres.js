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
export const SOURCE = {
  document: tableau.source,
  dateTranscription: tableau.date_transcription,
  dateVerification: tableau.date_verification || null,
  statut: tableau.date_verification ? 'verifie' : 'brouillon-non-verifie'
};

// Un profil = une des 4 listes du tableau. Slugs et ordre calqués sur le
// prototype (design/prototype-2026-08-17, CATS) pour que la couleur d'une
// catégorie soit la même partout : swatch de filtre, marqueur carte, badge
// de fiche. Couleur = jeton sémantique de couche (packages/design/tokens/
// colors.css) : point=indigo, ligne=hydro, polygone=terrain, raster=relief.
export const PROFILS = [
  { slug: 'privee', cle: 'geometres_autorises', labelFr: 'Clientèle privée', labelEn: 'Private practice', color: 'var(--layer-point)', hex: '#46349e', tone: 'brand' },
  { slug: 'experts', cle: 'geometres_experts', labelFr: 'Experts assermentés', labelEn: 'Sworn experts', color: 'var(--layer-line)', hex: '#0e7c86', tone: 'hydro' },
  { slug: 'topo', cle: 'geometres_topographes', labelFr: 'Topographes', labelEn: 'Surveyors', color: 'var(--layer-polygon)', hex: '#46753c', tone: 'terrain' },
  { slug: 'honoraires', cle: 'geometres_experts_honoraires', labelFr: 'Honoraires', labelEn: 'Honorary', color: 'var(--layer-raster)', hex: '#b5772a', tone: 'relief' }
];

const PROFIL_BY_CLE = Object.fromEntries(PROFILS.map(p => [p.cle, p]));

// Dispersion déterministe (pas de Math.random — même rendu à chaque build)
// autour du centroïde de ville, uniquement pour éviter que les points d'une
// même ville se superposent pile. Le prototype fait la même chose et le dit
// explicitement à l'écran (voir lib/i18n.js, disclaimer) : position au
// chef-lieu déclaré, pas à l'adresse exacte — le tableau n'en donne pas.
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
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
        email: row.email || '',
        profil: profil.slug,
        ville: villeInfo.ville,
        pays: villeInfo.pays,
        villeResolue: villeInfo.resolue,
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

/**
 * Agrégats par ville pour le mode « Par ville » : un point par ville (pas
 * par personne), regroupés par pays pour approcher le regroupement par
 * région du prototype (on n'a pas la région administrative précise dans le
 * tableau, seulement la ville).
 */
export function getVilles() {
  const geometres = getGeometres();
  const byVille = new Map();
  for (const g of geometres) {
    if (!g.villeResolue) continue;
    if (!byVille.has(g.ville)) {
      // Centroïde réel de la ville, pas les coordonnées dispersées d'un
      // membre au hasard : resolveVille() est déterministe par nom de ville.
      const { lat, lon } = resolveVille(g.adresse);
      byVille.set(g.ville, { ville: g.ville, pays: g.pays, lat, lon, count: 0 });
    }
    byVille.get(g.ville).count += 1;
  }
  return [...byVille.values()].sort((a, b) => b.count - a.count);
}

export function getNonLocalisesCount() {
  return getGeometres().filter(g => !g.villeResolue).length;
}
