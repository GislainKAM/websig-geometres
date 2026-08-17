// Projection Web Mercator en tuiles — porté à l'identique du prototype
// (design/prototype-2026-08-17/Annuaire OGEC.dc.html) pour que le
// positionnement des marqueurs sur <MapFrame> (tuiles raster 256px,
// @websig/design) corresponde exactement à ce qui a été validé.
export function tileX(lon, z) {
  return (lon + 180) / 360 * Math.pow(2, z);
}

export function tileY(lat, z) {
  const r = (lat * Math.PI) / 180;
  return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * Math.pow(2, z);
}

/** Décalage en pixels d'un point (lat, lon) par rapport au centre de carte affiché. */
export function pxOffset(center, zoom, lat, lon) {
  const [cLat, cLon] = center;
  return [
    (tileX(lon, zoom) - tileX(cLon, zoom)) * 256,
    (tileY(lat, zoom) - tileY(cLat, zoom)) * 256
  ];
}

export const SCALE_LABELS = {
  4: '500 km', 5: '250 km', 6: '200 km', 7: '100 km', 8: '50 km', 9: '25 km',
  10: '10 km', 11: '5 km', 12: '2 km', 13: '1 km', 14: '500 m', 15: '250 m'
};

export function formatNumber(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
