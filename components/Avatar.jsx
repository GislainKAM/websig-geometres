'use client';
import React from 'react';
import { getProfil } from '../lib/geometres.js';
import { profilLabel } from '../lib/i18n.js';

/** #rrggbb → rgba(), pour teinter sans dupliquer la palette en variantes. */
function rgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/**
 * Portrait d'un membre.
 *
 * Remplace la pastille de couleur des listes : l'annuaire répertorie des
 * personnes, une puce de 8 px ne dit rien d'une personne. La catégorie reste
 * lisible — teinte du fond, anneau et silhouette reprennent sa couleur — mais
 * elle n'est plus le seul sujet de la vignette, et l'infobulle la nomme pour
 * qui ne distingue pas les teintes.
 *
 * La silhouette est un tracé local : le vocabulaire d'icônes de
 * @websig/design (Icon.jsx) n'a pas de glyphe « personne », et l'ajouter
 * relève du design system, pas de cette application.
 *
 * `photo` (ou `g.photo`) est le point d'extension prévu : le jour où le
 * tableau OGEC portera des portraits, l'image remplace la silhouette sans
 * toucher à la mise en page appelante.
 */
export function Avatar({ g, size = 38, photo, lang = 'FR' }) {
  const profil = getProfil(g.profil);
  const src = photo || g.photo || null;
  const trait = Math.max(1, Math.round(size / 26));

  return (
    <span
      title={profilLabel(profil, lang)}
      style={{
        width: size, height: size, flex: '0 0 auto', display: 'block',
        borderRadius: '50%', overflow: 'hidden', position: 'relative',
        background: rgba(profil.hex, 0.12),
        boxShadow: `inset 0 0 0 ${trait}px ${rgba(profil.hex, 0.42)}`
      }}
    >
      {src ? (
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        // Silhouette pleine plutôt qu'un pictogramme au trait : à 38 px, un
        // tracé fin se lit comme une icône d'interface, une masse pleine se
        // lit comme un portrait manquant — ce qu'elle est.
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
          <circle cx="12" cy="9" r="3.75" fill={rgba(profil.hex, 0.62)} />
          <path
            d="M12 14.4c-4.15 0-7.5 2.95-7.5 6.6V24h15v-3c0-3.65-3.35-6.6-7.5-6.6z"
            fill={rgba(profil.hex, 0.62)}
          />
        </svg>
      )}
    </span>
  );
}
