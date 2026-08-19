'use client';
import React from 'react';

const sizes = { sm: 28, md: 34, lg: 42 };

export function IconButton({ size = 'md', variant = 'secondary', label, active, children, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const d = sizes[size];
  const bg = variant === 'chrome' ? 'var(--surface-map-chrome)' : variant === 'ghost' ? 'transparent' : 'var(--surface-card)';
  return (
    <button {...rest} aria-label={label} title={label}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: d, height: d, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-md)', cursor: 'pointer',
        background: active ? 'var(--surface-brand-soft)' : hover ? 'var(--ink-100)' : bg,
        color: active ? 'var(--text-brand)' : 'var(--text-body)',
        border: variant === 'ghost' ? '1px solid transparent' : '1px solid var(--border-subtle)',
        boxShadow: variant === 'chrome' ? 'var(--shadow-chrome)' : 'none',
        backdropFilter: variant === 'chrome' ? 'var(--blur-chrome)' : undefined,
        transition: 'background-color var(--dur-fast) var(--ease-out)',
        ...(rest.style || {})
      }}>{children}</button>
  );
}
