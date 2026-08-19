import React from 'react';

const tones = {
  neutral: ['var(--ink-100)', 'var(--ink-700)'],
  brand: ['var(--brand-indigo-100)', 'var(--brand-indigo-700)'],
  hydro: ['var(--hydro-100)', 'var(--hydro-700)'],
  terrain: ['var(--terrain-100)', 'var(--terrain-700)'],
  relief: ['var(--relief-100)', 'var(--relief-700)'],
  alert: ['var(--alert-100)', 'var(--alert-700)']
};

export function Badge({ tone = 'neutral', dot, mono, children, ...rest }) {
  const [bg, fg] = tones[tone] || tones.neutral;
  return (
    <span {...rest} style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
      background: bg, color: fg, borderRadius: 'var(--radius-pill)',
      padding: '3px 10px', fontSize: 'var(--text-2xs)',
      fontFamily: mono ? 'var(--font-data)' : 'var(--font-body)',
      fontWeight: 'var(--weight-semibold)', letterSpacing: mono ? 0 : 'var(--tracking-wide)',
      textTransform: mono ? 'none' : 'uppercase', lineHeight: 1.5, whiteSpace: 'nowrap', ...(rest.style || {})
    }}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: 999, background: fg }} /> : null}
      {children}
    </span>
  );
}
