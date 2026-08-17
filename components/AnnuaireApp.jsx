'use client';
import React from 'react';
import { Logo, Badge, Button, Input, Tag, Tabs, EmptyState, StatBlock, DataTable, Checkbox, LayerPanel } from '@websig/design/react';
import { MapView } from './MapView.jsx';
import { SimpleSelect } from './SimpleSelect.jsx';
import { DetailCard, PopupCard } from './DetailCard.jsx';
import { getProfil, PROFILS } from '../lib/geometres.js';
import { T, profilLabel } from '../lib/i18n.js';
import { formatNumber } from '../lib/tiles.js';
import { normalizeKey } from '../lib/villes.js';

const MOBILE_BP = 760;
const TABLET_BP = 1140;
const CENTER_DEFAULT = [6.2, 12.4];
const ZOOM_DEFAULT = 6;

function useViewportWidth() {
  const [width, setWidth] = React.useState(null);
  React.useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

function ResultRow({ g, selected, onClick }) {
  const profil = getProfil(g.profil);
  return (
    <div onClick={onClick} style={{
      padding: '14px var(--space-5) 14px calc(var(--space-5) - 3px)',
      borderBottom: '1px solid var(--ink-100)',
      borderLeft: '3px solid ' + (selected ? 'var(--brand-indigo-600)' : 'transparent'),
      background: selected ? 'var(--surface-brand-soft)' : 'transparent',
      cursor: 'pointer'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 8, height: 8, flex: '0 0 auto', borderRadius: '50%', background: profil.color }} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-strong)', letterSpacing: '-0.01em', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.nom}</span>
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 10.5, fontWeight: 500, color: 'var(--text-body)', background: 'var(--ink-100)', borderRadius: 'var(--radius-sm)', padding: '3px 6px' }}>{g.identifiant}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', marginTop: 6, paddingLeft: 18 }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.cabinet || '—'}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>{g.ville || '—'}</span>
      </div>
    </div>
  );
}

