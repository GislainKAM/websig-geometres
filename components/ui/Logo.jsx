import React from 'react';

export function Logo({ variant = 'lockup', size = 32, color = 'var(--brand-indigo-600)', wordColor = 'var(--text-strong)', ...rest }) {
  const s = size;
  return (
    <span {...rest} style={{ display: 'inline-flex', alignItems: 'center', gap: s * 0.34, ...(rest.style || {}) }}>
      <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true" style={{ flex: '0 0 auto' }}>
        <rect x="6" y="6" width="88" height="88" rx="14" fill="none" stroke={color} strokeWidth="6" />
        <line x1="50" y1="6" x2="50" y2="24" stroke={color} strokeWidth="6" />
        <line x1="50" y1="76" x2="50" y2="94" stroke={color} strokeWidth="6" />
        <line x1="6" y1="50" x2="24" y2="50" stroke={color} strokeWidth="6" />
        <line x1="76" y1="50" x2="94" y2="50" stroke={color} strokeWidth="6" />
        <circle cx="62" cy="38" r="9" fill={color} />
      </svg>
      {variant === 'lockup' ? (
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-bold)', fontSize: s * 0.64, letterSpacing: 'var(--tracking-tight)', color: wordColor, lineHeight: 1 }}>websig</span>
      ) : null}
    </span>
  );
}
