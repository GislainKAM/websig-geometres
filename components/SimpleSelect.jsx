'use client';
import React from 'react';

// @websig/design n'exporte pas de <Select> malgré le readme du kit (voir
// design/README.md, écart connu) — variante minimale au même langage
// visuel que <Input> (packages/design/react/Input.jsx).
export function SimpleSelect({ label, options, value, onChange, id, ...rest }) {
  const uid = id || React.useId();
  return (
    <label htmlFor={uid} style={{ display: 'block' }}>
      {label ? <span style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', marginBottom: 6 }}>{label}</span> : null}
      <span style={{
        display: 'flex', alignItems: 'center', background: 'var(--surface-card)', height: 38,
        padding: '0 var(--space-3)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)'
      }}>
        <select id={uid} value={value} onChange={onChange} {...rest}
          style={{ border: 0, outline: 0, background: 'none', flex: 1, minWidth: 0, font: 'inherit', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </span>
    </label>
  );
}
