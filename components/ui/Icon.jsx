import React from 'react';

// Icônes de trait (grille 24, trait 1,5), tracées d'après Lucide — le style
// linéaire le plus proche du sigle. Une icône n'est admise que lorsqu'elle
// remplace un mot faute de place (recherche, fermeture, retour, filtre) :
// voir le readme du système de design OGEC, § Iconography. Pas de dépendance
// à un CDN : les tracés sont ici.
const IC = {
  search: [['circle', { cx: 11, cy: 11, r: 8 }], ['path', { d: 'm21 21-4.3-4.3' }]],
  locate: [['path', { d: 'M2 12h3M19 12h3M12 2v3M12 19v3' }], ['circle', { cx: 12, cy: 12, r: 7 }], ['circle', { cx: 12, cy: 12, r: 3 }]],
  plus: [['path', { d: 'M5 12h14M12 5v14' }]],
  minus: [['path', { d: 'M5 12h14' }]],
  globe: [['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20' }]],
  help: [['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01' }]],
  menu: [['path', { d: 'M4 6h16M4 12h16M4 18h16' }]],
  info: [['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'M12 16v-4M12 8h.01' }]],
  flag: [['path', { d: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7' }]],
  user: [['circle', { cx: 12, cy: 8, r: 4 }], ['path', { d: 'M4 21a8 8 0 0 1 16 0' }]],
  chevR: [['path', { d: 'm9 18 6-6-6-6' }]],
  chevD: [['path', { d: 'm6 9 6 6 6-6' }]],
  chevU: [['path', { d: 'm18 15-6-6-6 6' }]],
  sliders: [['path', { d: 'M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4' }]],
  phone: [['path', { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z' }]],
  mail: [['rect', { x: 2, y: 4, width: 20, height: 16, rx: 2 }], ['path', { d: 'm22 7-10 6L2 7' }]],
  share: [['circle', { cx: 18, cy: 5, r: 3 }], ['circle', { cx: 6, cy: 12, r: 3 }], ['circle', { cx: 18, cy: 19, r: 3 }], ['path', { d: 'm8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98' }]],
  wifiOff: [['path', { d: 'M12 20h.01M8.5 16.43a5 5 0 0 1 7 0M2 8.82a15 15 0 0 1 4.17-2.65M10.66 5c4.01-.36 8.14.9 11.34 3.76M16.85 11.25a10 10 0 0 1 2.22 1.68M5 12.86a10 10 0 0 1 5.17-2.69M2 2l20 20' }]],
  pin: [['path', { d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0' }], ['circle', { cx: 12, cy: 10, r: 3 }]],
  check: [['path', { d: 'M20 6 9 17l-5-5' }]],
  list: [['path', { d: 'M3 6h.01M3 12h.01M3 18h.01M8 6h13M8 12h13M8 18h13' }]],
  book: [['path', { d: 'M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z' }]],
  replay: [['path', { d: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5' }]],
  file: [['path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8' }]],
  copy: [['rect', { x: 9, y: 9, width: 13, height: 13, rx: 2 }], ['path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }]],
  hand: [['path', { d: 'M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8' }], ['path', { d: 'M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15' }]]
};

export function Icon({ name, size = 20, color }) {
  const els = IC[name];
  if (!els) return null;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'}
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ flex: 'none', display: 'block' }}
    >
      {els.map(([tag, props], i) => React.createElement(tag, { key: i, ...props }))}
    </svg>
  );
}
