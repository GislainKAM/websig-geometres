// Icônes de marqueur : une épingle par catégorie, avec un glyphe blanc qui
// dit le métier plutôt qu'une pastille de couleur (illisible dès qu'il y a
// plusieurs catégories côte à côte). Tracés à la main dans la grille 24 de
// Lucide, trait 1.75px — cohérent avec le vocabulaire du design system
// (@websig/design readme, ICONOGRAPHY), mais rendus en <img> pour MapLibre
// qui ne sait pas afficher du React.

// Glyphes centrés dans une boîte 24×24, à l'échelle et translatés dans la
// tête de l'épingle par buildPin().
const GLYPHS = {
  // Clientèle privée → immeuble de cabinet
  privee: '<path d="M4 21V6a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v15" /><path d="M15 11h4a1 1 0 0 1 1 1v9" /><path d="M2 21h20" /><path d="M8 9h2M8 13h2M8 17h2" />',
  // Experts assermentés → bouclier (serment)
  experts: '<path d="M12 3l7 3v5c0 4.4-2.9 8.5-7 9.7C7.9 19.5 5 15.4 5 11V6l7-3z" /><path d="M9.5 12l1.8 1.8 3.4-3.6" />',
  // Topographes → trépied de théodolite
  topo: '<circle cx="12" cy="5.5" r="2.2" /><path d="M12 7.7V13" /><path d="M12 13L7 21M12 13l5 8" /><path d="M9 17h6" />',
  // Honoraires → médaille
  honoraires: '<circle cx="12" cy="9" r="5" /><path d="M9 13.6L7.5 21l4.5-2.6L16.5 21 15 13.6" />'
};

/**
 * Épingle SVG : goutte pleine à la couleur de la catégorie, liseré blanc,
 * glyphe blanc dans la tête. `selected` grossit et passe en rouge d'alerte
 * (var(--alert-600)) — même convention que la sélection ailleurs dans l'UI.
 */
export function buildPinSVG(hex, glyphKey, selected = false) {
  const fill = selected ? '#b3261e' : hex;
  const w = selected ? 48 : 42;
  const h = selected ? 56 : 49;
  const glyph = GLYPHS[glyphKey] || GLYPHS.privee;
  // Goutte dans un viewBox 24×28 : tête r=10,4 centrée (12, 11.8), pointe à
  // (12, 27). La version précédente tenait dans un 24×32 avec la même tête —
  // 8 unités de queue sous la tête au lieu de 5 — ce qui étirait la goutte
  // verticalement sans rien ajouter de lisible.
  //
  // Le glyphe occupe 0,58 × 24 = 14 unités dans une tête de 20,8 (67 % du
  // diamètre, contre 55 % avant) et son trait passe de 1,6 à 2,0 unité :
  // c'est ce qui manquait pour le distinguer à la taille d'affichage.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 28">
  <path d="M12 27C12 27 22.4 17.6 22.4 11.8 22.4 6.06 17.74 1.4 12 1.4S1.6 6.06 1.6 11.8C1.6 17.6 12 27 12 27z"
        fill="${fill}" stroke="#ffffff" stroke-width="1.7" stroke-linejoin="round"/>
  <g transform="translate(12 11.8) scale(0.58) translate(-12 -12)"
     fill="none" stroke="#ffffff" stroke-width="3.45" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>
</svg>`;
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

/** Même épingle en data-URI, pour l'afficher en HTML (légende, fiche). */
export function pinDataURI(hex, glyphKey) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(buildPinSVG(hex, glyphKey));
}
