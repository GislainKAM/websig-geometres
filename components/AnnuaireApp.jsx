'use client';
import React from 'react';
import { Logo, Badge, Input, Tag, Card } from '@websig/design/react';
import { normalizeKey } from '../lib/villes.js';
import { VilleMap } from './VilleMap.jsx';

// Tone pour <Badge> (nom de token consommé en interne par le composant).
const PROFIL_TONES = {
  'clientele-privee': 'brand',
  'experts-assermentes': 'terrain',
  topographes: 'hydro',
  honoraires: 'relief'
};

// <Card accent> attend une couleur littérale (il l'assigne direct en
// `background`), pas un nom de tone — même palette, forme différente.
const PROFIL_ACCENTS = {
  'clientele-privee': 'var(--brand-indigo-600)',
  'experts-assermentes': 'var(--terrain-600)',
  topographes: 'var(--hydro-600)',
  honoraires: 'var(--relief-600)'
};

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function AnnuaireApp({ geometres, villes, profils, source, nonLocalises }) {
  const [query, setQuery] = React.useState('');
  const [activeProfils, setActiveProfils] = React.useState(() => new Set());
  const [selectedVille, setSelectedVille] = React.useState(null);

  const toggleProfil = slug => {
    setActiveProfils(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  };

  const queryKey = query.trim() ? normalizeKey(query.trim()) : '';

  const resultats = React.useMemo(() => {
    return geometres.filter(g => {
      if (activeProfils.size && !activeProfils.has(g.profil)) return false;
      if (selectedVille && g.ville !== selectedVille) return false;
      if (queryKey) {
        const haystack = normalizeKey(`${g.nom} ${g.cabinet} ${g.ville} ${g.identifiant}`);
        if (!haystack.includes(queryKey)) return false;
      }
      return true;
    });
  }, [geometres, activeProfils, selectedVille, queryKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', fontFamily: 'var(--font-body)' }}>
      <header style={{
        height: 'var(--header-h)', flex: '0 0 auto', display: 'flex', alignItems: 'center',
        gap: 'var(--space-4)', padding: '0 var(--space-5)', borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--surface-card)'
      }}>
        <Logo size={26} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)' }}>
            Annuaire des géomètres
          </span>
          <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-500)' }}>
            Ordre National des Géomètres du Cameroun
          </span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)', fontFamily: 'var(--font-data)' }}>
            {geometres.length} membres · maj {formatDate(source.dateTranscription)}
          </span>
          <Badge tone="alert">Brouillon non vérifié</Badge>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <aside style={{
          width: 380, flex: '0 0 auto', display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--border-subtle)', background: 'var(--surface-card)'
        }}>
          <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
            <Input
              placeholder="Nom, ville ou n° d'agrément"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Rechercher un géomètre"
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {profils.map(p => (
                <Tag key={p.slug} active={activeProfils.has(p.slug)} onClick={() => toggleProfil(p.slug)}>
                  {p.label}
                </Tag>
              ))}
            </div>
            {selectedVille ? (
              <Tag active onRemove={() => setSelectedVille(null)}>
                Ville : {selectedVille}
              </Tag>
            ) : null}
          </div>

          <div style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--ink-500)', fontFamily: 'var(--font-data)' }}>
            {resultats.length} résultat{resultats.length > 1 ? 's' : ''}
            {nonLocalises ? ` · ${nonLocalises} sans ville reconnue (non cartographiés)` : ''}
          </div>

          <ul style={{ flex: 1, overflowY: 'auto', margin: 0, padding: 'var(--space-2) var(--space-4) var(--space-4)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {resultats.length === 0 ? (
              <li style={{ padding: 'var(--space-6) var(--space-2)', textAlign: 'center', color: 'var(--ink-500)', fontSize: 'var(--text-sm)' }}>
                Aucun géomètre ne correspond. Élargis les filtres ou change de terme.
              </li>
            ) : resultats.map(g => (
              <li key={g.id}>
                <Card padding="var(--space-3)" accent={PROFIL_ACCENTS[g.profil]}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}>{g.nom}</span>
                    <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-2xs)', color: 'var(--ink-500)' }}>{g.identifiant}</span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-700)', marginTop: 2 }}>
                    {g.cabinet ? `${g.cabinet} · ` : ''}{g.ville || 'Ville non précisée'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
                    <Badge tone={PROFIL_TONES[g.profil]}>{g.profilLabel}</Badge>
                    <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-2xs)', color: 'var(--ink-500)' }}>{g.contact}</span>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </aside>

        <div style={{ flex: 1, position: 'relative' }}>
          <VilleMap villes={villes} selectedVille={selectedVille} onSelectVille={v => setSelectedVille(v === selectedVille ? null : v)} />
        </div>
      </div>
    </div>
  );
}
