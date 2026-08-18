/**
 * Déplacement de caméra à appliquer pour qu'une bulle tienne entière dans le
 * cadre de la carte.
 *
 * Le conteneur MapLibre est en `overflow: hidden` : une bulle ancrée près
 * d'un bord est rognée, pas seulement débordante. Le cas se rencontre dès que
 * la carte se raccourcit — table attributaire déployée en mode Analyser,
 * écran bas — parce que la bulle ne tient alors ni au-dessus ni en dessous
 * du point.
 *
 * Convention de signe : `map.panBy([dx, dy])` déplace la *vue* de ce vecteur,
 * donc les entités glissent en sens inverse. Un dépassement de 40 px par le
 * bas se corrige donc par `dy = +40`, qui fait remonter la bulle d'autant.
 *
 * @param {{top:number,bottom:number,left:number,right:number}} bulle
 * @param {{top:number,bottom:number,left:number,right:number}} cadre
 * @param {number} marge — air à conserver entre la bulle et le bord.
 * @returns {[number, number]} décalage à passer à panBy ; [0, 0] si ça tient.
 */
export function decalagePourCadrer(bulle, cadre, marge = 12) {
  let dx = 0;
  let dy = 0;

  // Un seul axe corrigé par côté : si la bulle est plus grande que le cadre,
  // mieux vaut coller au bord haut/gauche (le début du contenu) que ballotter
  // entre deux dépassements inconciliables.
  if (bulle.bottom > cadre.bottom - marge) dy = bulle.bottom - (cadre.bottom - marge);
  if (bulle.top - dy < cadre.top + marge) dy = bulle.top - (cadre.top + marge);

  if (bulle.right > cadre.right - marge) dx = bulle.right - (cadre.right - marge);
  if (bulle.left - dx < cadre.left + marge) dx = bulle.left - (cadre.left + marge);

  return [dx, dy];
}
