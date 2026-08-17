import tableau from '../data/ocr-draft/tableau-ogec-2026.json' with { type: 'json' };
import { resolveVille } from './villes.js';

// Statut de la source : voir data/ocr-draft/README.md. Toutes les colonnes
// du Tableau OGEC sont publiables (décision du 17 août 2026, document
// officiel déjà public) — mais la transcription elle-même n'a pas été
// relue. C'est ce statut, pas la publicabilité, que l'UI doit garder visible.
export const SOURCE = {
  document: tableau.source,
  dateTranscription: tableau.date_transcription,
  statut: 'brouillon-non-verifie'
};

const PROFILS = {
  geometres_autorises: { slug: 'clientele-privee', label: 'Clientèle privée' },
  geometres_experts: { slug: 'experts-assermentes', label: 'Experts assermentés' },
  geometres_topographes: { slug: 'topographes', label: 'Topographes' },
  geometres_experts_honoraires: { slug: 'honoraires', label: 'Honoraires' }
};

export const PROFIL_LIST = Object.values(PROFILS);

function buildGeometres() {
  const out = [];
  for (const [key, rows] of Object.entries(tableau.listes)) {
    const profil = PROFILS[key];
    if (!profil) continue;
    for (const row of rows) {
      if (!row.nom) continue;
      const villeInfo = resolveVille(row.adresse);
      out.push({
        id: `${profil.slug}-${row.numero_agrement || row.matricule || row.numero}`,
        nom: row.nom,
        identifiant: row.numero_agrement || row.matricule || '',
        cabinet: row.cabinet || row.lieu_service || '',
        adresse: row.adresse || '',
        contact: row.contact || '',
        email: row.email || '',
        profil: profil.slug,
        profilLabel: profil.label,
        ville: villeInfo.ville,
        pays: villeInfo.pays,
        lat: villeInfo.lat,
        lon: villeInfo.lon,
        villeResolue: villeInfo.resolue
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

/**
 * Agrégats par ville pour les symboles proportionnels de la carte. Un point
 * par ville (pas par personne) : le tableau ne donne jamais d'adresse plus
 * précise, un pin par personne à la même coordonnée n'ajouterait rien.
 */
export function getVilles() {
  const geometres = getGeometres();
  const byVille = new Map();
  for (const g of geometres) {
    if (!g.villeResolue) continue;
    const key = g.ville;
    if (!byVille.has(key)) {
      byVille.set(key, { ville: g.ville, pays: g.pays, lat: g.lat, lon: g.lon, count: 0 });
    }
    byVille.get(key).count += 1;
  }
  return [...byVille.values()].sort((a, b) => b.count - a.count);
}

export function getNonLocalisesCount() {
  return getGeometres().filter(g => !g.villeResolue).length;
}
