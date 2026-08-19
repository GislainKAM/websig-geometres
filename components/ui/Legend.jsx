import React from 'react';

export function Legend({ title, items = [], ...rest }) {
  return (
    <div {...rest} style={{
      background: 'var(--surface-map-chrome)', backdropFilter: 'var(--blur-chrome)',
      border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-chrome)', padding: 'var(--space-3) var(--space-4)', minWidth: 170, ...(rest.style || {})
    }}>
      {title ? <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>{title}</div> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-body)' }}>
            <span style={{
              width: 16, height: it.shape === 'line' ? 3 : 12, flex: '0 0 auto',
              background: it.color, borderRadius: it.shape === 'point' ? 999 : it.shape === 'line' ? 2 : 3,
              ...(it.shape === 'point' ? { width: 12 } : null)
            }} />
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.value != null ? <span className="ws-data" style={{ fontFamily: 'var(--font-data)', color: 'var(--text-muted)' }}>{it.value}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
