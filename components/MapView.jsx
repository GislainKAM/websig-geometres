'use client';
import React from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { PROFILS } from '../lib/geometres.js';
import { symboleSVG, regroupementSVG, svgToImage } from '../lib/markers.js';
import { CAMEROUN, CAMEROUN_BBOX, buildMask, buildFocusOutline } from '../lib/cameroun.js';

// Vraie carte : pan, zoom molette, double-clic, tactile — tout vient de
// MapLibre. Fond = style « Liberty » d'OpenFreeMap (coloré : eau, parcs, routes) (données OpenStreetMap,
// sans clé), allégé : on garde l'eau, les parcs et le réseau routier, et parmi
// les étiquettes seulement les noms de lieux (villes, quartiers). Ni bâtiments,
// ni sentiers, ni noms de rues, ni commerces. Si le style ne se charge pas
// (hors connexion), repli sur le gris clair d'Esri puis sur la trame du
// conteneur (.map__trame), visible à travers le canevas transparent.
//
// Aucun fournisseur n'est auto-hébergé : à revoir avant une mise en ligne
// durable, voir BRIEF.md.
const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas';
const STYLE_SECOURS = {
  version: 8,
  sources: {
    base: { type: 'raster', tiles: [`${ESRI}/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`], tileSize: 256, maxzoom: 16 },
    reference: { type: 'raster', tiles: [`${ESRI}/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`], tileSize: 256, maxzoom: 16 }
  },
  layers: [
    { id: 'base', type: 'raster', source: 'base' },
    { id: 'reference', type: 'raster', source: 'reference' }
  ]
};

const COUCHES_EXCLUES = /^(building|tunnel|aeroway|road_area|road_pier|highway-area|highway-path|road_path|road_major_rail|road_transit_rail|road_one|bridge_(path|major_rail|transit_rail)|bridge-path|bridge-railway|railway|ferry|cablecar|poi|highway-name|highway-shield|road_shield|airport|waterway_line_label|water_name|boundary_3|landuse_pitch|landuse_track|natural_earth)/;

/** Style Liberty allégé ; null si le style n'est pas joignable. */
async function styleAllege() {
  try {
    const rep = await fetch(STYLE_URL);
    if (!rep.ok) return null;
    const st = await rep.json();
    st.layers = st.layers.filter(l => !COUCHES_EXCLUES.test(l.id));
    // Étiquettes de lieux : villes, villages et « autres » (quartiers). Pas de pays ni d'États.
    st.layers.forEach(l => {
      if (l.type === 'symbol' && /^label_(country|state)/.test(l.id)) l.layout = { ...l.layout, visibility: 'none' };
    });
    return st;
  } catch (e) {
    return null;
  }
}

// À ce zoom, les regroupements par ville cèdent la place aux symboles des
// membres. En dessous, 120 symboles sur Yaoundé seraient illisibles.
const ZOOM_MEMBRES = 8;
const ENCRE_2 = '#6E6A62';
const VIDE = { type: 'FeatureCollection', features: [] };

// Taille d'un regroupement : 26 à 44 px selon le nombre, comme dans le prototype.
const tailleRegroupement = n => ['min', 1, ['/', ['+', 26, ['*', 4, ['sqrt', n]]], 44]];

function pinExpr(id) {
  return ['case', ['==', ['get', 'id'], id || ' '],
    ['concat', 'pin-', ['get', 'profil'], '-actif'],
    ['concat', 'pin-', ['get', 'profil']]];
}

async function chargerImages(map, vivant) {
  const ajouter = async (nom, svg) => {
    const img = await svgToImage(svg);
    if (!vivant()) return false;
    if (!map.hasImage(nom)) map.addImage(nom, img, { pixelRatio: 2 });
    return true;
  };
  for (const p of PROFILS) {
    if (!(await ajouter('pin-' + p.slug, symboleSVG(p.symbole, false, 2)))) return false;
    if (!(await ajouter('pin-' + p.slug + '-actif', symboleSVG(p.symbole, true, 2)))) return false;
  }
  return ajouter('regroupement', regroupementSVG(2));
}

/** Élément HTML d'un marqueur « Vous êtes ici » / « Lieu signalé ». */
function elementRepere(classe, etiquette) {
  const el = document.createElement('div');
  el.className = classe;
  el.innerHTML = '<span class="repere__a"></span><span class="repere__b"></span><span class="repere__c"></span>';
  const lbl = document.createElement('span');
  lbl.className = 'repere__lbl';
  lbl.textContent = etiquette;
  el.appendChild(lbl);
  return el;
}

