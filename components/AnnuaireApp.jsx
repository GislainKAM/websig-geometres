'use client';
import React from 'react';
import { MapView } from './MapView.jsx';
import { Button, Input, Toast, Icon } from './ui/index.js';
import { Sym } from './Bits.jsx';
import { Onboarding } from './views/Onboarding.jsx';
import { Home } from './views/Home.jsx';
import { Places } from './views/Places.jsx';
import { Results } from './views/Results.jsx';
import { Detail } from './views/Detail.jsx';
import { Filters } from './views/Filters.jsx';
import { Legend } from './views/Legend.jsx';
import { Report } from './views/Report.jsx';
import { Help } from './views/Help.jsx';
import { About } from './views/About.jsx';
import { Menu } from './views/Menu.jsx';
import { dico, CAT, nomRegion, pluriel, dateCourte } from '../lib/i18n.js';
import { filtrer, filtresInitiaux, interpreter, centreRegion, TOUTES } from '../lib/recherche.js';
import { HORS_CAMEROUN } from '../lib/villes.js';
import { chemin } from '../lib/config.js';

const MOBILE_BP = 768;
const DESKTOP_BP = 1100;
const ARRET_TIROIR = { low: 120, mid: 0.52, full: 1 };

const sheetFor = view => (['home', 'results', 'detail'].includes(view) ? 'mid' : 'full');

