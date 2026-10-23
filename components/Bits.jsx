import React from 'react';
import { PROFILS } from '../lib/geometres.js';
import { initiales, lonToPx, latToPx } from '../lib/geo.js';

const SYMBOLE = Object.fromEntries(PROFILS.map(p => [p.slug, p.symbole]));

/** Symbole de catégorie en CSS : même forme que sur la carte, à la taille voulue. */
export function Sym({ profil, size = 14 }) {
  return <span className={`sym sym--${SYMBOLE[profil]}`} style={{ '--s': size + 'px' }} aria-hidden="true" />;
}

/** Initiales sur disque. Le disque est un avatar (seul usage du cercle, hors rond honoraire). */
export function Avatar({ nom, profil, size = 44, bordure = false }) {
  return (
    <span
      className={`av av--${profil}${bordure ? ' av--bord' : ''}`}
      style={{ '--s': size + 'px' }}
      aria-hidden="true"
    >{initiales(nom)}</span>
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