export function MapView({
  membres, villes, selectedId, selectedNom, onSelect, onPickVille,
  me, repLoc, pickMode, onPick, padding, labels, registerApi, focus
}) {
  const focusRef = React.useRef(focus);
  focusRef.current = focus;
  const containerRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const [pret, setPret] = React.useState(false);
  const etiquettesRef = React.useRef(new Map());
  const syncRef = React.useRef(() => {});
  const villesRef = React.useRef([]);
  const meMarker = React.useRef(null);
  const repMarker = React.useRef(null);
  const nomMarker = React.useRef(null);

  // Lus par les écouteurs posés une seule fois : des refs évitent de
  // re-souscrire à chaque rendu.
  const cbs = React.useRef({});
  cbs.current = { onSelect, onPickVille, pickMode, onPick, labels };
  const paddingRef = React.useRef(padding);
  paddingRef.current = padding;

  /** Marge caméra = marge de confort + zone masquée par le tiroir mobile (bornée : sinon MapLibre refuse de bouger). */
  const marge = React.useCallback((base = 0) => {
    const c = mapRef.current && mapRef.current.getContainer();
    const bas = (paddingRef.current && paddingRef.current.bottom) || 0;
    const maxBas = c ? Math.max(0, c.clientHeight * 0.6 - base) : bas;
    return { top: base, left: base, right: base, bottom: base + Math.max(0, Math.min(bas, maxBas)) };
  }, []);

  // --- Initialisation (une seule fois) ---
  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;
    let annule = false;
    let ro = null;
    let map = null;
    (async () => {
    const style = (await styleAllege()) || STYLE_SECOURS;
    if (annule || !containerRef.current) return;
    map = new maplibregl.Map({
      container: containerRef.current,
      style,
      bounds: CAMEROUN_BBOX,
      fitBoundsOptions: { padding: 24 },
      minZoom: 3,
      maxZoom: 18,
      attributionControl: false,
      dragRotate: false
    });
    map.touchZoomRotate.disableRotation();
    mapRef.current = map;

    const vivant = () => !annule && !!mapRef.current;

    map.on('load', async () => {
      if (!(await chargerImages(map, vivant))) return;

      map.addSource('frontiere', { type: 'geojson', data: CAMEROUN });
      map.addSource('masque', { type: 'geojson', data: buildMask(focusRef.current) });
      map.addSource('focus-contour', { type: 'geojson', data: buildFocusOutline(focusRef.current) });
      map.addSource('villes', {
        type: 'geojson', data: VIDE, cluster: true, clusterRadius: 52, clusterMaxZoom: ZOOM_MEMBRES - 1,
        // `top` : le plus gros pesant d'un regroupement, encodé effectif*1000 +
        // rang, pour retrouver le nom de la ville qui le « nomme ».
        clusterProperties: {
          total: ['+', ['get', 'count']],
          top: ['max', ['+', ['*', ['get', 'count'], 1000], ['get', 'idx']]]
        }
      });
      map.addSource('points', { type: 'geojson', data: VIDE, cluster: true, clusterRadius: 44, clusterMaxZoom: 11 });

      // Masque : éteint tout ce qui est hors de la zone en focus (le pays entier
      // par défaut, une ville quand la recherche en cible une).
      map.addLayer({ id: 'masque-fill', type: 'fill', source: 'masque', paint: { 'fill-color': '#14181A', 'fill-opacity': 0.4 } });
      map.addLayer({ id: 'frontiere-doublure', type: 'line', source: 'frontiere', paint: { 'line-color': '#ffffff', 'line-width': 3.4, 'line-opacity': 0.6 } });
      map.addLayer({ id: 'frontiere-ligne', type: 'line', source: 'frontiere', paint: { 'line-color': ENCRE_2, 'line-width': 1.2, 'line-opacity': 0.75 } });
      map.addLayer({ id: 'focus-ligne', type: 'line', source: 'focus-contour', paint: { 'line-color': '#14181A', 'line-width': 2, 'line-dasharray': [2, 1.4] } });
      map.addLayer({
        id: 'villes-carre', type: 'symbol', source: 'villes', maxzoom: ZOOM_MEMBRES,
        layout: { 'icon-image': 'regroupement', 'icon-size': tailleRegroupement(['coalesce', ['get', 'total'], ['get', 'count']]), 'icon-allow-overlap': true, 'icon-ignore-placement': true }
      });
      map.addLayer({
        id: 'pins-amas', type: 'symbol', source: 'points', minzoom: ZOOM_MEMBRES, filter: ['has', 'point_count'],
        layout: { 'icon-image': 'regroupement', 'icon-size': tailleRegroupement(['get', 'point_count']), 'icon-allow-overlap': true, 'icon-ignore-placement': true }
      });
      map.addLayer({
        id: 'pins', type: 'symbol', source: 'points', minzoom: ZOOM_MEMBRES, filter: ['!', ['has', 'point_count']],
        layout: { 'icon-image': pinExpr(null), 'icon-allow-overlap': true, 'icon-ignore-placement': true, 'symbol-sort-key': 0 }
      });

      // Clic : tolérance de 18 px autour du doigt (une cible de carte de 16 px
      // est trop petite pour un pouce). On vise d'abord les membres, puis les
      // amas, puis les villes ; sinon, clic dans le vide.
      map.on('click', e => {
        const { x, y } = e.point;
        const feats = map.queryRenderedFeatures([[x - 18, y - 18], [x + 18, y + 18]], { layers: ['pins', 'pins-amas', 'villes-carre'] });
        for (const couche of ['pins', 'pins-amas', 'villes-carre']) {
          const f = feats.filter(g => g.layer.id === couche)
            .map(g => ({ g, d: Math.hypot(map.project(g.geometry.coordinates).x - x, map.project(g.geometry.coordinates).y - y) }))
            .sort((a, b) => a.d - b.d)[0];
          if (!f) continue;
          const p = f.g.properties;
          const centre = f.g.geometry.coordinates;
          if (couche === 'pins') { cbs.current.onSelect(p.id); return; }
          if (couche === 'villes-carre' && !p.cluster) { cbs.current.onPickVille(p.ville); return; }
          const src = map.getSource(couche === 'pins-amas' ? 'points' : 'villes');
          Promise.resolve(src.getClusterExpansionZoom(p.cluster_id))
            .then(z => map.easeTo({ center: centre, zoom: Math.max(z, map.getZoom() + 1) }));
          return;
        }
        if (cbs.current.pickMode) cbs.current.onPick([e.lngLat.lat, e.lngLat.lng]);
        else cbs.current.onSelect(null);
      });
      for (const l of ['pins', 'pins-amas', 'villes-carre']) {
        map.on('mouseenter', l, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', l, () => { map.getCanvas().style.cursor = ''; });
      }
      map.on('move', () => syncRef.current());
      map.on('idle', () => syncRef.current());
      // Cadrage initial : le tiroir mobile couvre le bas de la carte, le pays
      // doit tenir dans la partie visible.
      map.fitBounds(CAMEROUN_BBOX, { padding: marge(24), duration: 0 });
      setPret(true);
    });

    // Le conteneur change de taille sans que la fenêtre bouge (panneau,
    // tiroir) : MapLibre n'écoute que la fenêtre.
    ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => map.resize()) : null;
    if (ro) ro.observe(containerRef.current);
    })();

    return () => {
      annule = true;
      if (ro) ro.disconnect();
      if (map) map.remove();
      mapRef.current = null;
    };
  }, []);

  // --- Masque et contour de la zone en focus ---
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !pret) return;
    map.getSource('masque').setData(buildMask(focus));
    map.getSource('focus-contour').setData(buildFocusOutline(focus));
    map.setLayoutProperty('focus-ligne', 'visibility', focus ? 'visible' : 'none');
  }, [pret, focus]);

  // --- Données : membres (épingles et amas) et villes (carrés) ---
  const geojsonMembres = React.useMemo(() => ({
    type: 'FeatureCollection',
    features: membres.map(p => ({
      type: 'Feature',
      properties: { id: p.id, profil: p.profil },
      geometry: { type: 'Point', coordinates: [p.lon, p.lat] }
    }))
  }), [membres]);

  const geojsonVilles = React.useMemo(() => ({
    type: 'FeatureCollection',
    features: villes.map((v, idx) => ({
      type: 'Feature',
      properties: { ville: v.ville, count: v.count, idx },
      geometry: { type: 'Point', coordinates: [v.lon, v.lat] }
    }))
  }), [villes]);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !pret) return;
    villesRef.current = villes;
    map.getSource('points').setData(geojsonMembres);
    map.getSource('villes').setData(geojsonVilles);
  }, [pret, geojsonMembres, geojsonVilles, villes]);

  // --- Étiquettes : le chiffre au centre d'un regroupement, et le nom de la ville dessous ---
  // En HTML et non en couche `symbol` : une couche texte exigerait un serveur
  // de glyphes, que le fond raster n'a pas. Transparentes aux clics.
  const syncEtiquettes = React.useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer('villes-carre')) return;
    const vivantes = new Set();
    const poser = (cle, lngLat, nombre, nom) => {
      vivantes.add(cle);
      let mk = etiquettesRef.current.get(cle);
      if (!mk) {
        const el = document.createElement('div');
        el.className = 'ogec-count';
        el.innerHTML = '<span class="ogec-count__n"></span><span class="ogec-count__lbl"></span>';
        mk = new maplibregl.Marker({ element: el }).setLngLat(lngLat).addTo(map);
        etiquettesRef.current.set(cle, mk);
      } else {
        mk.setLngLat(lngLat);
      }
      const el = mk.getElement();
      const n = el.firstChild, l = el.lastChild;
      if (n.textContent !== String(nombre)) n.textContent = String(nombre);
      if (l.textContent !== (nom || '')) l.textContent = nom || '';
      l.style.display = nom ? '' : 'none';
    };
    const dans = id => (map.getLayer(id) ? map.queryRenderedFeatures({ layers: [id] }) : []);
    for (const f of dans('villes-carre')) {
      const p = f.properties;
      if (p.cluster) {
        const nom = (villesRef.current[Number(p.top) % 1000] || {}).ville;
        poser('v-c-' + p.cluster_id, f.geometry.coordinates, p.total, nom ? nom + cbs.current.labels.around : '');
      } else {
        poser('v-' + p.ville, f.geometry.coordinates, p.count, p.ville);
      }
    }
    for (const f of dans('pins-amas')) {
      poser('a-' + f.properties.cluster_id, f.geometry.coordinates, f.properties.point_count_abbreviated || f.properties.point_count, '');
    }
    for (const [cle, mk] of etiquettesRef.current) {
      if (!vivantes.has(cle)) { mk.remove(); etiquettesRef.current.delete(cle); }
    }
  }, []);
  syncRef.current = syncEtiquettes;

  React.useEffect(() => { if (pret) syncEtiquettes(); }, [pret, geojsonMembres, geojsonVilles, labels, syncEtiquettes]);
  React.useEffect(() => {
    const etiquettes = etiquettesRef.current;
    return () => { for (const mk of etiquettes.values()) mk.remove(); etiquettes.clear(); };
  }, []);

  // --- Épingle sélectionnée : symbole actif, au-dessus des autres, avec son nom ---
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !pret) return;
    map.setLayoutProperty('pins', 'icon-image', pinExpr(selectedId));
    map.setLayoutProperty('pins', 'symbol-sort-key', ['case', ['==', ['get', 'id'], selectedId || ' '], 10, 0]);
  }, [selectedId, pret]);

  const selectionne = selectedId ? membres.find(m => m.id === selectedId) : null;
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !pret) return;
    if (nomMarker.current) { nomMarker.current.remove(); nomMarker.current = null; }
    if (!selectionne || !selectedNom) return;
    const el = document.createElement('div');
    el.className = 'pin-nom';
    el.textContent = selectedNom;
    nomMarker.current = new maplibregl.Marker({ element: el, anchor: 'top', offset: [0, 28] })
      .setLngLat([selectionne.lon, selectionne.lat]).addTo(map);
  }, [pret, selectionne, selectedNom]);

  // --- Repères : position de l'utilisateur, lieu d'un signalement ---
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !pret) return;
    if (meMarker.current) { meMarker.current.remove(); meMarker.current = null; }
    if (!me) return;
    meMarker.current = new maplibregl.Marker({ element: elementRepere('repere repere--me', labels.here), anchor: 'center' })
      .setLngLat([me[1], me[0]]).addTo(map);
  }, [pret, me, labels.here]);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !pret) return;
    if (repMarker.current) { repMarker.current.remove(); repMarker.current = null; }
    if (!repLoc) return;
    repMarker.current = new maplibregl.Marker({ element: elementRepere('repere repere--rep', labels.repPlace), anchor: 'center' })
      .setLngLat([repLoc[1], repLoc[0]]).addTo(map);
  }, [pret, repLoc, labels.repPlace]);

  React.useEffect(() => () => {
    for (const r of [meMarker, repMarker, nomMarker]) if (r.current) r.current.remove();
  }, []);

  // --- API impérative pour les boutons du parent ---
  React.useEffect(() => {
    if (!registerApi) return;
    registerApi({
      zoomIn: () => mapRef.current && mapRef.current.zoomIn(),
      zoomOut: () => mapRef.current && mapRef.current.zoomOut(),
      overview: () => mapRef.current && mapRef.current.fitBounds(CAMEROUN_BBOX, { padding: marge(24), duration: 700 }),
      flyTo: (lat, lon, zoom) => mapRef.current && mapRef.current.flyTo({
        center: [lon, lat], zoom: zoom || 12, duration: 900, padding: marge(0)
      })
    });
  }, [registerApi, marge]);

  return (
    <div className="map__trame">
      <div ref={containerRef} role="application" aria-label={labels.aria} style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}
