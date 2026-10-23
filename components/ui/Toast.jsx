import React from 'react';

/** Message bref flottant. `tone` : `info` (encre), `succes` (bleu), `erreur` (alerte). */
export function Toast({ tone = 'info', children, onClose, closeLabel = 'Fermer' }) {
  return (
    <div role="status" className={`toast toast--${tone}`}>
      <span className="toast__text">{children}</span>
      {onClose ? <button type="button" className="toast__close" aria-label={closeLabel} onClick={onClose}>×</button> : null}
    </div>
  );
}
