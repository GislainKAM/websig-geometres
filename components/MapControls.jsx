'use client';
import React from 'react';
import { IconButton, Icon, Checkbox } from '@websig/design/react';
import { FONDS } from './MapView.jsx';

// Chrome flottant sur la carte. Tous les boutons sont des <IconButton
// variant="chrome"> de taille md (34px) : zoom, vue nationale, couches et
// fond de carte ont donc rigoureusement le même gabarit, empilés dans la
// même colonne.

function Popover({ titre, children, onClose }) {
  return (
    <div
      role="dialog"
      aria-label={titre}
      style={{
        width: 230, background: 'var(--surface-map-chrome)', backdropFilter: 'var(--blur-chrome)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-chrome)', overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-3) var(--space-3) var(--space-4)' }}>
        <span style={{ flex: 1, fontSize: 'var(--text-2xs)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{titre}</span>
        <IconButton variant="ghost" size="sm" label="Fermer" onClick={onClose}><Icon name="x" size={14} /></IconButton>
      </div>
      <div style={{ padding: '0 var(--space-4) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {children}
      </div>
    </div>
  );
}

export function MapControls({ L, lang, couches, onToggleCouche, fond, onFond, onZoomIn, onZoomOut, onFitAll }) {
  const [ouvert, setOuvert] = React.useState(null); // null | 'couches' | 'fond'
  const basculer = quoi => setOuvert(o => (o === quoi ? null : quoi));

  return (
    <div style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', zIndex: 6, display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
      {ouvert === 'couches' ? (
        <Popover titre={L.layersT} onClose={() => setOuvert(null)}>
          <Checkbox label={L.membresLayer} swatch="var(--layer-point)" checked={couches.membres} onChange={() => onToggleCouche('membres')} />
          <Checkbox label={L.frontiereLayer} swatch="var(--brand-indigo-600)" checked={couches.frontiere} onChange={() => onToggleCouche('frontiere')} />
          <Checkbox label={L.masqueLayer} swatch="var(--ink-700)" checked={couches.masque} onChange={() => onToggleCouche('masque')} />
        </Popover>
      ) : null}

      {ouvert === 'fond' ? (
        <Popover titre={L.basemapT} onClose={() => setOuvert(null)}>
          {FONDS.map(f => {
            const actif = f.id === fond;
            return (
              <button
                key={f.id}
                onClick={() => onFond(f.id)}
                aria-pressed={actif}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%',
                  padding: '7px var(--space-3)', cursor: 'pointer', font: 'inherit', textAlign: 'left',
                  fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-md)',
                  border: '1px solid ' + (actif ? 'var(--border-brand)' : 'transparent'),
                  background: actif ? 'var(--surface-brand-soft)' : 'transparent',
                  color: actif ? 'var(--text-brand)' : 'var(--text-body)'
                }}
              >
                <span style={{
                  width: 22, height: 16, borderRadius: 3, flex: '0 0 auto',
                  border: '1px solid var(--border-default)', background: f.apercu
                }} />
                <span style={{ flex: 1 }}>{lang === 'EN' ? f.labelEn : f.labelFr}</span>
              </button>
            );
          })}
        </Popover>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <IconButton variant="chrome" label="Zoom +" onClick={onZoomIn}><Icon name="plus" size={16} /></IconButton>
        <IconButton variant="chrome" label="Zoom −" onClick={onZoomOut}><Icon name="minus" size={16} /></IconButton>
        <IconButton variant="chrome" label={L.fitAll} onClick={onFitAll}><Icon name="maximize-2" size={16} /></IconButton>
        <IconButton variant="chrome" label={L.layersT} active={ouvert === 'couches'} onClick={() => basculer('couches')}><Icon name="layers" size={16} /></IconButton>
        <IconButton variant="chrome" label={L.basemapT} active={ouvert === 'fond'} onClick={() => basculer('fond')}><Icon name="map" size={16} /></IconButton>
      </div>
    </div>
  );
}