function useViewport() {
  const [width, setWidth] = React.useState(null);
  React.useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

const lireStockage = (cle, defaut) => { try { return localStorage.getItem(cle) || defaut; } catch (e) { return defaut; } };
const ecrireStockage = (cle, v) => { try { localStorage.setItem(cle, v); } catch (e) { /* stockage bloqué : sans conséquence */ } };

const INITIAL = {
  screen: 'app', view: 'home', stack: [],
  q: '', qErr: '', textQ: '', anchor: null,
  ...filtresInitiaux(),
  draft: null, moreOpen: false,
  sel: null, geoState: null, me: null,
  sheet: 'mid', dragH: null,
  legendOpen: null, toast: null, rep: null, faqQ: '', faqOpen: 0, pq: '',
  lang: 'FR'
};

export function AnnuaireApp({ geometres, villes, nonLocalises, source }) {
  const width = useViewport();
  const mobile = width != null && width < MOBILE_BP;
  const [s, setS] = React.useState(INITIAL);
  const [offline, setOffline] = React.useState(false);
  const [mapH, setMapH] = React.useState(600);
  const mapApi = React.useRef(null);
  const mapWrap = React.useRef(null);
  const toastTimer = React.useRef(null);
  const geoToken = React.useRef(0);
  const drag = React.useRef(null);

  const patch = React.useCallback(p => setS(st => ({ ...st, ...(typeof p === 'function' ? p(st) : p) })), []);
  const registerApi = React.useCallback(api => { mapApi.current = api; }, []);

  const lang = s.lang;
  const en = lang === 'EN';
  const t = React.useMemo(() => dico(lang), [lang]);
  const T = (fr, eng) => (en ? eng : fr);
  const rn = r => nomRegion(r, lang);
  const pl = (n, fr, eng) => pluriel(n, lang, fr, eng);
  const C = CAT[lang];

  // --- Démarrage : langue, présentation, lien partagé ---
  // Liens partagés : #s=detail&id=A055 (fiche) et #s=results&q=Douala (recherche).
  // Appliqués au chargement et à chaque changement de fragment (lien collé dans
  // l'onglet déjà ouvert).
  const lienRef = React.useRef(null);
  lienRef.current = h => {
    const st = h.get('s');
    if (st === 'detail') {
      const m = geometres.find(g => g.identifiant === h.get('id'));
      if (m) { patch({ screen: 'app' }); openDetail(m, true); }
    } else if (st === 'results' && h.get('q')) {
      patch({ screen: 'app' });
      runSearch(h.get('q'));
    }
  };
  React.useEffect(() => {
    const lire = () => new URLSearchParams((location.hash || '').replace(/^#/, ''));
    const h = lire();
    const l = h.get('lang') ? (h.get('lang').toUpperCase() === 'EN' ? 'EN' : 'FR') : lireStockage('ogec-lang', 'FR');
    const premiereVisite = lireStockage('ogec-onb', '') === '';
    const p = { lang: l === 'EN' ? 'EN' : 'FR' };
    if (premiereVisite && !h.get('s')) p.screen = 'onb';
    patch(p);
    setTimeout(() => lienRef.current(h), 0);
    const surChangement = () => lienRef.current(lire());
    window.addEventListener('hashchange', surChangement);
    return () => window.removeEventListener('hashchange', surChangement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => { document.documentElement.lang = en ? 'en' : 'fr'; }, [en]);

  // --- Connexion : l'état réel du navigateur, pas une simulation ---
  React.useEffect(() => {
    const maj = () => setOffline(typeof navigator !== 'undefined' && navigator.onLine === false);
    maj();
    window.addEventListener('online', maj);
    window.addEventListener('offline', maj);
    return () => { window.removeEventListener('online', maj); window.removeEventListener('offline', maj); };
  }, []);

  // --- Hauteur de la zone carte : sert au tiroir mobile ---
  React.useEffect(() => {
    const el = mapWrap.current;
    if (!el) return undefined;
    const mesure = () => setMapH(el.clientHeight);
    mesure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(mesure) : null;
    if (ro) ro.observe(el);
    return () => { if (ro) ro.disconnect(); clearTimeout(toastTimer.current); };
  }, [s.screen]);

  // Filet de sécurité : un pointerup perdu laisserait le tiroir figé en glissé.
  React.useEffect(() => {
    const fin = () => { if (drag.current) { drag.current = null; patch({ dragH: null }); } };
    window.addEventListener('pointerup', fin);
    window.addEventListener('pointercancel', fin);
    return () => { window.removeEventListener('pointerup', fin); window.removeEventListener('pointercancel', fin); };
  }, [patch]);

  // --- Données dérivées du tableau ---
  const regions = React.useMemo(() => [...new Set(villes.map(v => v.region).filter(Boolean))], [villes]);
  const cityCount = React.useMemo(() => {
    const c = {};
    geometres.forEach(m => { if (m.villeResolue) c[m.ville] = (c[m.ville] || 0) + 1; });
    return c;
  }, [geometres]);
  const regCount = React.useMemo(() => {
    const c = {};
    geometres.forEach(m => { if (m.villeResolue && m.region) c[m.region] = (c[m.region] || 0) + 1; });
    return c;
  }, [geometres]);
  const nCities = villes.filter(v => v.region !== HORS_CAMEROUN).length;
  const nRegions = regions.filter(r => r !== HORS_CAMEROUN).length;

  const filtresCourants = { cats: s.cats, inclHon: s.inclHon, region: s.region, city: s.city, radius: s.radius };
  const { liste: results, mesure } = React.useMemo(
    () => filtrer(geometres, { textQ: s.textQ, anchor: s.anchor, cats: s.cats, inclHon: s.inclHon, region: s.region, city: s.city, radius: s.radius }),
    [geometres, s.textQ, s.anchor, s.cats, s.inclHon, s.region, s.city, s.radius]
  );
  const selM = s.sel ? geometres.find(g => g.id === s.sel) : null;
  const nActive = (['privee', 'experts', 'topo'].filter(k => !s.cats[k]).length) + (s.region !== TOUTES ? 1 : 0)
    + (s.city !== TOUTES ? 1 : 0) + (s.radius ? 1 : 0) + (s.inclHon ? 1 : 0);

  // --- Ce que la carte montre ---
  const view = s.view;
  const shown = React.useMemo(() => {
    let liste;
    if (view === 'results' || view === 'detail' || view === 'filters') liste = s.geoState ? [] : results;
    else if (view === 'report') liste = [];
    else liste = filtrer(geometres, { textQ: '', anchor: null, cats: s.cats, inclHon: s.inclHon, region: s.region, city: s.city, radius: null }).liste;
    if (selM && !liste.find(m => m.id === selM.id)) liste = liste.concat([selM]);
    return liste;
  }, [view, s.geoState, results, geometres, s.cats, s.inclHon, s.region, s.city, selM]);

  const membresCarte = React.useMemo(
    () => shown.filter(m => m.villeResolue).map(m => ({ id: m.id, lat: m.lat, lon: m.lon, profil: m.profil })),
    [shown]
  );
  const villesCarte = React.useMemo(() => {
    const par = new Map();
    shown.forEach(m => {
      if (!m.villeResolue) return;
      if (!par.has(m.ville)) par.set(m.ville, { ville: m.ville, lat: m.centre[0], lon: m.centre[1], count: 0 });
      par.get(m.ville).count += 1;
    });
    return [...par.values()].sort((a, b) => b.count - a.count);
  }, [shown]);

  // Zone éclairée : la ville ciblée par la recherche, sinon tout le Cameroun.
  const focus = React.useMemo(() => {
    const an = s.anchor;
    if (!an || (an.kind !== 'ville' && an.kind !== 'quartier')) return null;
    const v = villes.find(x => x.ville === an.ville);
    return v ? { lon: v.lon, lat: v.lat, rayonKm: Math.max(12, Math.min(45, 10 + Math.sqrt(v.count || 1) * 4)) } : null;
  }, [s.anchor, villes]);

  // --- Tiroir mobile ---
  const sheetPx = s.dragH != null ? s.dragH
    : s.sheet === 'low' ? ARRET_TIROIR.low
    : s.sheet === 'full' ? mapH
    : Math.round(mapH * ARRET_TIROIR.mid);
  const mapPadding = React.useMemo(() => (mobile ? { bottom: Math.min(sheetPx, mapH * 0.6) } : null), [mobile, sheetPx, mapH]);

  // --- Navigation entre écrans ---
  const go = (v, p) => setS(st => ({
    ...st, stack: st.stack.concat([st.view]).slice(-12), view: v, sheet: sheetFor(v), dragH: null, ...(p || {})
  }));
  const setRepStep = n => patch(st => ({ rep: { ...st.rep, step: n, errs: {} }, sheet: n === 2 ? 'mid' : 'full' }));
  const back = () => {
    if (s.view === 'report' && s.rep && s.rep.step > 1 && s.rep.step < 4) { setRepStep(s.rep.step - 1); return; }
    const stack = s.stack.slice();
    const prev = stack.pop() || 'home';
    const p = { view: prev, stack, sheet: sheetFor(prev), dragH: null };
    if (s.view === 'detail') p.sel = null;
    if (prev === 'home') Object.assign(p, { textQ: '', anchor: null, q: '', qErr: '', geoState: null, sel: null });
    patch(p);
  };
  const goHome = () => {
    geoToken.current += 1;
    patch({ view: 'home', stack: [], q: '', qErr: '', textQ: '', anchor: null, sel: null, geoState: null, sheet: 'mid', dragH: null, rep: null, me: null, radius: null });
    if (mapApi.current) mapApi.current.overview();
  };
  const toast = (text, tone) => {
    clearTimeout(toastTimer.current);
    patch({ toast: { text, tone: tone || 'succes' } });
    toastTimer.current = setTimeout(() => patch({ toast: null }), 4000);
  };

  // --- Recherche ---
  const voler = (lat, lon, z) => { if (mapApi.current) mapApi.current.flyTo(lat, lon, z); };

  function runSearch(raw) {
    const q = (raw !== undefined ? raw : s.q).trim();
    if (!q) { patch({ qErr: T('Tapez une ville, un quartier, un nom ou un numéro.', 'Type a town, area, name or number.') }); return; }
    geoToken.current += 1;
    const base = { q, qErr: '', geoState: null, sel: null, textQ: '', anchor: null, radius: null };
    if (s.view !== 'results') go('results', base); else patch({ ...base, sheet: 'mid' });
    const r = interpreter(q, { villes, regions, geometres });
    if (r.type === 'quartier' || r.type === 'ville') {
      patch({ anchor: r.anchor });
      voler(r.anchor.coord[0], r.anchor.coord[1], r.zoom);
    } else if (r.type === 'region') {
      const c = centreRegion(r.region, villes);
      patch({ anchor: { kind: 'region', label: r.region, region: r.region, coord: c } });
      if (c) voler(c[0], c[1], r.region === HORS_CAMEROUN ? 3 : 8);
    } else if (r.type === 'matricule') {
      patch({ textQ: q });
      openDetail(r.membre, true);
    } else {
      patch({ textQ: q });
      const res = filtrer(geometres, { textQ: q, anchor: null, ...filtresCourants }).liste;
      const vs = [...new Set(res.filter(m => m.villeResolue).map(m => m.ville))];
      if (res.length && vs.length === 1) voler(res[0].centre[0], res[0].centre[1], 12);
      else if (mapApi.current) mapApi.current.overview();
    }
  }

  function nearMe() {
    const jeton = ++geoToken.current;
    const base = { q: '', qErr: '', textQ: '', anchor: null, sel: null, geoState: 'locating', city: TOUTES, region: TOUTES, radius: null };
    if (s.view !== 'results') go('results', base); else patch({ ...base, sheet: 'mid' });
    if (typeof navigator === 'undefined' || !navigator.geolocation) { patch({ geoState: 'denied', sheet: 'full' }); return; }
    navigator.geolocation.getCurrentPosition(pos => {
      if (jeton !== geoToken.current) return;
      const me = [pos.coords.latitude, pos.coords.longitude];
      const anchor = { kind: 'me', label: 'me', coord: me };
      patch({ geoState: null, me, anchor });
      const proches = filtrer(geometres, { textQ: '', anchor, ...filtresCourants, city: TOUTES, region: TOUTES, radius: null }).liste;
      if (proches.length) voler(me[0], me[1], 12); else if (mapApi.current) mapApi.current.overview();
    }, () => { if (jeton === geoToken.current) patch({ geoState: 'denied', sheet: 'full' }); },
    { timeout: 12000, maximumAge: 300000 });
  }

  function openDetail(m, depuisRecherche) {
    if (s.view === 'detail' && !depuisRecherche) patch({ sel: m.id }); else go('detail', { sel: m.id });
    if (m.villeResolue) voler(m.lat, m.lon, 14);
  }

  const onMapSelect = id => {
    if (!id) return;
    const m = geometres.find(g => g.id === id);
    if (m) openDetail(m);
  };
  const onPickVille = ville => runSearch(ville);

  const openFilters = () => go('filters', {
    draft: { cats: { ...s.cats }, inclHon: s.inclHon, region: s.region, city: s.city, radius: s.radius },
    moreOpen: s.inclHon
  });
  const openReport = (about, type) => go('report', {
    rep: { step: 1, type: type || null, about: about || null, loc: null, desc: '', phone: '', consent: false, errs: {} }
  });
  const setRep = p => patch(st => ({ rep: { ...st.rep, ...p } }));

  const showAll = () => {
    geoToken.current += 1;
    go('results', { q: '', qErr: '', textQ: '', anchor: null, geoState: null, sel: null, radius: null });
    if (mapApi.current) mapApi.current.overview();
  };

  const setLang = l => { ecrireStockage('ogec-lang', l); patch({ lang: l }); };
  const finOnboarding = () => { ecrireStockage('ogec-onb', '1'); patch({ screen: 'app' }); };

  const anchorLabel = a => (!a ? '' : a.kind === 'me' ? T('Autour de vous', 'Near you') : a.kind === 'region' ? rn(a.label) : a.label);

  // --- Entrées de la carte ---
  const mapLabels = React.useMemo(() => ({
    aria: t.mapAria, around: T(' et environs', ' and around'), here: t.here, repPlace: t.repPlace
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [lang]);

  // ======================= Contexte transmis aux écrans =======================
  const A = {
    s, patch, lang, en, t, T, rn, pl, C, mobile, width,
    geometres, villes, regions, cityCount, regCount, nCities, nRegions, nonLocalises, source,
    results, mesure, nR: results.length, selM, nActive, filtresCourants, anchorLabel,
    go, back, goHome, toast, runSearch, nearMe, openDetail, openFilters, openReport, setRep, setRepStep, showAll,
    setLang, finOnboarding, offline, mapApi: mapApi.current
  };

  const vues = { places: Places, results: Results, detail: Detail, filters: Filters, legend: Legend, report: Report, help: Help, about: About, menu: Menu };
  const Vue = view === 'home' ? Home : vues[view];
  const titres = en
    ? { results: 'Results', detail: 'Surveyor profile', filters: 'Filters', legend: 'How to read the map', report: s.rep && s.rep.type === 'maj' ? 'Update my profile' : 'Report a problem', help: 'Help', about: 'About and sources', menu: 'Menu', places: 'Regions and towns' }
    : { results: 'Résultats', detail: 'Fiche du géomètre', filters: 'Filtres', legend: 'Comment lire la carte', report: s.rep && s.rep.type === 'maj' ? 'Mettre à jour ma fiche' : 'Signaler un problème', help: 'Aide', about: 'À propos et sources', menu: 'Menu', places: 'Régions et villes' };
  const panelTitle = titres[view] || t.appTitle;

  // --- Poignée du tiroir mobile ---
  const onHandleDown = e => { drag.current = { y: e.clientY, h: sheetPx, moved: false }; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* sans capture */ } };
  const onHandleMove = e => {
    const g = drag.current; if (!g) return;
    const dy = e.clientY - g.y;
    if (!g.moved && Math.abs(dy) < 5) return;
    g.moved = true;
    patch({ dragH: Math.max(120, Math.min(mapH, g.h - dy)) });
  };
  const onHandleUp = () => {
    const g = drag.current; drag.current = null; if (!g) return;
    if (!g.moved) { patch({ sheet: { low: 'mid', mid: 'full', full: 'low' }[s.sheet], dragH: null }); return; }
    const h = s.dragH;
    const opts = [['low', ARRET_TIROIR.low], ['mid', mapH * ARRET_TIROIR.mid], ['full', mapH]];
    opts.sort((a, b) => Math.abs(a[1] - h) - Math.abs(b[1] - h));
    patch({ sheet: opts[0][0], dragH: null });
  };

  const legendOpen = s.legendOpen == null ? (width != null && width >= DESKTOP_BP) : s.legendOpen;
  const reportPick = view === 'report' && s.rep && s.rep.step === 2;
  const panneauLarge = width != null && width >= DESKTOP_BP ? 400 : 360;

  const fraicheur = source && source.statut === 'verifie'
    ? t.freshRead + dateCourte(source.dateVerification)
    : t.freshDraft;
  const mentionAjouts = source && source.ajouts.n
    ? ' · ' + source.ajouts.n + (mobile ? T(' ajouts non relus', ' unreviewed additions') : T(' inscriptions récentes non relues', ' recent registrations not reviewed'))
    : '';

  if (s.screen === 'onb') return <Onboarding A={A} />;

  return (
    <div className="app" style={{ '--pw': panneauLarge + 'px', '--sheet-h': sheetPx + 'px' }}>
      <header className="app__head">
        <button type="button" className="head__home" onClick={goHome} aria-label={t.homeAria}>
          <img src={chemin('/brand/logo-ogec-sombre.svg')} alt="OGEC" className="head__logo" />
          <span className="head__titre hide-mobile">
            <span className="head__t1">{t.appTitle}</span>
            <span className="head__t2">{t.appSub}</span>
          </span>
        </button>
        <span className="head__fill" />
        <button type="button" className="head__lang" onClick={() => setLang(en ? 'FR' : 'EN')} aria-label={t.switchLang} lang={en ? 'fr' : 'en'}>{en ? 'FR' : 'EN'}</button>
        <Button variant="ghost" className="head__btn" onClick={() => go('help', { faqQ: '' })}><Icon name="help" /><span className="hide-mobile">{t.help}</span></Button>
        <Button variant="ghost" className="head__btn" aria-label={t.openMenu} onClick={() => (view === 'menu' ? back() : go('menu'))}>
          <Icon name="menu" /><span className="hide-mobile">Menu</span>
        </Button>
      </header>

      <form role="search" className="app__search" onSubmit={e => { e.preventDefault(); runSearch(); }}>
        <div className="search__row">
          <Input
            type="search" enterKeyHint="search" aria-label={t.searchAria}
            placeholder={width != null && width < DESKTOP_BP ? T('Ville, quartier ou nom', 'Town, area or name') : T('Ville, quartier, nom ou n°', 'Town, area, name or no.')}
            value={s.q} onChange={e => patch({ q: e.target.value, qErr: '' })} error={s.qErr}
            prefix={<Icon name="search" />}
          />
          <Button type="submit">{t.search}</Button>
        </div>
        {offline ? (
          <div role="status" className="offline">
            <Icon name="wifiOff" />
            <span className="offline__t"><strong>{t.offline}</strong>{t.offlineT}</span>
            <Button variant="secondary" onClick={() => { const ok = navigator.onLine !== false; setOffline(!ok); if (ok) toast(T('Connexion rétablie.', 'Connection restored.')); }}>{t.retry}</Button>
          </div>
        ) : null}
        <div className="fresh" data-statut={source && source.statut}>{fraicheur}{mentionAjouts}</div>
      </form>

      <div className="app__map" ref={mapWrap}>
        <MapView
          membres={membresCarte} villes={villesCarte}
          selectedId={s.sel} selectedNom={selM ? selM.nom : ''}
          onSelect={onMapSelect} onPickVille={onPickVille}
          me={s.me} repLoc={view === 'report' && s.rep ? s.rep.loc : null}
          pickMode={!!reportPick} onPick={loc => setRep({ loc })}
          padding={mapPadding} labels={mapLabels} focus={focus} registerApi={registerApi}
        />
        {offline ? (
          <div className="map__offline"><div className="map__offline-box">{t.offlineMap}</div></div>
        ) : null}
        {reportPick && !s.rep.loc ? <div role="status" className="map__hint">{t.tapMap}</div> : null}

        <div className="map__zoom">
          <button type="button" onClick={() => mapApi.current && mapApi.current.zoomIn()} aria-label={t.zoomIn} title={t.zoomIn}><Icon name="plus" /></button>
          <button type="button" onClick={() => mapApi.current && mapApi.current.zoomOut()} aria-label={t.zoomOut} title={t.zoomOut}><Icon name="minus" /></button>
          <button type="button" onClick={() => mapApi.current && mapApi.current.overview()} aria-label={t.overview} title={t.overview}><Icon name="globe" /></button>
        </div>

        <div className="map__tools">
          <Button variant="secondary" onClick={nearMe}><Icon name="locate" />{t.nearMeLbl}</Button>
          <div className="legend">
            <button type="button" className="legend__toggle" aria-expanded={legendOpen} onClick={() => patch({ legendOpen: !legendOpen })}>
              {t.whatYouSee}<span className="legend__chev"><Icon name={legendOpen ? 'chevU' : 'chevD'} /></span>
            </button>
            {legendOpen ? (
              <ul className="legend__list">
                {['privee', 'experts', 'topo'].map(k => (
                  <li key={k}><span className="legend__sym"><Sym profil={k} size={14} /></span>{C[k].chip}</li>
                ))}
                <li><span className="legend__sym"><span className="sym-carre-encre" /></span>{T('Plusieurs dans la ville', 'Several in the town')}</li>
                <li><button type="button" className="link" onClick={() => go('legend')}>{t.howRead}</button></li>
              </ul>
            ) : null}
          </div>
        </div>

        <div className="map__attr" style={mobile ? { bottom: Math.min(sheetPx, mapH) } : undefined}>{mobile ? '© OpenStreetMap · OpenFreeMap · geoBoundaries' : t.attr}</div>
      </div>

      <section className="app__panel" aria-label={panelTitle}>
        {mobile ? (
          <button
            type="button" className="panel__handle"
            onPointerDown={onHandleDown} onPointerMove={onHandleMove} onPointerUp={onHandleUp}
            aria-label={s.sheet === 'full' ? T('Réduire le panneau', 'Collapse the panel') : T('Agrandir le panneau', 'Expand the panel')}
          ><span /></button>
        ) : null}

        {view !== 'home' ? (
          <div className="panel__head">
            <button type="button" className="panel__back" onClick={back} aria-label={view === 'detail' ? T('Retour aux résultats', 'Back to results') : T('Retour à l\'écran précédent', 'Back to the previous screen')}>
              <span aria-hidden="true">←</span>{t.back}
            </button>
            <h2 className="panel__titre">{panelTitle}</h2>
          </div>
        ) : null}

        <div className="panel__body">
          <Vue A={A} />
        </div>
      </section>

      {s.toast ? (
        <div className="toast-zone">
          <Toast tone={s.toast.tone} onClose={() => patch({ toast: null })} closeLabel={T('Fermer', 'Close')}>{s.toast.text}</Toast>
        </div>
      ) : null}
    </div>
  );
}
