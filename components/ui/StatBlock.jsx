import React from 'react';

export function StatBlock({ value, label, unit, tone = 'var(--text-strong)', ...rest }) {
  return (
    <div {...rest} style={{ ...(rest.style || {}) }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)', color: tone, lineHeight: 1.05, letterSpacing: 'var(--tracking-tight)' }}>
        {value}{unit ? <span style={{ fontSize: '0.5em', fontFamily: 'var(--font-data)', color: 'var(--text-muted)', marginLeft: 4 }}>{unit}</span> : null}
      </div>
      <div style={{ fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 6, fontWeight: 'var(--weight-semibold)' }}>{label}</div>
    </div>
  );
}
