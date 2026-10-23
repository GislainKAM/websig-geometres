import React from 'react';

const cx = (...c) => c.filter(Boolean).join(' ');

/**
 * Bouton OGEC. `primary` : une seule action bleue par écran. `secondary` :
 * contour d'encre. `ghost` : sans cadre. Cible tactile 44 px (52 px en `lg`).
 * Le bleu de remplissage est `--bleu-fonce` (4,7:1 sous du texte blanc) ;
 * `--bleu` n'atteint que 3:1 et reste réservé aux symboles.
 */
export function Button({ variant = 'primary', size = 'md', full = false, className, children, type = 'button', ...rest }) {
  return (
    <button type={type} className={cx('btn', `btn--${variant}`, `btn--${size}`, full && 'btn--full', className)} {...rest}>
      {children}
    </button>
  );
}
