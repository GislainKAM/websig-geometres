'use client';
import React from 'react';

export function Input({ label, hint, error, icon, id, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || React.useId();
  return (
    <label htmlFor={uid} style={{ display: 'block' }}>
      {label ? <span style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', marginBottom: 6 }}>{label}</span> : null}
      <span style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        background: 'var(--surface-card)', height: 38, padding: '0 var(--space-3)',
        border: '1px solid ' + (error ? 'var(--alert-600)' : focus ? 'var(--border-focus)' : 'var(--border-default)'),
        borderRadius: 'var(--radius-md)',
        boxShadow: focus ? 'var(--focus-ring)' : 'none',
        transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)'
      }}>
        {icon}
        <input id={uid} {...rest} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ border: 0, outline: 0, background: 'none', flex: 1, minWidth: 0, font: 'inherit', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }} />
      </span>
      {hint || error ? <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: error ? 'var(--alert-600)' : 'var(--text-muted)', marginTop: 5 }}>{error || hint}</span> : null}
    </label>
  );
}
