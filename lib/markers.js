// Symboles de carte, rendus en <img> pour MapLibre qui ne sait pas afficher du
// React. La FORME du contenant porte la catégorie (carré plein, carré vide, losange, rond) ;
// la teinte seule ne suffit pas à un daltonien ni sur un fond clair imprimé.
// Chaque symbole a un liseré blanc pour tenir sur n'importe quel fond.

const BLEU = '#0099FE';
const BLEU_FONCE = '#0077CC';
const ENCRE = '#14181A';
const ENCRE_2 = '#6E6A62';

// Chaque membre est un BUSTE (tête + épaules) dans un contenant dont la FORME porte
// la catégorie : carré plein, carré vide, losange, rond. Le buste dit « une
// personne », la forme et la teinte disent laquelle. Géométrie en unités centrées
// sur (0,0), demi-côté 9,5. `halo` épaissit la même forme (liseré blanc, anneau
// d'état actif) ; `corps` la dessine avec son buste.
export const BUSTE = (c, k = 1) => `<g fill="${c}" transform="scale(${k})"><circle cx="0" cy="-2.7" r="2.8"/><path d="M-5.4 6.4C-5.4 2.7-2.9 1.2 0 1.2S5.4 2.7 5.4 6.4Z"/></g>`;

const FORMES = {
  'carre-plein': {
    halo: w => `<rect x="-9.5" y="-9.5" width="19" height="19" fill="#fff" stroke="#fff" stroke-width="${w}"/>`,
    corps: () => `<rect x="-9.5" y="-9.5" width="19" height="19" fill="${BLEU}"/>${BUSTE('#fff')}`
  },
  'rond-plein': {
    halo: w => `<circle r="9.5" fill="#fff" stroke="#fff" stroke-width="${w}"/>`,
    corps: () => `<circle r="9.5" fill="${BLEU_FONCE}"/>${BUSTE('#fff')}`
  },
  'carre-vide': {
    halo: w => `<rect x="-9.5" y="-9.5" width="19" height="19" fill="#fff" stroke="#fff" stroke-width="${w}"/>`,
    corps: () => `<rect x="-8" y="-8" width="16" height="16" fill="#fff" stroke="${BLEU_FONCE}" stroke-width="3"/>${BUSTE(BLEU_FONCE, 0.9)}`
  },
  'losange': {
    halo: w => `<polygon points="0,-12 12,0 0,12 -12,0" fill="#fff" stroke="#fff" stroke-width="${w}" stroke-linejoin="miter"/>`,
    corps: () => `<polygon points="0,-12 12,0 0,12 -12,0" fill="${ENCRE}"/>${BUSTE('#fff', 0.8)}`
  },
  'rond': {
    halo: w => `<circle r="9.5" fill="#fff" stroke="#fff" stroke-width="${w}"/>`,
    corps: () => `<circle r="8.5" fill="#fff" stroke="${ENCRE_2}" stroke-width="2"/>${BUSTE(ENCRE_2, 0.9)}`
  }
};

/**
 * Symbole de membre. Normal : 30 px, contenant de 19 px. Actif : 1,5× avec un
 * anneau d'encre — il doit se lire d'un coup d'œil parmi des dizaines.
 */
export function symboleSVG(symbole, actif = false, pixelRatio = 1) {
  const f = FORMES[symbole] || FORMES['carre-plein'];
  const t = actif ? 48 : 30;
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
