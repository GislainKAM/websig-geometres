import React from 'react';
import { PROFILS } from '../lib/geometres.js';
import { lonToPx, latToPx } from '../lib/geo.js';
import { symboleURI, BUSTE } from '../lib/markers.js';

const SYMBOLE = Object.fromEntries(PROFILS.map(p => [p.slug, p.symbole]));

/**
 * Symbole de catégorie : le même buste dans son contenant que sur la carte.
 * `size` est la taille du contenant ; l'image est plus grande (liseré blanc compris).
 */
export function Sym({ profil, size = 14 }) {
  const t = Math.round(size * 1.58);
  return (
    <span className="sym" style={{ '--s': size + 'px' }} aria-hidden="true">
      <img src={symboleURI(SYMBOLE[profil])} alt="" width={t} height={t} style={{ margin: -(t - size) / 2, maxWidth: 'none' }} />
    </span>
  );
}

/** Personne : silhouette de buste sur disque, teinte selon la catégorie. */
export function Avatar({ profil, size = 44, bordure = false }) {
  return (
    <span className={`av av--${profil}${bordure ? ' av--bord' : ''}`} style={{ '--s': size + 'px' }} aria-hidden="true">
      <svg viewBox="-12 -12 24 24" width={size * 0.64} height={size * 0.64} dangerouslySetInnerHTML={{ __html: BUSTE('currentColor', 1.5) }} />
    </span>
  );
}

/**
 * Vignette aérienne : tuiles d'imagerie Esri posées autour d'un point, dans un
 * conteneur à débordement masqué. Décorative (alt vide) ; le crédit est dans
 * « À propos ». Le fond d'encre du parent reste visible tant que les tuiles
 * chargent ou hors connexion.
 */
export function Aerial({ lat, lon, z, demiLargeur, demiHauteur }) {
  const cx = lonToPx(lon, z);
  const cy = latToPx(lat, z);
  const tuiles = [];
  for (let x = Math.floor((cx - demiLargeur) / 256); x <= Math.floor((cx + demiLargeur) / 256); x++) {
    for (let y = Math.floor((cy - demiHauteur) / 256); y <= Math.floor((cy + demiHauteur) / 256); y++) {
      tuiles.push(
        <img
          key={x + '/' + y}
          alt="" draggable="false" loading="lazy"
          src={`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`}
          style={{ position: 'absolute', left: `calc(50% + ${Math.round(x * 256 - cx)}px)`, top: `calc(50% + ${Math.round(y * 256 - cy)}px)`, width: 256, height: 256, display: 'block' }}
        />
      );
    }
  }
  return <span className="aerial" aria-hidden="true">{tuiles}</span>;
}
