# Limites administratives

## `cameroun-adm0.json`

Contour national du Cameroun (ADM0), version **simplifiée** — 1 208 sommets, 52 Ko.

- **Source :** [geoBoundaries](https://www.geoboundaries.org/) `gbOpen/CMR/ADM0`, build du 12 décembre 2023 (données Wikimedia, 2016).
- **Licence :** Creative Commons Attribution 3.0 (CC-BY 3.0) — **l'attribution doit rester affichée**. Elle l'est dans l'attribution de la carte (`components/MapView.jsx`).
- **Téléchargé le :** 17 août 2026, depuis le commit figé `9469f09` du dépôt geoBoundaries (pas la branche mobile, pour que le fichier reste reproductible).

Renommé en `.json` (et non `.geojson`) parce que Node et le bundler ne résolvent l'import que sur cette extension. Le contenu est du GeoJSON standard.

Sert à deux choses dans l'app :
1. tracer la frontière nationale ;
2. creuser le trou du masque qui éteint tout ce qui est hors zone (voir `lib/mask.js`).
