import React from 'react';

export function DataTable({ columns = [], rows = [], onRowClick, selectedIndex, ...rest }) {
  return (
    <div {...rest} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--surface-card)', ...(rest.style || {}) }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c.key} style={{
                textAlign: c.align || 'left', padding: 'var(--space-3) var(--space-4)',
                background: 'var(--ink-50)', borderBottom: '1px solid var(--border-subtle)',
                fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase',
                color: 'var(--text-muted)', fontWeight: 'var(--weight-semibold)', whiteSpace: 'nowrap'
              }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} onClick={() => onRowClick && onRowClick(r, i)}
              style={{ cursor: onRowClick ? 'pointer' : 'default', background: selectedIndex === i ? 'var(--surface-brand-soft)' : 'transparent' }}>
              {columns.map(c => (
                <td key={c.key} style={{
                  textAlign: c.align || 'left', padding: 'var(--space-3) var(--space-4)',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--ink-100)' : 0,
                  fontFamily: c.mono ? 'var(--font-data)' : 'inherit',
                  fontVariantNumeric: 'tabular-nums',
                  color: c.strong ? 'var(--text-strong)' : 'var(--text-body)',
                  fontWeight: c.strong ? 'var(--weight-medium)' : 'var(--weight-regular)'
                }}>{typeof c.render === 'function' ? c.render(r) : r[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
