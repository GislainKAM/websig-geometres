'use client';
import React from 'react';
import { Button, IconButton, Icon } from './ui/index.js';
import { profilLabel } from '../lib/i18n.js';
import { getProfil } from '../lib/geometres.js';
import { Avatar } from './Avatar.jsx';

function firstPhone(contact) {
  if (!contact) return null;
  const digits = contact.split('/')[0].replace(/[^\d+]/g, '');
  return digits || null;
}

/** Ville, complétée du pays quand le membre n'exerce pas au Cameroun. */
export function lieu(g) {
  if (!g.ville) return '-';
  return g.pays && g.pays !== 'Cameroun' ? `${g.ville} · ${g.pays}` : g.ville;
}

/** Catégorie et lieu, la ligne d'identité sous le nom. */
export function sousTitre(g, lang) {
  return `${profilLabel(getProfil(g.profil), lang)} · ${lieu(g)}`;
}

/**
 * Champs de la fiche. Catégorie et ville n'y figurent pas : elles sont déjà
 * sous le nom, et les répéter deux lignes plus bas était le principal défaut
 * de la fiche précédente. Le statut ouvre la liste — c'est ce que la fiche
 * atteste — en texte ordinaire plutôt qu'en pastille colorée.
 */
function fieldRows(g, L) {
  const rows = [
    { label: L.fStatus, value: L.inscribed },
    { label: L.fMat, value: g.identifiant, mono: true },
    { label: L.fCabinet, value: g.cabinet || '-' }
  ];
  if (g.contact) rows.push({ label: L.fContact, value: g.contact, mono: true });
  if (g.email) rows.push({ label: L.fEmail, value: g.email, mono: true });
  return rows;
}

/** Fiche compacte (popup flottant sur la carte). */
export function PopupCard({ g, L, lang, onClose }) {
  return (
    <div style={{
      width: 268, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', padding: 'var(--space-4)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <Avatar g={g} size={40} lang={lang} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-strong)', letterSpacing: '-0.01em', lineHeight: 1.25 }}>{g.nom}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 3 }}>{sousTitre(g, lang)}</div>
        </div>
        {onClose ? (
          <IconButton variant="ghost" size="sm" label={L.close} onClick={onClose}><Icon name="x" size={14} /></IconButton>
        ) : null}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
        {fieldRows(g, L).slice(0, 4).map(f => (
          <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', padding: '6px 0', borderBottom: '1px solid var(--ink-100)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{f.label}</span>
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
  const tel = firstPhone(g.contact);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <Avatar g={g} size={dense ? 44 : 52} lang={lang} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: dense ? 'var(--text-base)' : 'var(--text-md)', fontWeight: 600, color: 'var(--text-strong)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{g.nom}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 3 }}>{sousTitre(g, lang)}</div>
        </div>
        {onClose ? (
          <IconButton variant="ghost" size="sm" label={L.close} onClick={onClose}><Icon name="x" size={15} /></IconButton>
        ) : null}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-subtle)' }}>
        {fieldRows(g, L).map(f => (
          <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)', padding: '9px 0', borderBottom: '1px solid var(--ink-100)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', flex: '0 0 auto' }}>{f.label}</span>
            <span style={{ fontFamily: f.mono ? 'var(--font-data)' : 'inherit', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', textAlign: 'right', overflowWrap: 'anywhere' }}>{f.value}</span>
          </div>
        ))}
      </div>

      {/* Pas de bouton « Itinéraire » : le point est le chef-lieu déclaré au
          tableau, pas l'adresse du membre (le tableau n'en donne aucune).
          Router quelqu'un vers un centre-ville en lui laissant croire qu'il
          arrive chez le géomètre, c'est promettre une précision qu'on n'a
          pas. Restent les deux contacts que la source fournit vraiment. */}
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <Button as="a" href={tel ? `tel:${tel}` : undefined} block disabled={!tel}>{L.call}</Button>
        <Button as="a" href={g.email ? `mailto:${g.email}` : undefined} variant="secondary" block disabled={!g.email}>{L.write}</Button>
      </div>

      <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-faint)', lineHeight: 1.6 }}>{L.disclaimer}</p>
    </div>
  );
}
