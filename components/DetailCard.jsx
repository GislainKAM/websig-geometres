'use client';
import React from 'react';
import { Badge, Button, IconButton, Icon } from '@websig/design/react';
import { profilLabel } from '../lib/i18n.js';
import { getProfil } from '../lib/geometres.js';

function firstPhone(contact) {
  if (!contact) return null;
  const digits = contact.split('/')[0].replace(/[^\d+]/g, '');
  return digits || null;
}

function fieldRows(g, L, lang) {
  const profil = getProfil(g.profil);
  const rows = [
    { label: L.fCat, value: profilLabel(profil, lang) },
    { label: L.fMat, value: g.identifiant, mono: true },
    { label: L.fCabinet, value: g.cabinet || '—' },
    { label: L.fCity, value: g.pays && g.pays !== 'Cameroun' ? `${g.ville} · ${g.pays}` : (g.ville || '—') }
  ];
  if (g.contact) rows.push({ label: L.fContact, value: g.contact, mono: true });
  if (g.email) rows.push({ label: L.fEmail, value: g.email, mono: true });
  return rows;
}

/** Fiche compacte (popup flottant sur la carte) : 4 lignes, pas d'action. */
export function PopupCard({ g, L, lang }) {
  const profil = getProfil(g.profil);
  return (
    <div style={{
      width: 268, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', padding: 'var(--space-4)'
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-strong)', letterSpacing: '-0.015em' }}>{g.nom}</div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 3 }}>{profilLabel(profil, lang)} · {g.ville || '—'}</div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
        {fieldRows(g, L, lang).slice(0, 4).map(f => (
          <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', padding: '6px 0', borderBottom: '1px solid var(--ink-100)' }}>
            <span style={{ fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>{f.label}</span>
            <span style={{ fontFamily: f.mono ? 'var(--font-data)' : 'inherit', fontSize: 'var(--text-xs)', color: 'var(--text-strong)', textAlign: 'right' }}>{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Fiche complète : panneau latéral (aside), carte flottante (tablette) ou
 * section de tiroir (mobile) — même contenu, le conteneur change à
 * l'appel. `dense` resserre le padding pour la carte flottante.
 */
export function DetailCard({ g, L, lang, onClose, dense }) {
  const profil = getProfil(g.profil);
  const tel = firstPhone(g.contact);
  const osmUrl = g.villeResolue ? `https://www.openstreetmap.org/?mlat=${g.lat}&mlon=${g.lon}#map=13/${g.lat}/${g.lon}` : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: dense ? 'var(--text-md)' : 'var(--text-lg)', fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.015em', lineHeight: 1.15 }}>{g.nom}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>{profilLabel(profil, lang)} · {g.ville || '—'}</div>
        </div>
        {onClose ? (
          <IconButton variant="ghost" size="sm" label={L.close} onClick={onClose}><Icon name="x" size={15} /></IconButton>
        ) : null}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Badge mono tone="brand">{g.identifiant}</Badge>
        <Badge tone={profil.tone} dot>{L.inscribed}</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-subtle)' }}>
        {fieldRows(g, L, lang).map(f => (
          <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)', padding: '9px 0', borderBottom: '1px solid var(--ink-100)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', flex: '0 0 auto' }}>{f.label}</span>
            <span style={{ fontFamily: f.mono ? 'var(--font-data)' : 'inherit', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', textAlign: 'right', overflowWrap: 'anywhere' }}>{f.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <Button as="a" href={tel ? `tel:${tel}` : undefined} block disabled={!tel}>{L.call}</Button>
        <Button as="a" href={osmUrl || undefined} target="_blank" rel="noreferrer" variant="secondary" block disabled={!osmUrl}>{L.route}</Button>
      </div>

      <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-faint)', lineHeight: 1.6 }}>{L.disclaimer}</p>
    </div>
  );
}
