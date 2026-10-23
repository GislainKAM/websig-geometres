import React from 'react';

/** Interrupteur : l'état se lit à la position ET à la couleur du curseur. */
export function Switch({ label, checked, onChange, ...rest }) {
  return (
    <label className="choice choice--switch">
      <input type="checkbox" role="switch" className="choice__native" checked={checked} onChange={onChange} {...rest} />
      <span className={`switch${checked ? ' switch--on' : ''}`}><span className="switch__knob" /></span>
      <span>{label}</span>
    </label>
  );
}

export function Radio({ label, checked, onChange, name, ...rest }) {
  return (
    <label className="choice">
      <input type="radio" className="choice__radio" name={name} checked={checked} onChange={onChange} {...rest} />
      <span>{label}</span>
    </label>
  );
}

export function Checkbox({ label, checked, onChange, ...rest }) {
  return (
    <label className="choice choice--top">
      <input type="checkbox" className="choice__check" checked={checked} onChange={onChange} {...rest} />
      <span>{label}</span>
    </label>
  );
}
