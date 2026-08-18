import limites from '../data/limites/cameroun-adm0.json' with { type: 'json' };

// Contours du Cameroun — geoBoundaries ADM0 simplifié (CC-BY 3.0, voir
// data/limites/README.md). Sert à deux choses : tracer la frontière, et
// creuser le trou du masque.
export const CAMEROUN = limites.features[0];

// Anneaux extérieurs du pays, à plat (le fichier ADM0 est un Polygon simple,
// mais on gère MultiPolygon pour ne pas casser si la source change).
function ringsOf(geometry) {
  if (geometry.type === 'Polygon') return [geometry.coordinates[0]];
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.map(p => p[0]);
  return [];
}

export const CAMEROUN_RINGS = ringsOf(CAMEROUN.geometry);

export const CAMEROUN_BBOX = (() => {
  let minX = 180, minY = 90, maxX = -180, maxY = -90;
  for (const ring of CAMEROUN_RINGS) {
    for (const [x, y] of ring) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  return [[minX, minY], [maxX, maxY]];
})();

const MONDE = [[-180, -85], [180, -85], [180, 85], [-180, 85], [-180, -85]];

/** Cercle géodésique approché, en degrés — pour le masque resserré sur une ville. */
function cercle(lon, lat, rayonKm, points = 64) {
  const ring = [];
  const dLat = rayonKm / 110.574;
  const dLon = rayonKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * 2 * Math.PI;
    ring.push([lon + dLon * Math.cos(a), lat + dLat * Math.sin(a)]);
  }
  return ring;
}

/**
 * Polygone « monde entier moins la zone en focus » : un anneau extérieur qui
 * couvre la planète, et la zone en focus en anneau intérieur (trou). Rendu en
 * fill sombre semi-transparent, ça éteint tout ce qui n'est pas concerné et
 * laisse la zone filtrée en pleine lumière.
 *
 * @param {{lon:number, lat:number, rayonKm:number}|null} focus — zone à
 *   éclairer ; `null` éclaire le Cameroun entier.
 */
export function buildMask(focus) {
  const trous = focus
    ? [cercle(focus.lon, focus.lat, focus.rayonKm)]
    : CAMEROUN_RINGS;
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [MONDE, ...trous] }
  };
}

/**
 * Emprise de la zone en focus, pour y cadrer la caméra — c'est ce que doit
 * viser la « vue étendue » quand un filtre est actif : cadrer le pays entier
 * alors que le masque n'éclaire qu'une ville n'aide personne.
 */
export function focusBounds(focus) {
  let minX = 180, minY = 90, maxX = -180, maxY = -90;
  for (const [x, y] of cercle(focus.lon, focus.lat, focus.rayonKm)) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return [[minX, minY], [maxX, maxY]];
}

/** Contour de la zone en focus, pour la souligner d'un trait. */
export function buildFocusOutline(focus) {
  if (!focus) return CAMEROUN;
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [cercle(focus.lon, focus.lat, focus.rayonKm)] }
  };
}