export function AnnuaireApp({ geometres, villes, nonLocalises, source }) {
  const width = useViewportWidth();
  const isMobile = width != null && width < MOBILE_BP;
  const isTablet = width != null && width >= MOBILE_BP && width < TABLET_BP;

  const [mode, setMode] = React.useState('chercher');
  const [lang, setLang] = React.useState('FR');
  const [query, setQuery] = React.useState('');
  const [verifyQuery, setVerifyQuery] = React.useState('');
  const [verifyResult, setVerifyResult] = React.useState(null); // null | 'none' | id
  const [selectedId, setSelectedId] = React.useState(null);
  const [selectedVille, setSelectedVille] = React.useState(villes[0]?.ville || '');
  const [cats, setCats] = React.useState(() => Object.fromEntries(PROFILS.map(p => [p.slug, true])));
  const [villeFilter, setVilleFilter] = React.useState('__all');
  const [series, setSeries] = React.useState([]);
  const [center, setCenter] = React.useState(CENTER_DEFAULT);
  const [zoom, setZoom] = React.useState(ZOOM_DEFAULT);
  const [sheet, setSheet] = React.useState('half');
  const [membresVisible, setMembresVisible] = React.useState(true);

  const L = T[lang];
  const isSearch = mode === 'chercher', isCities = mode === 'villes', isVerify = mode === 'verifier', isAnalyse = mode === 'analyser';

  const seriesOptions = React.useMemo(
    () => [...new Set(geometres.map(g => g.identifiant?.[0]).filter(Boolean))].sort(),
    [geometres]
  );

  const queryKey = query.trim() ? normalizeKey(query.trim()) : '';
  const filtered = React.useMemo(() => geometres.filter(g => {
    if (!cats[g.profil]) return false;
    if (villeFilter !== '__all' && g.ville !== villeFilter) return false;
    if (series.length && !series.includes(g.identifiant[0])) return false;
    if (queryKey) {
      const haystack = normalizeKey(`${g.nom} ${g.cabinet} ${g.ville} ${g.identifiant}`);
      if (!haystack.includes(queryKey)) return false;
    }
    return true;
  }), [geometres, cats, villeFilter, series, queryKey]);

  const selected = geometres.find(g => g.id === selectedId) || null;
  const verified = verifyResult && verifyResult !== 'none' ? geometres.find(g => g.id === verifyResult) : null;

  const catCounts = React.useMemo(() => {
    const out = {};
    PROFILS.forEach(p => { out[p.slug] = 0; });
    geometres.forEach(g => { out[g.profil] += 1; });
    return out;
  }, [geometres]);

  const regionGroups = React.useMemo(() => {
    const byPays = new Map();
    villes.forEach(v => {
      if (!byPays.has(v.pays)) byPays.set(v.pays, { pays: v.pays, count: 0, villes: [] });
      const grp = byPays.get(v.pays);
      grp.count += v.count;
      grp.villes.push(v);
    });
    return [...byPays.values()].sort((a, b) => b.count - a.count);
  }, [villes]);

  const toggleCat = slug => setCats(prev => ({ ...prev, [slug]: !prev[slug] }));
  const toggleSeries = s => setSeries(prev => prev.includes(s) ? prev.filter(x => x !== s) : prev.concat(s));
  const resetFilters = () => { setCats(Object.fromEntries(PROFILS.map(p => [p.slug, true]))); setVilleFilter('__all'); setSeries([]); setQuery(''); };
  const toggleLang = () => setLang(l => l === 'FR' ? 'EN' : 'FR');
  const clearSelection = () => setSelectedId(null);

  const select = id => {
    const m = geometres.find(g => g.id === id);
    if (!m) return;
    setSelectedId(id);
    if (m.lat != null) { setCenter([m.lat, m.lon]); setZoom(13); }
    if (isMobile) setSheet(s => (s === 'peek' ? 'half' : s));
  };
  const pickVille = ville => {
    const v = villes.find(x => x.ville === ville);
    setSelectedVille(ville);
    setSelectedId(null);
    if (v) { setCenter([v.lat, v.lon]); setZoom(11); }
  };
  const zoomIn = () => setZoom(z => Math.min(15, z + 1));
  const zoomOut = () => setZoom(z => Math.max(4, z - 1));
  const fitAll = () => { setZoom(ZOOM_DEFAULT); setCenter(CENTER_DEFAULT); setSelectedId(null); };
  const setModeSafe = m => { setMode(m); if (m !== 'verifier') setVerifyResult(null); };

  const runVerify = () => {
    const q = verifyQuery.trim().toLowerCase();
    if (!q) { setVerifyResult(null); return; }
    const hit = geometres.find(g => g.identifiant.toLowerCase() === q)
      || geometres.find(g => g.nom.toLowerCase().includes(q) || g.identifiant.toLowerCase().includes(q));
    if (hit) {
      setVerifyResult(hit.id); setSelectedId(hit.id);
      if (hit.lat != null) { setCenter([hit.lat, hit.lon]); setZoom(12); }
    } else {
      setVerifyResult('none'); setSelectedId(null);
    }
  };

  const toggleLayer = id => { if (id === 'membres') setMembresVisible(v => !v); };

  const downloadGeoJSON = () => {
    const features = filtered.filter(g => g.villeResolue).map(g => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [g.lon, g.lat] },
      properties: {
        nom: g.nom, identifiant: g.identifiant, profil: g.profil, cabinet: g.cabinet,
        ville: g.ville, pays: g.pays, contact: g.contact, email: g.email
      }
    }));
    const geojson = { type: 'FeatureCollection', features };
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'annuaire-geometres-ogec-2026.geojson';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- Carte : marqueurs / bulles ---
  let markerSource = [];
  if (isSearch || isAnalyse) markerSource = (isAnalyse && !membresVisible) ? [] : filtered;
  else if (isVerify) markerSource = selected ? [selected] : [];
  const markers = markerSource.filter(g => g.villeResolue).map(g => ({
    id: g.id, lat: g.lat, lon: g.lon, color: getProfil(g.profil).hex,
    selected: !!(selected && selected.id === g.id),
    title: `${g.nom} · ${g.identifiant}`,
    onClick: () => select(g.id)
  }));
  const bubbles = isCities ? villes.map(v => ({
    ville: v.ville, lat: v.lat, lon: v.lon, count: v.count,
    active: selectedVille === v.ville, onClick: () => pickVille(v.ville)
  })) : [];

  // --- Liste résultats ---
  const listSource = isCities ? geometres.filter(g => g.ville === selectedVille) : filtered;

  // --- Table attributaire (mode Analyser) ---
  const tableCols = [
    { key: 'nom', label: L.fName, strong: true },
    { key: 'identifiant', label: L.fMat, mono: true },
    { key: 'catLabel', label: L.fCat },
    { key: 'cabinet', label: L.fCabinet },
    { key: 'ville', label: L.fCity }
  ];
  const tableRows = filtered.slice(0, 80).map(g => ({ ...g, catLabel: profilLabel(getProfil(g.profil), lang) }));
  const tableSelected = selected ? tableRows.findIndex(r => r.id === selected.id) : -1;

  const showAside = !isMobile && !isTablet && !!selected && (isSearch || isCities);
  const tabletDetail = isTablet && !!selected && !isAnalyse;
  const showPopup = !isMobile && !isTablet && !!selected && !isCities;

  const cityOptions = [{ value: '__all', label: L.allCities }, ...villes.map(v => ({ value: v.ville, label: `${v.ville} (${v.count})` }))];
  const legendItems = [
    { label: lang === 'EN' ? '1 – 10 members' : '1 à 10 membres', color: 'var(--brand-indigo-300)', shape: 'point' },
    { label: lang === 'EN' ? '11 – 50 members' : '11 à 50 membres', color: 'var(--brand-indigo-500)', shape: 'point' },
    { label: lang === 'EN' ? '50+ members' : 'Plus de 50 membres', color: 'var(--brand-indigo-700)', shape: 'point' }
  ];

  // ============================= Panneaux latéraux =============================

  function renderSearchPanel() {
    return (
      <>
        <div style={{ flex: '0 0 auto', padding: 'var(--space-5) var(--space-5) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--ink-50)' }}>
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder={L.searchPh} aria-label={L.searchPh} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {PROFILS.map(p => (
              <Tag key={p.slug} active={cats[p.slug]} onClick={() => toggleCat(p.slug)}>{profilLabel(p, lang)}</Tag>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }} className="ogec-scroll">
          {listSource.length === 0 ? (
            <EmptyState icon="search" title={L.emptyT} description={L.emptyD} />
          ) : listSource.map(g => (
            <ResultRow key={g.id} g={g} selected={selected?.id === g.id} onClick={() => select(g.id)} />
          ))}
        </div>
      </>
    );
  }

  function renderVillesPanel() {
    return (
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }} className="ogec-scroll">
        <div style={{ padding: 'var(--space-5) var(--space-5) var(--space-3)' }}>
          <span style={{ fontSize: 'var(--text-2xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{L.regions}</span>
        </div>
        <div style={{ padding: '0 var(--space-4) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {regionGroups.map(g => (
            <div key={g.pays} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', padding: '0 var(--space-2) 4px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-strong)' }}>{g.pays}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-data)', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)' }}>{g.count}</span>
              </div>
              {g.villes.map(c => (
                <div key={c.ville} onClick={() => pickVille(c.ville)} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '7px var(--space-3) 7px calc(var(--space-3) - 3px)',
                  borderLeft: '3px solid ' + (selectedVille === c.ville ? 'var(--brand-indigo-600)' : 'transparent'),
                  background: selectedVille === c.ville ? 'var(--surface-brand-soft)' : 'transparent',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: selectedVille === c.ville ? 'var(--text-brand)' : 'var(--text-body)'
                }}>
                  <span style={{ fontSize: 'var(--text-sm)' }}>{c.ville}</span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-data)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{c.count}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderVerifyPanel() {
    const verifyIdle = !verifyResult;
    const verifyMissing = verifyResult === 'none';
    return (
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="ogec-scroll">
        <div style={{ padding: 'var(--space-6) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', background: 'var(--ink-50)', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-strong)', margin: 0, lineHeight: 1.2, letterSpacing: '-0.015em' }}>{L.verifyH}</h2>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6 }}>{L.verifyP(geometres.length)}</p>
          <Input
            value={verifyQuery} onChange={e => setVerifyQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') runVerify(); }}
            placeholder={L.verifyPh} style={{ fontFamily: 'var(--font-data)' }}
          />
          <Button block onClick={runVerify}>{L.verifyBtn}</Button>
        </div>
        <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-2xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{L.catsTitle}</span>
          {PROFILS.map(p => (
            <div key={p.slug} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, flex: '0 0 auto', background: p.color }} />
              <span style={{ flex: 1, fontSize: 'var(--text-sm)' }}>{profilLabel(p, lang)}</span>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}>{catCounts[p.slug]}</span>
            </div>
          ))}
        </div>
        {verifyIdle ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-5)' }}>
            <span>{L.verifyHint}</span>
          </div>
        ) : null}
        {verifyMissing ? (
          <EmptyState icon="info" title={L.notFoundT} description={L.notFoundD} style={{ padding: 'var(--space-6)' }} />
        ) : null}
      </div>
    );
  }

  function renderAnalysePanel() {
    return (
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }} className="ogec-scroll">
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontSize: 'var(--text-2xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{L.filters}</span>
          <span style={{ marginLeft: 'auto' }}><Button variant="ghost" size="sm" onClick={resetFilters}>{L.reset}</Button></span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--text-2xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 600 }}>{L.catsTitle}</span>
          {PROFILS.map(p => (
            <div key={p.slug} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Checkbox label={profilLabel(p, lang)} swatch={p.color} checked={cats[p.slug]} onChange={() => toggleCat(p.slug)} style={{ flex: 1 }} />
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{catCounts[p.slug]}</span>
            </div>
          ))}
        </div>
        <SimpleSelect label={L.cityF} options={cityOptions} value={villeFilter} onChange={e => setVilleFilter(e.target.value)} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--text-2xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 600 }}>{L.seriesF}</span>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {seriesOptions.map(s => (
              <Tag key={s} active={series.includes(s)} onClick={() => toggleSeries(s)}>{s}</Tag>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-6)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-subtle)' }}>
          <StatBlock value={filtered.length} label={L.statShown} />
          <StatBlock value={new Set(filtered.map(g => g.ville)).size} label={L.statCities} />
        </div>
      </div>
    );
  }

  const modePanel = isSearch ? renderSearchPanel() : isCities ? renderVillesPanel() : isVerify ? renderVerifyPanel() : renderAnalysePanel();

  // ============================= Carte =============================

  const mapView = (
    <MapView
      center={center} zoom={zoom} basemap="light" L={L}
      markers={markers} bubbles={bubbles}
      popup={showPopup && selected ? <PopupCard g={selected} L={L} lang={lang} /> : null}
      legend={isCities ? legendItems : null}
      layerPanel={isAnalyse ? (
        <LayerPanel title={L.layersT} layers={[{ id: 'membres', label: L.membresLayer, color: 'var(--layer-point)', visible: membresVisible }]} onToggle={toggleLayer} />
      ) : null}
      onZoomIn={zoomIn} onZoomOut={zoomOut} onFitAll={fitAll} fitAllLabel={L.fitAll}
    />
  );

  // ============================= Rendu mobile =============================

  if (isMobile) {
    const sheetHeightPx = sheet === 'peek' ? '112px' : sheet === 'half' ? '48%' : '86%';
    const cycleSheet = () => setSheet(s => (s === 'peek' ? 'half' : s === 'half' ? 'full' : 'peek'));
    return (
      <div style={{ position: 'relative', height: '100dvh', minHeight: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}>
        <div style={{ flex: '0 0 56px', height: 56, display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: '0 var(--space-4)', background: 'var(--ink-900)', zIndex: 20 }}>
          <Logo variant="mark" size={22} color="var(--white)" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: '1 1 auto', overflow: 'hidden' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', lineHeight: 1.1, color: 'var(--white)', letterSpacing: '-0.015em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{L.appTitleShort}</span>
            <span style={{ fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', fontWeight: 600, whiteSpace: 'nowrap' }}>{L.eyebrowShort}</span>
          </div>
          <button onClick={toggleLang} style={{ border: '1px solid rgba(255,255,255,.18)', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-data)', fontSize: 10.5, color: 'var(--white)', letterSpacing: '0.06em', padding: '8px 10px', borderRadius: 'var(--radius-pill)', minHeight: 36 }}>{lang === 'FR' ? 'FR / en' : 'fr / EN'}</button>
        </div>

        <div style={{ flex: '0 0 auto', display: 'flex', gap: 6, padding: 'var(--space-3) var(--space-4)', background: 'var(--surface-card)', borderBottom: '1px solid var(--border-subtle)', zIndex: 14, overflowX: 'auto' }}>
          {['chercher', 'villes', 'verifier', 'analyser'].map((v, i) => (
            <button key={v} onClick={() => setModeSafe(v)} style={{
              flex: '0 0 auto', borderRadius: 'var(--radius-pill)', padding: '9px 13px', minHeight: 40, cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap',
              border: '1px solid ' + (mode === v ? 'var(--brand-indigo-600)' : 'var(--border-subtle)'),
              background: mode === v ? 'var(--brand-indigo-600)' : 'var(--surface-card)',
              color: mode === v ? 'var(--white)' : 'var(--text-body)'
            }}>{L.modes[i]}</button>
          ))}
        </div>

        <div style={{ flex: 1, minHeight: 0, position: 'relative', background: 'var(--ink-100)' }}>{mapView}</div>

        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: sheetHeightPx, display: 'flex', flexDirection: 'column',
          background: 'var(--surface-card)', borderTop: '1px solid var(--border-subtle)', borderRadius: '20px 20px 0 0',
          boxShadow: '0 -8px 28px rgba(20,18,31,.14)', zIndex: 12, transition: 'height var(--dur-base) var(--ease-out)', overflow: 'hidden'
        }}>
          <button onClick={cycleSheet} style={{ flex: '0 0 auto', border: 0, background: 'none', cursor: 'pointer', padding: '10px var(--space-5) var(--space-3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minHeight: 48 }}>
            <span style={{ width: 44, height: 4, borderRadius: 2, background: 'var(--ink-300)' }} />
            <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, width: '100%' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.015em', lineHeight: 1 }}>
                {selected ? (lang === 'EN' ? 'Member' : 'Fiche membre') : isCities ? selectedVille : isVerify ? L.modes[2] : isAnalyse ? L.filters : (lang === 'EN' ? 'Results' : 'Résultats')}
              </span>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-xs)', color: 'var(--text-faint)' }}>{selected ? selected.identifiant : formatNumber(filtered.length)}</span>
              <span style={{ marginLeft: 'auto', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-brand)' }}>{sheet === 'full' ? (lang === 'EN' ? 'Collapse' : 'Réduire') : (lang === 'EN' ? 'Expand' : 'Agrandir')}</span>
            </span>
          </button>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', borderTop: '1px solid var(--border-subtle)' }} className="ogec-scroll">
            {selected ? (
              <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--ink-50)' }}>
                <DetailCard g={selected} L={L} lang={lang} onClose={clearSelection} />
              </div>
            ) : null}
            {!selected && isSearch ? (
              <>
                <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <Input value={query} onChange={e => setQuery(e.target.value)} placeholder={L.searchPh} />
                  <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto' }}>
                    {PROFILS.map(p => <Tag key={p.slug} active={cats[p.slug]} onClick={() => toggleCat(p.slug)}><span style={{ whiteSpace: 'nowrap' }}>{profilLabel(p, lang)}</span></Tag>)}
                  </div>
                </div>
                {listSource.length === 0 ? <EmptyState icon="search" title={L.emptyT} description={L.emptyD} /> : listSource.map(g => (
                  <ResultRow key={g.id} g={g} selected={false} onClick={() => select(g.id)} />
                ))}
              </>
            ) : null}
            {!selected && isCities ? renderVillesPanel() : null}
            {!selected && isVerify ? renderVerifyPanel() : null}
            {!selected && isAnalyse ? renderAnalysePanel() : null}
          </div>
        </div>
      </div>
    );
  }

  // ============================= Rendu tablette / desktop =============================

  return (
    <div style={{ height: '100dvh', minHeight: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}>
      <header style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', zIndex: 20 }}>
        <div style={{ height: 64, flex: '0 0 64px', display: 'flex', alignItems: 'center', gap: 'var(--space-6)', padding: '0 var(--space-6)', background: 'var(--ink-900)' }}>
          <Logo size={26} color="var(--white)" wordColor="var(--white)" />
          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,.16)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, flex: '1 1 auto', overflow: 'hidden' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', lineHeight: 1.1, color: 'var(--white)', letterSpacing: '-0.015em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{L.appTitle}</span>
            <span style={{ fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{L.eyebrow}</span>
          </div>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-2xs)', letterSpacing: '0.06em', color: 'var(--ink-400)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 'var(--radius-pill)', padding: '3px 10px', whiteSpace: 'nowrap' }}>EPSG:4326</span>
          <Badge tone="alert">{L.draftBadge}</Badge>
          <button onClick={toggleLang} style={{ border: '1px solid rgba(255,255,255,.18)', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-data)', fontSize: 'var(--text-2xs)', color: 'var(--white)', letterSpacing: '0.06em', padding: '5px 10px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap' }}>{lang === 'FR' ? 'FR / en' : 'fr / EN'}</button>
          <Button size="sm" onClick={downloadGeoJSON}>{L.download}</Button>
        </div>
        <div style={{ height: 56, flex: '0 0 56px', display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', gap: 'var(--space-6)', padding: '0 var(--space-6)', background: 'var(--surface-card)', borderBottom: '1px solid var(--border-subtle)' }}>
          <Tabs
            items={['chercher', 'villes', 'verifier', 'analyser'].map((v, i) => ({ value: v, label: L.modes[i] }))}
            value={mode} onChange={setModeSafe}
            style={{ borderBottom: 0, gap: 28, alignItems: 'stretch', whiteSpace: 'nowrap', flex: '0 0 auto' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.02em', lineHeight: 1 }}>{formatNumber(filtered.length)}</span>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-xs)', color: 'var(--text-faint)' }}>/ {formatNumber(geometres.length)}</span>
            <span
              title={nonLocalises ? (lang === 'EN' ? `${nonLocalises} without a recognised city, not mapped` : `${nonLocalises} sans ville reconnue, non cartographié`) : undefined}
              style={{ fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, maxWidth: 96, whiteSpace: 'normal', lineHeight: 1.2 }}
            >{lang === 'EN' ? 'members mapped' : 'membres cartographiés'}</span>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <aside style={{ flex: '0 1 320px', width: 320, minWidth: 248, borderRight: '1px solid var(--border-subtle)', background: 'var(--surface-card)', display: 'flex', flexDirection: 'column' }}>
          {modePanel}
        </aside>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, background: 'var(--ink-100)' }}>
          {isVerify ? (
            <div style={{ flex: '0 0 auto', background: 'var(--surface-card)', borderBottom: '1px solid var(--border-subtle)', padding: 'var(--space-5) var(--space-6)' }}>
              {verified ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Badge tone={getProfil(verified.profil).tone} dot>{L.inscribed}</Badge>
                    <Badge mono>{verified.identifiant}</Badge>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-3)' }}>
                      <Button size="sm" onClick={() => select(verified.id)}>{L.call}</Button>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-strong)', letterSpacing: '-0.015em', lineHeight: 1.1 }}>{verified.nom}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>{verified.cabinet || profilLabel(getProfil(verified.profil), lang)}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                    {[
                      { label: L.fCat, value: profilLabel(getProfil(verified.profil), lang) },
                      { label: L.fCabinet, value: verified.cabinet || '—' },
                      { label: L.fCity, value: verified.ville || '—' },
                      { label: L.fContact, value: verified.contact || '—' }
                    ].map(f => (
                      <div key={f.label}>
                        <div style={{ fontSize: 'var(--text-2xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{f.label}</div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-strong)', marginTop: 4, fontFamily: 'var(--font-data)' }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : verifyResult === 'none' ? (
                <EmptyState icon="info" title={L.notFoundT} description={L.notFoundD} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', padding: 'var(--space-2) 0' }}>
                  <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-xs)', color: 'var(--text-faint)' }}>A011 · B053 · C150</span>
                  <span>{L.verifyHint}</span>
                </div>
              )}
            </div>
          ) : null}

          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            {mapView}
            {tabletDetail ? (
              <div style={{
                position: 'absolute', right: 'var(--space-4)', bottom: 'var(--space-4)', width: 308, background: 'var(--surface-card)',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
                padding: 'var(--space-5)', zIndex: 10
              }}>
                <DetailCard g={selected} L={L} lang={lang} onClose={clearSelection} dense />
              </div>
            ) : null}
          </div>

          {isAnalyse ? (
            <div style={{ flex: '0 0 236px', height: 236, background: 'var(--surface-card)', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-5)' }}>
                <span style={{ fontSize: 'var(--text-2xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{L.tableTitle}</span>
                <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-xs)', color: 'var(--text-faint)' }}>{formatNumber(filtered.length)}</span>
              </div>
              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }} className="ogec-scroll">
                <DataTable columns={tableCols} rows={tableRows} onRowClick={r => select(r.id)} selectedIndex={tableSelected} style={{ border: 0, borderRadius: 0 }} />
              </div>
            </div>
          ) : null}
        </main>

        {showAside ? (
          <aside style={{ flex: '0 0 340px', width: 340, borderLeft: '1px solid var(--border-subtle)', background: 'var(--surface-card)', padding: 'var(--space-5)', overflowY: 'auto' }} className="ogec-scroll">
            <DetailCard g={selected} L={L} lang={lang} onClose={clearSelection} />
          </aside>
        ) : null}
      </div>
    </div>
  );
}
