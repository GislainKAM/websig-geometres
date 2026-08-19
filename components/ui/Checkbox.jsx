'use client';
import React from 'react';

export function Checkbox({ label, checked, onChange, swatch, disabled, ...rest }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, fontSize: 'var(--text-sm)', color: 'var(--text-body)', ...(rest.style || {}) }}>
      <span style={{
        width: 17, height: 17, flex: '0 0 auto', borderRadius: 'var(--radius-sm)',
        border: '1px solid ' + (checked ? 'var(--brand-indigo-600)' : 'var(--border-strong)'),
        background: checked ? 'var(--brand-indigo-600)' : 'var(--surface-card)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background-color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)'
      }}>
        {checked ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> : null}
      </span>
      <input type="checkbox" checked={!!checked} onChange={onChange} disabled={disabled} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      {swatch ? <span style={{ width: 10, height: 10, borderRadius: 2, background: swatch, flex: '0 0 auto' }} /> : null}
      <span>{label}</span>
    </label>
  );
}
