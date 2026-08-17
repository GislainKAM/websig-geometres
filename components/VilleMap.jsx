'use client';
import React from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Style vectoriel gratuit, sans clé API — OpenFreeMap (PMTiles-backed, CDN
// public). À remplacer par une source auto-hébergée en production, voir
// BRIEF.md (« PMTiles statiques par défaut »).
const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

const CAMEROUN_CENTER = [12.5, 5.5];
const CAMEROUN_ZOOM = 5.4;

// Rayon proportionnel (racine carrée : l'aire du cercle, pas son rayon,
// représente l'effectif) borné pour rester lisible du plus petit au plus
// grand centre.
function radiusFor(count, maxCount) {
  const min = 6, max = 26;
  const t = Math.sqrt(count) / Math.sqrt(Math.max(maxCount, 1));
  return Math.round(min + t * (max - min));
}

export function VilleMap({ villes, selectedVille, onSelectVille }) {
  const containerRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: CAMEROUN_CENTER,
      zoom: CAMEROUN_ZOOM,
      attributionControl: { compact: true }
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.on('load', () => setReady(true));
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const maxCount = React.useMemo(() => villes.reduce((m, v) => Math.max(m, v.count), 1), [villes]);

  const geojson = React.useMemo(() => ({
    type: 'FeatureCollection',
    features: villes.map(v => ({
      type: 'Feature',
      properties: { ville: v.ville, pays: v.pays, count: v.count, radius: radiusFor(v.count, maxCount) },
      geometry: { type: 'Point', coordinates: [v.lon, v.lat] }
    }))
  }), [villes, maxCount]);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    const applySource = () => {
      if (map.getSource('villes')) {
        map.getSource('villes').setData(geojson);
        return;
      }
      map.addSource('villes', { type: 'geojson', data: geojson });
      map.addLayer({
        id: 'villes-cercles',
        type: 'circle',
        source: 'villes',
        paint: {
          'circle-radius': ['get', 'radius'],
          // Peinture canvas MapLibre : pas de var() CSS, valeur littérale du
          // token --brand-indigo-600 (packages/design/tokens/colors.css).
          'circle-color': '#46349e',
          'circle-opacity': 0.78,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
      map.addLayer({
        id: 'villes-labels',
        type: 'symbol',
        source: 'villes',
        layout: {
          'text-field': ['concat', ['get', 'ville'], '  ·  ', ['get', 'count']],
          'text-size': 12,
          'text-offset': [0, 1.6],
          'text-anchor': 'top',
          'text-font': ['Noto Sans Regular']
        },
        paint: {
          'text-color': '#14121f',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.4
        }
      });
      map.on('click', 'villes-cercles', e => {
        const ville = e.features?.[0]?.properties?.ville;
        if (ville) onSelectVille(ville);
      });
      map.on('mouseenter', 'villes-cercles', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'villes-cercles', () => { map.getCanvas().style.cursor = ''; });
    };

    if (map.isStyleLoaded()) applySource();
    else map.once('idle', applySource);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, geojson]);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !map.getLayer('villes-cercles')) return;
    map.setPaintProperty('villes-cercles', 'circle-stroke-color', [
      'case', ['==', ['get', 'ville'], selectedVille || ''], '#46349e', '#ffffff'
    ]);
    map.setPaintProperty('villes-cercles', 'circle-stroke-width', [
      'case', ['==', ['get', 'ville'], selectedVille || ''], 3, 2
    ]);
  }, [selectedVille, ready]);

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />;
}
