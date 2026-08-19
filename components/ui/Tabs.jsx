'use client';
import React from 'react';

export function Tabs({ items = [], value, onChange, ...rest }) {
  return (
    <div {...rest} role="tablist" style={{ display: 'flex', gap: 'var(--space-6)', borderBottom: '1px solid var(--border-subtle)', ...(rest.style || {}) }}>
      {items.map(it => {
        const active = it.value === value;
        return (
          <button key={it.value} role="tab" aria-selected={active} onClick={() => onChange && onChange(it.value)}
            style={{
              border: 0, background: 'none', cursor: 'pointer', font: 'inherit',
              fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)',
              color: active ? 'var(--text-strong)' : 'var(--text-muted)',
              padding: '0 0 var(--space-3)', marginBottom: -1,
              borderBottom: '2px solid ' + (active ? 'var(--brand-indigo-600)' : 'transparent'),
              transition: 'color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)'
            }}>
            {it.label}{it.count != null ? <span style={{ fontFamily: 'var(--font-data)', color: 'var(--text-faint)', marginLeft: 6 }}>{it.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
