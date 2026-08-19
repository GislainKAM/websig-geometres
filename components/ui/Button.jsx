'use client';
import React from 'react';

const base = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)',
  fontFamily: 'var(--font-body)', fontWeight: 'var(--weight-semibold)', lineHeight: 1,
  border: 'var(--border-w) solid transparent', borderRadius: 'var(--radius-md)',
  cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap',
  transition: 'background-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), transform var(--dur-instant) var(--ease-out)'
};

const sizes = {
  sm: { fontSize: 'var(--text-xs)', padding: '0 var(--space-3)', height: 30 },
  md: { fontSize: 'var(--text-sm)', padding: '0 var(--space-4)', height: 38 },
  lg: { fontSize: 'var(--text-base)', padding: '0 var(--space-6)', height: 46 }
};

const variants = {
  primary: { background: 'var(--surface-brand)', color: 'var(--text-invert)', borderColor: 'var(--surface-brand)' },
  secondary: { background: 'var(--surface-card)', color: 'var(--text-strong)', borderColor: 'var(--border-default)' },
  ghost: { background: 'transparent', color: 'var(--text-brand)', borderColor: 'transparent' },
  danger: { background: 'var(--alert-600)', color: 'var(--text-invert)', borderColor: 'var(--alert-600)' }
};

const hovers = {
  primary: { background: 'var(--brand-indigo-700)', borderColor: 'var(--brand-indigo-700)' },
  secondary: { background: 'var(--ink-50)', borderColor: 'var(--border-strong)' },
  ghost: { background: 'var(--surface-brand-soft)' },
  danger: { background: 'var(--alert-700)', borderColor: 'var(--alert-700)' }
};

export function Button({ variant = 'primary', size = 'md', block, disabled, icon, iconRight, children, as, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const Tag = as || 'button';
  const style = {
    ...base, ...sizes[size], ...variants[variant],
    ...(hover && !disabled ? hovers[variant] : null),
    width: block ? '100%' : undefined,
    transform: press && !disabled ? 'translateY(1px)' : 'none',
    opacity: disabled ? 0.45 : 1,
    pointerEvents: disabled ? 'none' : undefined,
    ...(rest.style || {})
  };
  return (
    <Tag {...rest} disabled={Tag === 'button' ? disabled : undefined} style={style}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)}>
      {icon}{children}{iconRight}
    </Tag>
  );
}
