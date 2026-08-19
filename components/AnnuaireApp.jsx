'use client';
import React from 'react';
import { Logo, Badge, Button, Input, Tag, Tabs, EmptyState, StatBlock, DataTable, Checkbox, Legend, Icon } from './ui/index.js';
import { MapView } from './MapView.jsx';
import { MapControls } from './MapControls.jsx';
import { Avatar } from './Avatar.jsx';
import { SimpleSelect } from './SimpleSelect.jsx';
import { DetailCard, PopupCard, sousTitre } from './DetailCard.jsx';
import { getProfil, PROFILS } from '../lib/geometres.js';
import { T, profilLabel } from '../lib/i18n.js';
import { formatNumber } from '../lib/tiles.js';
import { normalizeKey } from '../lib/villes.js';

const MOBILE_BP = 760;
const TABLET_BP = 1140;

// Positions d'accroche du tiroir mobile, en fraction de la hauteur du
// viewport. `peek` laisse la carte quasi entière visible — c'est là qu'on
// replie le tiroir quand l'utilisateur demande la vue étendue.
const ACCROCHES = { peek: 0.14, half: 0.48, full: 0.86 };

// Table attributaire (mode Analyser) : hauteur au départ, plancher, et
// hauteur de carte à préserver quoi qu'il arrive quand on tire la poignée.
const TABLE_DEFAUT = 236;
const TABLE_MIN = 132;
const CARTE_MIN = 200;

function useViewport() {
  const [size, setSize] = React.useState({ width: null, height: null });
  React.useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

/**
 * Rappel des filtres en cours, chacun retirable d'un clic sur sa croix.
 * Sans ça, un filtre posé depuis un autre panneau (ou depuis la carte) ne se
 * défait plus : on ne peut que le remplacer par un autre.
 */
function FilterChips({ items, L, onClearAll }) {
  if (!items.length) return null;
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)',
      padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-brand-soft)'
    }}>
      <span style={{ fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)', marginRight: 2 }}>{L.activeFilters}</span>
      {items.map(it => (
        <button
          key={it.key} onClick={it.onClear} title={L.clearOne}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', font: 'inherit',
            fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-brand)',
            background: 'var(--surface-card)', border: '1px solid var(--border-brand)',
            borderRadius: 'var(--radius-pill)', padding: '4px 8px 4px 10px', minHeight: 28
          }}
        >
          <span>{it.label}</span>
          <Icon name="x" size={13} />
        </button>
      ))}
      <button
        onClick={onClearAll}
        style={{
          marginLeft: 'auto', border: 0, background: 'none', cursor: 'pointer', font: 'inherit',
          fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-brand)', textDecoration: 'underline', padding: '4px 2px'
        }}
      >{L.clearAll}</button>
    </div>
  );
}

const ELLIPSE = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };

/**
 * Part d'une catégorie dans le tableau, en barre proportionnelle.
 *
 * Remplace le carré de couleur des légendes : le carré ne servait qu'à
 * rappeler une teinte, la barre dit en plus ce que les nombres seuls font
 * mal voir — que les experts assermentés pèsent la moitié du tableau et les
 * honoraires presque rien.
 */
function CategoryBar({ value, max, color }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <span style={{ display: 'block', height: 4, borderRadius: 2, background: 'var(--ink-100)', overflow: 'hidden' }}>
      <span style={{ display: 'block', height: '100%', width: pct + '%', background: color, borderRadius: 2 }} />
    </span>
  );
}

function ResultRow({ g, selected, onClick, lang }) {
  return (
    <button type="button" onClick={onClick} className="ogec-row" data-selected={selected ? 'true' : 'false'}>
      <Avatar g={g} size={38} lang={lang} />
      <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ ...ELLIPSE, fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', letterSpacing: '-0.005em', lineHeight: 1.3 }}>{g.nom}</span>
        <span style={{ ...ELLIPSE, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.3 }}>{g.cabinet || '—'}</span>
      </span>
      <span style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 10.5, fontWeight: 500, color: 'var(--text-body)', background: 'var(--ink-100)', borderRadius: 'var(--radius-sm)', padding: '3px 6px', lineHeight: 1.2 }}>{g.identifiant}</span>
        <span style={{ fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>{g.ville || '—'}</span>
      </span>
    </button>
  );
}

