import React from 'react';

/** Pastille d'état : `agree` (inscrit), `neutre`, `alerte`, `actif`. */
export function Badge({ tone = 'neutre', onDark = false, children, ...rest }) {
  return (
    <span className={`badge badge--${tone}${onDark ? ' badge--on-dark' : ''}`} {...rest}>{children}</span>
  );
}
