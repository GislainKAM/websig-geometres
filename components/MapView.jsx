'use client';
import React from 'react';
import { MapFrame, IconButton, Icon, Legend, ScaleBar } from '@websig/design/react';
import { pxOffset, SCALE_LABELS } from '../lib/tiles.js';

const OFFSCREEN_X = 1400;
const OFFSCREEN_Y = 1100;

// Carte décorative (@websig/design/MapFrame — tuiles raster CARTO), pas une
// carte vectorielle interactive : c'est le traitement du prototype validé
// (design/README.md). BRIEF.md prévoit MapLibre GL pour la version de
// production ; ce composant reste la référence à remplacer à ce moment-là,
// pas avant — voir le commentaire dans MapFrame.jsx (@websig/design).
export function MapView({
  center, zoom, basemap = 'light',
  markers = [], bubbles = [], popup, legend, layerPanel,
  onZoomIn, onZoomOut, onFitAll, fitAllLabel, L
}) {
  const markerNodes = markers.map(m => {
    const [dx, dy] = pxOffset(center, zoom, m.lat, m.lon);
    if (Math.abs(dx) > OFFSCREEN_X || Math.abs(dy) > OFFSCREEN_Y) return null;
    const s = m.selected ? 20 : 13;
    return (
      <div
        key={m.id}
        onClick={m.onClick}
        title={m.title}
        style={{
          position: 'absolute', left: '50%', top: '50%', width: s, height: s,
          margin: `${-s / 2}px 0 0 ${-s / 2}px`,
          transform: `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px)`,
          borderRadius: '50%', background: m.selected ? 'var(--alert-600)' : m.color,
          border: '2px solid #fff', boxShadow: '0 1px 4px rgba(20,18,31,.4)', cursor: 'pointer',
          zIndex: m.selected ? 7 : 3, transition: 'width var(--dur-fast) var(--ease-out), height var(--dur-fast) var(--ease-out)'
        }}
      />
    );
  });

  const bubbleNodes = bubbles.map(b => {
    const [dx, dy] = pxOffset(center, zoom, b.lat, b.lon);
    if (Math.abs(dx) > OFFSCREEN_X || Math.abs(dy) > OFFSCREEN_Y) return null;
    const d = Math.round(24 + Math.sqrt(b.count) * 5.2);
    return (
      <div
        key={b.ville}
        onClick={b.onClick}
        title={`${b.ville} · ${b.count}`}
        style={{
          position: 'absolute', left: '50%', top: '50%', width: d, height: d,
          margin: `${-d / 2}px 0 0 ${-d / 2}px`,
          transform: `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px)`,
          borderRadius: '50%', display: 'grid', placeItems: 'center',
          background: b.active ? 'rgba(179,38,30,.24)' : 'rgba(70,52,158,.22)',
          border: '2px solid ' + (b.active ? 'var(--alert-600)' : 'var(--brand-indigo-600)'),
          color: b.active ? 'var(--alert-700)' : 'var(--brand-indigo-700)',
          fontFamily: 'var(--font-data)', fontSize: 11, fontWeight: 600, cursor: 'pointer',
          zIndex: b.active ? 6 : 3
        }}
      >{b.count}</div>
    );
  });

  const scaleLabel = SCALE_LABELS[Math.round(zoom)] || '10 km';
  const coordLabel = `${center[0].toFixed(3)}° N · ${center[1].toFixed(3)}° E · z${Math.round(zoom)}`;

  return (
    <MapFrame center={center} zoom={zoom} basemap={basemap} height="100%" radius="0" style={{ border: 0 }}>
      {markerNodes}
      {bubbleNodes}

      {popup ? (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, calc(-100% - 18px))', zIndex: 8 }}>
          {popup}
        </div>
      ) : null}

      <div style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'flex-end', zIndex: 6 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <IconButton variant="chrome" label="Zoom +" onClick={onZoomIn}><Icon name="plus" size={16} /></IconButton>
          <IconButton variant="chrome" label="Zoom −" onClick={onZoomOut}><Icon name="minus" size={16} /></IconButton>
          <IconButton variant="chrome" label={fitAllLabel} onClick={onFitAll}><Icon name="maximize-2" size={16} /></IconButton>
        </div>
        {layerPanel}
        {legend ? <Legend title={L.legendT} items={legend} /> : null}
      </div>

      <div style={{ position: 'absolute', left: 'var(--space-4)', bottom: 'var(--space-5)', display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)', zIndex: 6 }}>
        <ScaleBar label={scaleLabel} />
        <span style={{
          fontFamily: 'var(--font-data)', fontSize: 'var(--text-2xs)', color: 'var(--ink-700)',
          background: 'var(--surface-map-chrome)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-chrome)'
        }}>{coordLabel}</span>
      </div>
    </MapFrame>
  );
}