export function AnnuaireApp({ geometres, villes, nonLocalises, source }) {
  const { width, height } = useViewport();
  const isMobile = width != null && width < MOBILE_BP;
  const isTablet = width != null && width >= MOBILE_BP && width < TABLET_BP;

  const [mode, setMode] = React.useState('chercher');
  const [lang, setLang] = React.useState('FR');
  const [query, setQuery] = React.useState('');
  const [verifyQuery, setVerifyQuery] = React.useState('');
  const [verifyResult, setVerifyResult] = React.useState(null); // null | 'none' | id
  const [selectedId, setSelectedId] = React.useState(null);
  // '' = aucune ville retenue, donc toutes. Démarrer sur la première ville
  // enfermait l'utilisateur dans un filtre qu'il n'avait pas posé et qu'il ne
  // pouvait qu'échanger contre un autre.
  const [selectedVille, setSelectedVille] = React.useState('');
  const [cats, setCats] = React.useState(() => Object.fromEntries(PROFILS.map(p => [p.slug, true])));
  const [villeFilter, setVilleFilter] = React.useState('__all');
  const [series, setSeries] = React.useState([]);
  const [sheet, setSheet] = React.useState('half');
  const [sheetDrag, setSheetDrag] = React.useState(null); // hauteur en px pendant un glissé
  const [tableH, setTableH] = React.useState(TABLE_DEFAUT);   // table attributaire (Analyser)
  const [fond, setFond] = React.useState('osm');
  const [couches, setCouches] = React.useState({ membres: true, frontiere: true, masque: true });
  const mapApiRef = React.useRef(null);
  const registerMapApi = React.useCallback(api => { mapApiRef.current = api; }, []);
  const dragRef = React.useRef(null);
  const tableDragRef = React.useRef(null);

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

  const catMax = Math.max(1, ...PROFILS.map(p => catCounts[p.slug] || 0));

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

  // Hauteur courante du tiroir mobile : la position d'accroche, ou la
  // hauteur suivie au doigt tant qu'un glissé est en cours.
  const sheetPx = !isMobile || height == null ? 0
    : (sheetDrag != null ? sheetDrag : Math.round(ACCROCHES[sheet] * height));
  // Ce que le tiroir mange en bas de la carte : la caméra doit en tenir
  // compte, sinon « vue étendue » cadre sur une zone à moitié cachée.
  const mapPadding = React.useMemo(
    () => (isMobile ? { bottom: sheetPx } : null),
    [isMobile, sheetPx]
  );

  // Filet de sécurité : si un pointerup se perd (geste interrompu par le
  // système, pointeur relâché hors fenêtre), le tiroir resterait figé à la
  // hauteur du glissé en cours. On rend la main à la dernière position
  // d'accroche plutôt que de laisser l'utilisateur avec un tiroir bloqué.
  React.useEffect(() => {
    const finGeste = () => {
      if (dragRef.current) { dragRef.current = null; setSheetDrag(null); }
      if (tableDragRef.current) {
        tableDragRef.current = null;
        if (mapApiRef.current) mapApiRef.current.resize();
      }
    };
    window.addEventListener('pointerup', finGeste);
    window.addEventListener('pointercancel', finGeste);
    return () => {
      window.removeEventListener('pointerup', finGeste);
      window.removeEventListener('pointercancel', finGeste);
    };
  }, []);

  // Poignée de la table attributaire. Le plafond se calcule sur la hauteur
  // réelle du viewport moins les deux barres d'en-tête, pour qu'on ne puisse
  // jamais tirer la table au point de faire disparaître la carte.
  const tableMax = Math.max(TABLE_MIN, (height || 800) - 120 - CARTE_MIN);
  const borneTable = h => Math.max(TABLE_MIN, Math.min(tableMax, h));
  const poserTableH = h => setTableH(borneTable(h));

  const onTableDown = e => {
    e.currentTarget.setPointerCapture(e.pointerId);
    tableDragRef.current = { y: e.clientY, h: tableH };
  };
  const onTableMove = e => {
    const d = tableDragRef.current;
    if (!d) return;
    poserTableH(d.h + (d.y - e.clientY)); // vers le haut = table plus haute
  };
  const onTableUp = e => {
    if (!tableDragRef.current) return;
    tableDragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (mapApiRef.current) mapApiRef.current.resize();
  };
  const onTableKey = e => {
    const pas = e.key === 'ArrowUp' ? 24 : e.key === 'ArrowDown' ? -24 : 0;
    if (!pas) return;
    e.preventDefault();
    // Forme fonctionnelle : deux pressions rapprochées tombent dans le même
    // lot de rendu et liraient toutes deux la hauteur d'avant, ne comptant
    // ainsi que pour une seule.
    setTableH(h => borneTable(h + pas));
    if (mapApiRef.current) mapApiRef.current.resize();
  };

  const toggleCat = slug => setCats(prev => ({ ...prev, [slug]: !prev[slug] }));
  const toggleSeries = s => setSeries(prev => prev.includes(s) ? prev.filter(x => x !== s) : prev.concat(s));
  const resetCats = () => setCats(Object.fromEntries(PROFILS.map(p => [p.slug, true])));
  const resetFilters = () => { resetCats(); setVilleFilter('__all'); setSeries([]); setQuery(''); setSelectedVille(''); };
  const toggleLang = () => setLang(l => l === 'FR' ? 'EN' : 'FR');
  const clearSelection = () => setSelectedId(null);
  const toggleCouche = id => setCouches(prev => ({ ...prev, [id]: !prev[id] }));

  const select = id => {
    if (id == null) { setSelectedId(null); return; }
    const m = geometres.find(g => g.id === id);
    if (!m) return;
    setSelectedId(id);
    if (m.lat != null && mapApiRef.current) mapApiRef.current.flyTo(m.lon, m.lat, 13);
    if (isMobile) setSheet(s => (s === 'peek' ? 'half' : s));
  };
  // Re-cliquer la ville déjà retenue la désélectionne : c'est le seul geste
  // qui permette de revenir à « toutes les villes » depuis la carte.
  const pickVille = ville => {
    setSelectedId(null);
    if (ville === selectedVille) { setSelectedVille(''); fitAll(); return; }
    const v = villes.find(x => x.ville === ville);
    setSelectedVille(ville);
    if (v && mapApiRef.current) mapApiRef.current.flyTo(v.lon, v.lat, 11);
  };
  const zoomIn = () => mapApiRef.current && mapApiRef.current.zoomIn();
  const zoomOut = () => mapApiRef.current && mapApiRef.current.zoomOut();
  function fitAll() {
    setSelectedId(null);
    // Sur mobile, replier d'abord : cadrer sous un tiroir à moitié ouvert
    // revient à cadrer sur une carte à moitié cachée. La marge est passée
    // explicitement, l'état du tiroir n'étant pas encore appliqué au DOM.
    let override = null;
    if (isMobile) {
      setSheet('peek');
      setSheetDrag(null);
      override = { bottom: Math.round(ACCROCHES.peek * (height || 0)) };
    }
    if (mapApiRef.current) mapApiRef.current.fitAll(override);
  }
  const setModeSafe = m => { setMode(m); if (m !== 'verifier') setVerifyResult(null); };

  const runVerify = () => {
    const q = verifyQuery.trim().toLowerCase();
    if (!q) { setVerifyResult(null); return; }
    const hit = geometres.find(g => g.identifiant.toLowerCase() === q)
      || geometres.find(g => g.nom.toLowerCase().includes(q) || g.identifiant.toLowerCase().includes(q));
    if (hit) {
      setVerifyResult(hit.id); setSelectedId(hit.id);
      if (hit.lat != null && mapApiRef.current) mapApiRef.current.flyTo(hit.lon, hit.lat, 12);
    } else {
      setVerifyResult('none'); setSelectedId(null);
    }
  };

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

  // --- Carte : points affichés selon le mode ---
  let markerSource = [];
  if (isSearch || isAnalyse) markerSource = couches.membres ? filtered : [];
  else if (isVerify) markerSource = selected ? [selected] : [];
  const mapPoints = markerSource
    .filter(g => g.villeResolue)
    .map(g => ({ id: g.id, lat: g.lat, lon: g.lon, profil: g.profil, nom: g.nom }));

  // --- Masque : la zone en focus suit le filtre actif, pas la sélection
  // d'une fiche individuelle — Par ville → ville choisie, Chercher/Analyser
  // → ville filtrée, Vérifier → ville du membre vérifié. Aucun filtre de
  // ville actif → tout le Cameroun est éclairé (masque = mêmes frontières
  // que le contour national).
  const focusVilleName = isCities ? (selectedVille || null)
    : isVerify ? (verified && verified.villeResolue ? verified.ville : null)
    : (villeFilter !== '__all' ? villeFilter : null);
  const focusVilleData = focusVilleName ? villes.find(v => v.ville === focusVilleName) : null;
  const focus = focusVilleData ? {
    lon: focusVilleData.lon, lat: focusVilleData.lat,
    rayonKm: Math.max(12, Math.min(45, 10 + Math.sqrt(focusVilleData.count || 1) * 4))
  } : null;

  // --- Liste résultats ---
  const listSource = isCities
    ? (selectedVille ? geometres.filter(g => g.ville === selectedVille) : filtered)
    : filtered;

  // --- Filtres actifs, chacun retirable ---
  const catsOff = PROFILS.filter(p => !cats[p.slug]);
  const filterChips = [];
  if (query.trim()) filterChips.push({ key: 'q', label: `« ${query.trim()} »`, onClear: () => setQuery('') });
  if (isCities && selectedVille) filterChips.push({ key: 'sv', label: selectedVille, onClear: () => { setSelectedVille(''); fitAll(); } });
  if (villeFilter !== '__all') filterChips.push({ key: 'vf', label: `${L.cityF} : ${villeFilter}`, onClear: () => setVilleFilter('__all') });
  if (catsOff.length) filterChips.push({
    key: 'cats',
    label: `${L.catsTitle} : ${PROFILS.length - catsOff.length}/${PROFILS.length}`,
    onClear: resetCats
  });
  series.forEach(s => filterChips.push({ key: 's-' + s, label: `${L.seriesF} ${s}`, onClear: () => toggleSeries(s) }));

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
  // La bulle sur la carte ne sert que là où aucun panneau ne montre déjà la
  // fiche : afficher les deux en même temps, c'était dire deux fois la même
  // chose en masquant la carte au passage.
  const showPopup = !isMobile && !isTablet && !!selected && !showAside;

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
        <FilterChips items={filterChips} L={L} onClearAll={resetFilters} />
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }} className="ogec-scroll">
          {listSource.length === 0 ? (
            <EmptyState icon="search" title={L.emptyT} description={L.emptyD} />
          ) : listSource.map(g => (
            <ResultRow key={g.id} g={g} lang={lang} selected={selected?.id === g.id} onClick={() => select(g.id)} />
          ))}
        </div>
      </>
    );
  }

  function renderVillesPanel() {
    return (
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }} className="ogec-scroll">
        <div style={{ padding: 'var(--space-5) var(--space-5) var(--space-3)', display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--text-2xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{L.regions}</span>
          {selectedVille ? (
            <span style={{ marginLeft: 'auto' }}>
              <Button variant="ghost" size="sm" onClick={() => { setSelectedVille(''); fitAll(); }}>{L.allCitiesSel}</Button>
            </span>
          ) : null}
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
            <div key={p.slug} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)' }}>
                <span style={{ flex: 1, fontSize: 'var(--text-sm)' }}>{profilLabel(p, lang)}</span>
                <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}>{catCounts[p.slug]}</span>
              </div>
              <CategoryBar value={catCounts[p.slug]} max={catMax} color={p.color} />
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
            <div key={p.slug} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Checkbox label={profilLabel(p, lang)} checked={cats[p.slug]} onChange={() => toggleCat(p.slug)} style={{ flex: 1 }} />
                <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{catCounts[p.slug]}</span>
              </div>
              <CategoryBar value={catCounts[p.slug]} max={catMax} color={p.color} />
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

  const popupTarget = showPopup && selected && selected.lat != null ? selected : null;

  const mapView = (
    <>
      <MapView
        points={mapPoints} villes={villes} mode={mode} focus={focus}
        selectedId={selectedId} onSelect={select} onSelectVille={pickVille}
        fond={fond} couches={couches} registerApi={registerMapApi} padding={mapPadding}
        popupData={popupTarget} onClosePopup={clearSelection}
        renderPopup={g => <PopupCard g={g} L={L} lang={lang} onClose={clearSelection} />}
      />
      <MapControls
        L={L} lang={lang} couches={couches} onToggleCouche={toggleCouche}
        fond={fond} onFond={setFond}
        onZoomIn={zoomIn} onZoomOut={zoomOut} onFitAll={fitAll}
      />
      {isCities ? (
        <div style={{ position: 'absolute', top: 'var(--space-4)', left: 'var(--space-4)', zIndex: 5 }}>
          <Legend title={L.legendT} items={legendItems} />
        </div>
      ) : null}
    </>
  );

  // ============================= Rendu mobile =============================

  if (isMobile) {
    const vh = height || 0;
    const cycleSheet = () => setSheet(s => (s === 'peek' ? 'half' : s === 'half' ? 'full' : 'peek'));

    // Glissé du tiroir : on suit le doigt en pixels, puis on accroche à la
    // position la plus proche au relâcher. Un déplacement inférieur au seuil
    // reste un simple appui, qui fait défiler les positions comme avant.
    const SEUIL_TAP = 6;
    const onHandleDown = e => {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = { y: e.clientY, h: sheetPx, bouge: false };
    };
    const onHandleMove = e => {
      const d = dragRef.current;
      if (!d) return;
      const dy = d.y - e.clientY;
      if (Math.abs(dy) > SEUIL_TAP) d.bouge = true;
      setSheetDrag(Math.max(64, Math.min(vh * 0.92, d.h + dy)));
    };
    const onHandleUp = e => {
      const d = dragRef.current;
      if (!d) return;
      dragRef.current = null;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
      if (!d.bouge) { setSheetDrag(null); cycleSheet(); return; }
      const h = sheetDrag != null ? sheetDrag : d.h;
      const proche = Object.keys(ACCROCHES).reduce((a, b) =>
        Math.abs(ACCROCHES[a] * vh - h) < Math.abs(ACCROCHES[b] * vh - h) ? a : b);
      setSheet(proche);
      setSheetDrag(null);
    };

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
          position: 'absolute', left: 0, right: 0, bottom: 0, height: sheetPx, display: 'flex', flexDirection: 'column',
          background: 'var(--surface-card)', borderTop: '1px solid var(--border-subtle)', borderRadius: '20px 20px 0 0',
          boxShadow: '0 -8px 28px rgba(20,18,31,.14)', zIndex: 12, overflow: 'hidden',
          // Pas de transition pendant le glissé : la hauteur doit coller au
          // doigt, l'animation ne sert qu'à l'accroche au relâcher.
          transition: sheetDrag != null ? 'none' : 'height var(--dur-base) var(--ease-out)'
        }}>
          <div
            role="button" tabIndex={0} aria-label={sheet === 'full' ? (lang === 'EN' ? 'Collapse' : 'Réduire') : (lang === 'EN' ? 'Expand' : 'Agrandir')}
            onPointerDown={onHandleDown} onPointerMove={onHandleMove}
            onPointerUp={onHandleUp} onPointerCancel={onHandleUp}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cycleSheet(); } }}
            style={{ flex: '0 0 auto', cursor: 'grab', touchAction: 'none', padding: '10px var(--space-5) var(--space-3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minHeight: 48 }}
          >
            <span style={{ width: 44, height: 4, borderRadius: 2, background: 'var(--ink-300)' }} />
            <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, width: '100%' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.015em', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selected ? (lang === 'EN' ? 'Member' : 'Fiche membre') : isCities ? (selectedVille || L.allCitiesSel) : isVerify ? L.modes[2] : isAnalyse ? L.filters : (lang === 'EN' ? 'Results' : 'Résultats')}
              </span>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-xs)', color: 'var(--text-faint)' }}>{selected ? selected.identifiant : formatNumber(listSource.length)}</span>
              <span style={{ marginLeft: 'auto', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-brand)', whiteSpace: 'nowrap' }}>{sheet === 'full' ? (lang === 'EN' ? 'Collapse' : 'Réduire') : (lang === 'EN' ? 'Expand' : 'Agrandir')}</span>
            </span>
          </div>

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
                <FilterChips items={filterChips} L={L} onClearAll={resetFilters} />
                {listSource.length === 0 ? <EmptyState icon="search" title={L.emptyT} description={L.emptyD} /> : listSource.map(g => (
                  <ResultRow key={g.id} g={g} lang={lang} selected={selected?.id === g.id} onClick={() => select(g.id)} />
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
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                    <Avatar g={verified} size={48} lang={lang} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-strong)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{verified.nom}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 3 }}>{sousTitre(verified, lang)}</div>
                    </div>
                    <Button size="sm" onClick={() => select(verified.id)}>{L.call}</Button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                    {[
                      { label: L.fStatus, value: L.inscribed },
                      { label: L.fMat, value: verified.identifiant, mono: true },
                      { label: L.fCabinet, value: verified.cabinet || '—' },
                      { label: L.fContact, value: verified.contact || '—', mono: true }
                    ].map(f => (
                      <div key={f.label}>
                        <div style={{ fontSize: 'var(--text-2xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{f.label}</div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-strong)', marginTop: 4, fontFamily: f.mono ? 'var(--font-data)' : 'inherit' }}>{f.value}</div>
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
            <div style={{ flex: '0 0 auto', height: tableH, background: 'var(--surface-card)', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div
                role="separator" aria-orientation="horizontal" tabIndex={0}
                aria-label={L.resizeTable} aria-valuenow={tableH} aria-valuemin={TABLE_MIN} aria-valuemax={tableMax}
                onPointerDown={onTableDown} onPointerMove={onTableMove}
                onPointerUp={onTableUp} onPointerCancel={onTableUp} onKeyDown={onTableKey}
                style={{ flex: '0 0 auto', height: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'ns-resize', touchAction: 'none' }}
              >
                <span style={{ width: 38, height: 3, borderRadius: 2, background: 'var(--ink-300)' }} />
              </div>
              <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '0 var(--space-5) var(--space-3)' }}>
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
