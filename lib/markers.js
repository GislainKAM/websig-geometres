// Symboles de carte, rendus en <img> pour MapLibre qui ne sait pas afficher du
// React. La FORME porte la catégorie (carré plein, carré vide, losange, rond) ;
// la teinte seule ne suffit pas à un daltonien ni sur un fond clair imprimé.
// Chaque symbole a un liseré blanc pour tenir sur n'importe quel fond.

const BLEU = '#0099FE';
const BLEU_FONCE = '#0077CC';
const ENCRE = '#14181A';
const ENCRE_2 = '#6E6A62';

// Géométrie en unités centrées sur (0,0), demi-côté 8. `halo` épaissit la même
// forme (liseré blanc, anneau d'état actif) ; `corps` la dessine.
const FORMES = {
  'carre-plein': {
    halo: w => `<rect x="-8" y="-8" width="16" height="16" fill="#fff" stroke="#fff" stroke-width="${w}"/>`,
    corps: () => `<rect x="-8" y="-8" width="16" height="16" fill="${BLEU}"/>`
  },
  'carre-vide': {
    halo: w => `<rect x="-8" y="-8" width="16" height="16" fill="#fff" stroke="#fff" stroke-width="${w}"/>`,
    corps: () => `<rect x="-6.5" y="-6.5" width="13" height="13" fill="#fff" stroke="${BLEU_FONCE}" stroke-width="3"/>`
  },
  'losange': {
    halo: w => `<polygon points="0,-9.5 9.5,0 0,9.5 -9.5,0" fill="#fff" stroke="#fff" stroke-width="${w}" stroke-linejoin="miter"/>`,
    corps: () => `<polygon points="0,-9.5 9.5,0 0,9.5 -9.5,0" fill="${ENCRE}"/>`
  },
  'rond': {
    halo: w => `<circle r="8" fill="#fff" stroke="#fff" stroke-width="${w}"/>`,
    corps: () => `<circle r="7" fill="#fff" stroke="${ENCRE_2}" stroke-width="2"/>`
  }
};

/**
 * Symbole de membre. Normal : 24 px, forme de 16 px. Actif : 1,5× avec un
 * anneau d'encre — il doit se lire d'un coup d'œil parmi des dizaines.
 */
export function symboleSVG(symbole, actif = false, pixelRatio = 1) {
  const f = FORMES[symbole] || FORMES['carre-plein'];
  const t = actif ? 40 : 24;
  const echelle = actif ? 1.5 : 1;
  const anneau = actif ? f.halo(7).replace(/fill="#fff" stroke="#fff"/, `fill="${ENCRE}" stroke="${ENCRE}"`) : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${t * pixelRatio}" height="${t * pixelRatio}" viewBox="${-t / 2} ${-t / 2} ${t} ${t}">`
    + `<g transform="scale(${echelle})">${anneau}${f.halo(3)}${f.corps()}</g></svg>`;
}

/** Carré d'encre des regroupements (ville, amas) ; le chiffre est posé en HTML par-dessus. */
export function regroupementSVG(pixelRatio = 1) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${44 * pixelRatio}" height="${44 * pixelRatio}" viewBox="0 0 44 44">`
    + `<rect x="0" y="0" width="44" height="44" fill="#fff"/><rect x="2" y="2" width="40" height="40" fill="${ENCRE}"/></svg>`;
}

/** SVG → HTMLImageElement, pour map.addImage(). */
export function svgToImage(svg) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
}

/** Symbole en data-URI, pour les légendes et les fiches (HTML). */
export function symboleURI(symbole) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(symboleSVG(symbole));
}
