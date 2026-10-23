import React from 'react';

/**
 * Champ de saisie OGEC : étiquette en capitales espacées au-dessus, cadre
 * d'encre, erreur sous le champ en `--alerte`. `prefix` accueille une icône.
 */
export function Input({ label, hint, error, prefix, id, className, ...rest }) {
  const auto = React.useId();
  const inputId = id || auto;
  return (
    <div className={`field${className ? ' ' + className : ''}`}>
      {label ? <label htmlFor={inputId} className="field__label">{label}</label> : null}
      <div className={`field__box${error ? ' field__box--err' : ''}`}>
        {prefix ? <span className="field__prefix">{prefix}</span> : null}
        <input id={inputId} className="field__input" aria-invalid={error ? true : undefined} {...rest} />
      </div>
      {error || hint ? <div className={`field__msg${error ? ' field__msg--err' : ''}`} role={error ? 'alert' : undefined}>{error || hint}</div> : null}
    </div>
  );
}

export function Select({ label, hint, options = [], id, className, ...rest }) {
  const auto = React.useId();
  const selectId = id || auto;
  return (
    <div className={`field${className ? ' ' + className : ''}`}>
      {label ? <label htmlFor={selectId} className="field__label">{label}</label> : null}
      <select id={selectId} className="field__select" {...rest}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint ? <div className="field__msg">{hint}</div> : null}
    </div>
  );
}

export function Textarea({ label, hint, error, id, className, ...rest }) {
  const auto = React.useId();
  const areaId = id || auto;
  return (
    <div className={`field${className ? ' ' + className : ''}`}>
      {label ? <label htmlFor={areaId} className="field__label">{label}</label> : null}
      <textarea id={areaId} className={`field__area${error ? ' field__area--err' : ''}`} aria-invalid={error ? true : undefined} {...rest} />
      {error || hint ? <div className={`field__msg${error ? ' field__msg--err' : ''}`} role={error ? 'alert' : undefined}>{error || hint}</div> : null}
    </div>
  );
}
