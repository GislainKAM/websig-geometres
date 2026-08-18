'use client';
import React from 'react';
import { createRoot } from 'react-dom/client';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { PROFILS } from '../lib/geometres.js';
import { buildPinSVG, svgToImage } from '../lib/markers.js';
import { CAMEROUN, CAMEROUN_BBOX, buildMask, buildFocusOutline, focusBounds } from '../lib/mask.js';
import { decalagePourCadrer } from '../lib/popup.js';

// Couches interactives : clic dessus → sélection, clic ailleurs sur la
// carte (fond, masque, frontière) → désélection. Voir le handler générique
// 'click' plus bas.
const COUCHES_CLIQUABLES = ['epingles', 'amas', 'villes-cercle'];

// Taille d'affichage des épingles. buildPinSVG() dessine 42×49 px et l'image
// est enregistrée en pixelRatio 2, donc icon-size 1 = 21×24,5 px à l'écran.
// En dessous, le glyphe de catégorie dans la tête n'est plus lisible.
const TAILLE_EPINGLE = 1;

// Vraie carte vectorielle : pan, zoom molette, double-clic, tactile — tout
// vient de MapLibre. Le prototype utilisait <MapFrame>, un cadre décoratif à
// tuiles fixes ; il montrait la mise en page validée, pas une carte
// utilisable. BRIEF.md prévoyait MapLibre pour la production, on y est.

// Le contour national vient de geoBoundaries quel que soit le fond : son
// attribution CC-BY doit rester affichée en permanence (data/limites/README.md).
const CREDIT_LIMITES = 'Limites : geoBoundaries (CC-BY 3.0)';

// Trois fonds sans clé API. Chacun porte sa propre attribution — ce ne sont
// pas les mêmes fournisseurs, un crédit générique serait faux.
//
// Aucun n'est auto-hébergé : les tuiles OSM relèvent de la politique d'usage
// de l'OSMF (usage navigationnel toléré, pas un service de production) et
// l'imagerie Esri de ses conditions de service. À basculer sur une source
// maîtrisée avant mise en ligne publique — voir BRIEF.md.
export const FONDS = [
  {
    id: 'carto', labelFr: 'Carto', labelEn: 'Carto', apercu: '#f4f4f6',
    url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
    credit: '© OpenStreetMap · © CARTO'
  },
  {
    id: 'osm', labelFr: 'OpenStreetMap', labelEn: 'OpenStreetMap', apercu: '#e9e5dc',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    credit: '© OpenStreetMap contributors'
  },
  {
    id: 'satellite', labelFr: 'Satellite', labelEn: 'Satellite', apercu: '#3c4a35',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    credit: 'Imagerie © Esri, Maxar, Earthstar Geographics'
  }
];

function styleFor(fondId) {
  const fond = FONDS.find(f => f.id === fondId) || FONDS[0];
  return {
    version: 8,
    sources: {
      base: {
        type: 'raster',
        tiles: [fond.url],
        tileSize: 256,
        maxzoom: 19,
        attribution: `${fond.credit} · ${CREDIT_LIMITES}`
      }
    },
    layers: [{ id: 'base', type: 'raster', source: 'base' }]
  };
}

/**
 * (Re)pose les images d'épingles dans le style courant.
 *
 * À appeler après chaque `setStyle()` : MapLibre vide le registre d'images
 * avec l'ancien style, et la couche 'epingles' se retrouve à référencer des
 * icônes absentes — d'où une carte sans aucun marqueur après changement de
 * fond. `vivant()` coupe court si la carte a été démontée pendant l'await.
 */
async function chargerEpingles(map, vivant) {
  for (const p of PROFILS) {
    const [normal, actif] = await Promise.all([
      svgToImage(buildPinSVG(p.hex, p.slug, false)),
      svgToImage(buildPinSVG(p.hex, p.slug, true))
    ]);
    if (!vivant()) return false;
    if (!map.hasImage('pin-' + p.slug)) map.addImage('pin-' + p.slug, normal, { pixelRatio: 2 });
    if (!map.hasImage('pin-' + p.slug + '-actif')) map.addImage('pin-' + p.slug + '-actif', actif, { pixelRatio: 2 });
  }
  return true;
}

