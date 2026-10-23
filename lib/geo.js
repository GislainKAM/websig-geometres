// Géométrie de base. Coordonnées en [lat, lon], degrés décimaux.

/** Distance orthodromique en km. */
export function distanceKm(a, b) {
  const R = 6371;
  const dLa = (b[0] - a[0]) * Math.PI / 180;
  const dLo = (b[1] - a[1]) * Math.PI / 180;
  const h = Math.sin(dLa / 2) ** 2
    + Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Distance affichée. Les membres sont placés au centre de leur ville, pas à
 * leur adresse : donner des mètres serait une fausse précision. On arrondit au
 * kilomètre.
 */
export function formatKm(d) {
  if (d < 1) return '< 1 km';
  return Math.round(d) + ' km';
}

/** « MEFFO BOGNENG Irene Epse LEUTOU » → « MI » (premier et dernier mot du nom propre). */
export function initiales(nom) {
  const mots = nom.replace(/\b(Epse|Ep)\b.*/i, '').split(/\s+/).filter(Boolean);
  const a = (mots[0] || '')[0] || '';
  const b = mots.length > 1 ? (mots[mots.length - 1] || '')[0] || '' : '';
  return (a + b).toUpperCase();
}

/** Tuiles raster centrées sur un point, pour les vignettes aériennes (CSS absolu). */
export function lonToPx(lon, z) { return (lon + 180) / 360 * Math.pow(2, z) * 256; }
export function latToPx(lat, z) {
  const r = lat * Math.PI / 180;
  return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * Math.pow(2, z) * 256;
}
