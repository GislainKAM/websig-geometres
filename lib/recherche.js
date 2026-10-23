// Recherche et filtrage : fonctions pures, sans état React.
import { normalizeKey } from './villes.js';
import { QUARTIERS } from './quartiers.js';
import { nomsRegion } from './i18n.js';
import { distanceKm } from './geo.js';
import { parMatricule } from './geometres.js';

// Rayon de « Autour de moi » quand l'utilisateur n'a pas choisi de distance.
export const RAYON_AUTOUR_KM = 80;
export const RAYONS = [null, 2, 5, 10, 25, 50];

const TOUTES = 'Toutes';
export { TOUTES };

/** Filtres par défaut : toutes les catégories en activité, honoraires exclus. */
export function filtresInitiaux() {
  return { cats: { privee: true, experts: true, topo: true }, inclHon: false, region: TOUTES, city: TOUTES, radius: null };
}

/**
 * Liste filtrée, triée par matricule — ou par distance quand la liste est
 * ancrée à un point (position de l'utilisateur ou rayon choisi).
 *
 * La distance se mesure du point d'ancrage au CENTRE de la ville du membre :
 * le tableau ne donne pas d'adresse, mesurer jusqu'au point dispersé de la
 * carte afficherait des mètres qui n'existent pas.
 */
export function filtrer(geometres, { textQ, anchor, cats, inclHon, region, city, radius }) {
  let liste = geometres;
  if (textQ) {
    const k = normalizeKey(textQ);
    liste = liste.filter(m => normalizeKey(`${m.nom} ${m.cabinet} ${m.ville} ${m.identifiant} ${m.region}`).includes(k));
  }
  liste = liste.filter(m =>
    (m.profil === 'honoraires' ? (inclHon || !!textQ) : !!cats[m.profil])
    && (region === TOUTES || m.region === region)
    && (city === TOUTES || m.ville === city));

  let mesure = false;
  if (anchor) {
    if (anchor.kind === 'region') {
      liste = liste.filter(m => m.region === anchor.region);
    } else {
      liste = liste.filter(m => m.centre).map(m => ({ ...m, d: distanceKm(anchor.coord, m.centre) }));
      if (radius) liste = liste.filter(m => m.d <= radius);
      else if (anchor.kind === 'me') liste = liste.filter(m => m.d <= RAYON_AUTOUR_KM);
      else liste = liste.filter(m => m.ville === anchor.ville);
      mesure = anchor.kind === 'me' || !!radius;
    }
  }
  const tri = liste.slice();
  if (mesure) tri.sort((a, b) => a.d - b.d || parMatricule(a, b));
  else tri.sort(parMatricule);
  return { liste: tri, mesure };
}

/**
 * Ce que désigne la saisie : un quartier, une ville, une région, un numéro
 * d'inscription, ou du texte libre (nom, cabinet). L'ordre compte — un nom de
 * ville l'emporte sur une recherche textuelle qui le contiendrait.
 */
export function interpreter(saisie, { villes, regions, geometres }) {
  const k = normalizeKey(saisie);
  const quartier = Object.keys(QUARTIERS).find(n => normalizeKey(n) === k);
  if (quartier) {
    const [ville, coord] = QUARTIERS[quartier];
    return { type: 'quartier', anchor: { kind: 'quartier', label: `${quartier}, ${ville}`, ville, coord }, zoom: 13 };
  }
  const ville = villes.find(v => normalizeKey(v.ville) === k);
  if (ville) {
    return { type: 'ville', anchor: { kind: 'ville', label: ville.ville, ville: ville.ville, coord: [ville.lat, ville.lon] }, zoom: ville.count > 50 ? 12 : 13 };
  }
  const region = regions.find(r => nomsRegion(r).some(n => normalizeKey(n) === k));
  if (region) return { type: 'region', region };
  const membre = geometres.find(m => m.identifiant && normalizeKey(m.identifiant) === k);
  if (membre) return { type: 'matricule', membre };
  return { type: 'texte', textQ: saisie };
}

/** Centre moyen des villes d'une région, pour cadrer la carte. */
export function centreRegion(region, villes) {
  const vs = villes.filter(v => v.region === region);
  if (!vs.length) return null;
  return [vs.reduce((a, v) => a + v.lat, 0) / vs.length, vs.reduce((a, v) => a + v.lon, 0) / vs.length];
}