export function MapView({
  points, villes, mode, focus, selectedId, onSelect, onSelectVille,
  fond, couches, registerApi, popupData, renderPopup, onClosePopup, padding
}) {
  const containerRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const [pret, setPret] = React.useState(false);
  const [styleTick, setStyleTick] = React.useState(0);
  const popupRef = React.useRef(null);
  const popupRootRef = React.useRef(null);
  const etiquettesRef = React.useRef(new Map());
  const syncRef = React.useRef(() => {});
  const cbs = React.useRef({ onSelect, onSelectVille, onClosePopup });
  cbs.current = { onSelect, onSelectVille, onClosePopup };

  // Lus par l'API impérative (registerApi) et les écouteurs posés une seule
  // fois : passer par des refs évite de re-souscrire à chaque rendu.
  const focusRef = React.useRef(focus);
  focusRef.current = focus;
  const paddingRef = React.useRef(padding);
  paddingRef.current = padding;

  /**
   * Marge caméra = marge de confort + zone masquée par l'UI (tiroir mobile).
   * `override` sert quand l'appelant sait déjà que l'UI va bouger — replier
   * le tiroir puis cadrer, par exemple : l'état React n'est pas encore à
   * jour au moment du cadrage, mais la hauteur visée, elle, est connue.
   */
  const margeCam = React.useCallback((base, override) => {
    const p = override || paddingRef.current || {};
    // Bornage indispensable : tiroir mobile grand ouvert, la marge basse
    // dépasserait la hauteur de la carte, et MapLibre refuse alors de bouger
    // la caméra (« Map cannot fit within canvas ») — le bouton paraîtrait
    // mort. On garde toujours au moins 20 % de carte utile par axe.
    const conteneur = mapRef.current && mapRef.current.getContainer();
    const maxY = conteneur ? Math.max(0, conteneur.clientHeight * 0.4 - base) : Infinity;
    const maxX = conteneur ? Math.max(0, conteneur.clientWidth * 0.4 - base) : Infinity;
    const borne = (v, max) => Math.max(0, Math.min(v || 0, max));
    return {
      top: base + borne(p.top, maxY), bottom: base + borne(p.bottom, maxY),
      left: base + borne(p.left, maxX), right: base + borne(p.right, maxX)
    };
  }, []);

  // --- Initialisation (une seule fois) ---
  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleFor(fond),
      bounds: CAMEROUN_BBOX,
      fitBoundsOptions: { padding: 48 },
      attributionControl: false,
      dragRotate: false
    });
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 110, unit: 'metric' }), 'bottom-left');
    mapRef.current = map;

    let annule = false;
    const vivant = () => !annule && !!mapRef.current;
    map.on('load', async () => {
      if (await chargerEpingles(map, vivant)) setPret(true);
    });
    // Les étiquettes de comptage suivent la caméra : leur position vient de
    // maplibregl.Marker, mais la composition des amas change avec le zoom,
    // donc on les recalcule pendant et après chaque mouvement.
    map.on('move', () => syncRef.current());
    map.on('idle', () => syncRef.current());

    return () => { annule = true; map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Changement de fond : setStyle vide couches ET images, il faut tout reposer ---
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !pret) return;
    let annule = false;
    const vivant = () => !annule && !!mapRef.current;
    map.setStyle(styleFor(fond), { diff: false });
    map.once('idle', async () => {
      if (await chargerEpingles(map, vivant)) setStyleTick(t => t + 1);
    });
    return () => { annule = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fond]);

  const geojsonPoints = React.useMemo(() => ({
    type: 'FeatureCollection',
    features: points.map(p => ({
      type: 'Feature',
      properties: { id: p.id, profil: p.profil, nom: p.nom },
      geometry: { type: 'Point', coordinates: [p.lon, p.lat] }
    }))
  }), [points]);

  const geojsonVilles = React.useMemo(() => ({
    type: 'FeatureCollection',
    features: villes.map(v => ({
      type: 'Feature',
      properties: { ville: v.ville, count: v.count },
      geometry: { type: 'Point', coordinates: [v.lon, v.lat] }
    }))
  }), [villes]);

  const iconExpr = React.useCallback(id => ['case',
    ['==', ['get', 'id'], id || ' '],
    ['concat', 'pin-', ['get', 'profil'], '-actif'],
    ['concat', 'pin-', ['get', 'profil']]
  ], []);

  // --- (Re)pose des sources et couches ---
  const applyLayers = React.useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const poser = (id, data, spec) => {
      const src = map.getSource(id);
      if (src) src.setData(data);
      else map.addSource(id, { type: 'geojson', data, ...spec });
    };

    poser('masque', buildMask(focus));
    poser('focus-contour', buildFocusOutline(focus));
    poser('frontiere', CAMEROUN);
    poser('villes', geojsonVilles);
    poser('points', geojsonPoints, { cluster: true, clusterMaxZoom: 9, clusterRadius: 46 });

    // Masque : éteint tout ce qui est hors de la zone en focus.
    if (!map.getLayer('masque-fill')) {
      map.addLayer({
        id: 'masque-fill', type: 'fill', source: 'masque',
        paint: { 'fill-color': '#14121f', 'fill-opacity': 0.42 }
      });
    }
    // Doublure claire sous le trait de frontière : l'indigo seul disparaît
    // sur l'imagerie satellite. Posée avant, donc dessous.
    if (!map.getLayer('frontiere-doublure')) {
      map.addLayer({
        id: 'frontiere-doublure', type: 'line', source: 'frontiere',
        paint: { 'line-color': '#ffffff', 'line-width': 3.8, 'line-opacity': 0.55 }
      });
    }
    if (!map.getLayer('frontiere-ligne')) {
      map.addLayer({
        id: 'frontiere-ligne', type: 'line', source: 'frontiere',
        paint: { 'line-color': '#46349e', 'line-width': 1.6, 'line-opacity': 0.85 }
      });
    }
    if (!map.getLayer('focus-ligne')) {
      map.addLayer({
        id: 'focus-ligne', type: 'line', source: 'focus-contour',
        paint: { 'line-color': '#46349e', 'line-width': 2.2, 'line-dasharray': [2, 1.4] }
      });
    }

    // Agrégats par ville (mode « Par ville »). Remplissage franc et non plus
    // un lavis à 24 % : il fallait un fond assez dense pour que le nombre
    // s'y lise en blanc aussi bien sur Carto clair que sur le satellite.
    if (!map.getLayer('villes-cercle')) {
      map.addLayer({
        id: 'villes-cercle', type: 'circle', source: 'villes',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['sqrt', ['get', 'count']], 1, 15, 11, 38],
          'circle-color': '#46349e', 'circle-opacity': 0.82,
          'circle-stroke-width': 2, 'circle-stroke-color': '#ffffff'
        }
      });
    }

    // Amas : 120 épingles sur Yaoundé, sinon illisible.
    if (!map.getLayer('amas')) {
      map.addLayer({
        id: 'amas', type: 'circle', source: 'points', filter: ['has', 'point_count'],
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['get', 'point_count'], 2, 19, 120, 38],
          'circle-color': '#46349e', 'circle-opacity': 0.92,
          'circle-stroke-width': 2, 'circle-stroke-color': '#ffffff'
        }
      });
    }
    if (!map.getLayer('epingles')) {
      map.addLayer({
        id: 'epingles', type: 'symbol', source: 'points', filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': iconExpr(selectedId),
          'icon-size': TAILLE_EPINGLE,
          'icon-anchor': 'bottom',
          'icon-allow-overlap': true
        }
      });
    }

    if (!map.__ogecHandlers) {
      map.__ogecHandlers = true;
      map.on('click', 'epingles', e => {
        const id = e.features && e.features[0] && e.features[0].properties.id;
        if (id) cbs.current.onSelect(id);
      });
      map.on('click', 'amas', e => {
        const f = e.features && e.features[0];
        if (!f) return;
        const src = map.getSource('points');
        // getClusterExpansionZoom() renvoie le zoom de désagrégation de CE
        // groupe, borné à clusterMaxZoom (9) — si on est déjà plus zoomé
        // que ça (cas d'un amas qui n'a pas fini de se désagréger), ne
        // jamais dézoomer : ça surprendrait plus qu'autre chose.
        Promise.resolve(src.getClusterExpansionZoom(f.properties.cluster_id))
          .then(z => map.easeTo({ center: f.geometry.coordinates, zoom: Math.max(z, map.getZoom() + 0.8) }));
      });
      map.on('click', 'villes-cercle', e => {
        const v = e.features && e.features[0] && e.features[0].properties.ville;
        if (v) cbs.current.onSelectVille(v);
      });
      for (const l of COUCHES_CLIQUABLES) {
        map.on('mouseenter', l, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', l, () => { map.getCanvas().style.cursor = ''; });
      }
      // Clic dans le vide (fond, masque, frontière) : referme la fiche/popup
      // en cours. Sans ça la sélection ne se dissipait qu'en cliquant une
      // autre entrée de la liste — d'où « popup impossible à fermer ».
      map.on('click', e => {
        const actives = COUCHES_CLIQUABLES.filter(l => map.getLayer(l));
        const touched = map.queryRenderedFeatures(e.point, { layers: actives });
        if (touched.length === 0) cbs.current.onSelect(null);
      });
    }
  }, [focus, geojsonPoints, geojsonVilles, selectedId, iconExpr]);

  // --- Étiquettes de comptage (amas et bulles de ville) ---
  // Rendues en marqueurs HTML et non en couche `symbol` : une couche texte
  // exigerait un serveur de glyphes, que le style raster n'a pas — soit une
  // dépendance réseau de plus pour afficher trois chiffres. En HTML, c'est
  // hors-ligne, stylable avec les jetons du design system, et transparent
  // aux clics (pointer-events: none) pour ne pas voler le clic au cercle.
  const syncEtiquettes = React.useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const vivantes = new Set();

    const poser = (cle, lngLat, texte, couleur) => {
      vivantes.add(cle);
      let mk = etiquettesRef.current.get(cle);
      if (!mk) {
        const el = document.createElement('div');
        el.className = 'ogec-count';
        mk = new maplibregl.Marker({ element: el }).setLngLat(lngLat).addTo(map);
        etiquettesRef.current.set(cle, mk);
      } else {
        mk.setLngLat(lngLat);
      }
      const el = mk.getElement();
      if (el.textContent !== texte) el.textContent = texte;
      el.style.color = couleur;
    };

    // Une couche masquée ne renvoie aucune entité : le mode courant et les
    // cases à cocher filtrent donc les étiquettes sans test supplémentaire.
    const presentes = id => (map.getLayer(id) ? map.queryRenderedFeatures({ layers: [id] }) : []);
    for (const f of presentes('amas')) {
      poser('amas-' + f.properties.cluster_id, f.geometry.coordinates,
        String(f.properties.point_count_abbreviated), '#ffffff');
    }
    for (const f of presentes('villes-cercle')) {
      poser('ville-' + f.properties.ville, f.geometry.coordinates,
        String(f.properties.count), '#ffffff');
    }

    for (const [cle, mk] of etiquettesRef.current) {
      if (!vivantes.has(cle)) { mk.remove(); etiquettesRef.current.delete(cle); }
    }
  }, []);
  syncRef.current = syncEtiquettes;

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !pret) return;
    const poserPuisEtiqueter = () => { applyLayers(); syncEtiquettes(); };
    if (map.isStyleLoaded()) poserPuisEtiqueter();
    else map.once('idle', poserPuisEtiqueter);
  }, [pret, styleTick, applyLayers, syncEtiquettes]);

  React.useEffect(() => {
    const etiquettes = etiquettesRef.current;
    return () => { for (const mk of etiquettes.values()) mk.remove(); etiquettes.clear(); };
  }, []);

  // --- Visibilité selon le mode et le panneau de couches ---
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !pret || !map.getLayer('epingles')) return;
    const vis = (id, on) => { if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none'); };
    const parVille = mode === 'villes';
    vis('epingles', !parVille && couches.membres);
    vis('amas', !parVille && couches.membres);
    vis('villes-cercle', parVille);
    vis('masque-fill', couches.masque);
    vis('frontiere-doublure', couches.frontiere);
    vis('frontiere-ligne', couches.frontiere);
    vis('focus-ligne', couches.frontiere && !!focus);
    syncEtiquettes();
  }, [pret, styleTick, mode, couches, focus, syncEtiquettes]);

  // --- Épingle sélectionnée ---
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !pret || !map.getLayer('epingles')) return;
    map.setLayoutProperty('epingles', 'icon-image', iconExpr(selectedId));
  }, [selectedId, pret, styleTick, iconExpr]);

  // --- Bulle d'info sur l'épingle sélectionnée ---
  // Rendue avec un vrai maplibregl.Popup (ancré au point, suit la carte au
  // pan/zoom) mais dont le contenu est du React monté via createRoot — le
  // Popup ne fournit qu'un point d'ancrage et une fermeture Échap/clic-dehors
  // en plus du bouton × que PopupCard dessine lui-même (onClosePopup).
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !pret) return;
    if (!popupData || popupData.lon == null || popupData.lat == null) {
      if (popupRef.current) { popupRef.current.remove(); popupRef.current = null; popupRootRef.current = null; }
      return;
    }
    if (!popupRef.current) {
      const container = document.createElement('div');
      const popup = new maplibregl.Popup({
        closeButton: false, closeOnClick: false, offset: 26, maxWidth: 'none', className: 'ogec-popup'
      }).setLngLat([popupData.lon, popupData.lat]).setDOMContent(container).addTo(map);
      popup.on('close', () => cbs.current.onClosePopup && cbs.current.onClosePopup());
      popupRootRef.current = createRoot(container);
      popupRef.current = popup;
    } else {
      popupRef.current.setLngLat([popupData.lon, popupData.lat]);
    }
    popupRootRef.current.render(renderPopup ? renderPopup(popupData) : null);

    // Ramener la bulle dans le cadre une fois le contenu React posé — la
    // mesure n'a de sens qu'après la mise en page. Voir lib/popup.js pour la
    // convention de signe.
    const rafId = requestAnimationFrame(() => {
      const popup = popupRef.current;
      const carte = mapRef.current;
      if (!popup || !carte) return;
      const el = popup.getElement();
      if (!el) return;
      const [dx, dy] = decalagePourCadrer(
        el.getBoundingClientRect(),
        carte.getContainer().getBoundingClientRect()
      );
      if (dx || dy) carte.panBy([dx, dy], { duration: 260 });
    });
    return () => cancelAnimationFrame(rafId);
  }, [popupData, pret, renderPopup]);

  React.useEffect(() => () => {
    if (popupRef.current) popupRef.current.remove();
  }, []);

  // --- API impérative pour les boutons du parent ---
  React.useEffect(() => {
    if (!registerApi) return;
    registerApi({
      // Appelée quand l'UI redimensionne le conteneur (poignée de la table
      // attributaire) : trackResize couvre déjà le cas, ceci le rend certain.
      resize: () => mapRef.current && mapRef.current.resize(),
      zoomIn: () => mapRef.current && mapRef.current.zoomIn(),
      zoomOut: () => mapRef.current && mapRef.current.zoomOut(),
      // Vue étendue = l'emprise de ce qui est réellement éclairé : la zone en
      // focus si un filtre de ville est actif, sinon le pays entier.
      fitAll: override => {
        const map = mapRef.current;
        if (!map) return;
        const f = focusRef.current;
        map.fitBounds(f ? focusBounds(f) : CAMEROUN_BBOX, { padding: margeCam(48, override), duration: 700 });
      },
      flyTo: (lon, lat, zoom) => mapRef.current && mapRef.current.flyTo({
        center: [lon, lat], zoom: zoom || 12, duration: 900, padding: margeCam(0)
      })
    });
  }, [registerApi, margeCam]);

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />;
}
