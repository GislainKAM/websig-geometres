import React from 'react';
import { Icon } from './Icon.jsx';

export function EmptyState({ icon = 'map-pin-off', title, description, action, ...rest }) {
  return (
    <div {...rest} style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-6)', ...(rest.style || {}) }}>
      <span style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--surface-brand-soft)', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
        <Icon name={icon} size={21} color="var(--brand-indigo-600)" />
      </span>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{title}</div>
      {description ? <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: '6px auto 0', maxWidth: 380 }}>{description}</p> : null}
      {action ? <div style={{ marginTop: 'var(--space-5)' }}>{action}</div> : null}
    </div>
  );
}
