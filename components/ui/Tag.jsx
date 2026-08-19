'use client';
import React from 'react';

export function Tag({ active, onRemove, children, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <span {...rest}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        border: '1px solid ' + (active ? 'var(--border-brand)' : 'var(--border-subtle)'),
        background: active ? 'var(--surface-brand-soft)' : hover ? 'var(--ink-50)' : 'var(--surface-card)',
        color: active ? 'var(--text-brand)' : 'var(--text-body)',
        borderRadius: 'var(--radius-pill)', padding: '4px 12px',
        fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)',
        cursor: rest.onClick ? 'pointer' : 'default',
        transition: 'all var(--dur-fast) var(--ease-out)', ...(rest.style || {})
      }}>
      {children}
      {onRemove ? <button onClick={onRemove} aria-label="Retirer" style={{ border: 0, background: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: 14, lineHeight: 1 }}>×</button> : null}
    </span>
  );
}
