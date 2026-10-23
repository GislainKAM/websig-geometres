# Design — websig-geometres

## `prototype-2026-08-17/`

Prototype haute fidélité de la maquette **dédiée à ce projet** (« Annuaire OGEC »), livré par Gislain le 17 août 2026. Export HTML statique interactif (`.dc.html`, format Claude Design), avec le bundle du design system websig (`_ds/`) qui l'accompagne.

**Ceci répond au point « Design » du [BRIEF.md §1](../BRIEF.md).** À distinguer explicitement du kit `ui_kits/webmap-annuaire` cité dans le brief : celui-ci était un **gabarit générique** à données factices, donné à titre illustratif — pas une maquette validée. Le prototype ici est spécifique à `websig-geometres` (titre « Annuaire des géomètres — Ordre National des Géomètres du Cameroun », compteur 241 résultats, filtres Chercher/Par ville/Vérifier/Analyser) et sert de référence pour l'implémentation.

Contenu :
- `Annuaire OGEC.dc.html` — vue desktop.
- `Annuaire OGEC - Mobile et tablette.dc.html` — vues mobile et tablette.
- `thumbnail.webp` — aperçu (desktop + mobile côte à côte).
- `_ds/websig-design-system-.../` — copie du design system consommé par le prototype (tokens, composants, guidelines). Référence de lecture ; **le code de l'app consomme `@websig/design` depuis `websig-platform` en local**, pas cette copie figée.

### Ouvrir le prototype

Fichiers HTML autonomes (JS/CSS inclus) — ouvrir directement dans un navigateur, ou servir le dossier :

```bash
python -m http.server 8934 --directory design/prototype-2026-08-17
```

Puis ouvrir `http://localhost:8934/Annuaire%20OGEC.dc.html`.

### Écarts connus avec `@websig/design` (websig-platform)

Le design system copié dans `_ds/` (readme du 17 août) prescrit Montserrat/Poppins pour la typographie. Le package `@websig/design` réellement codé dans `websig-platform` (`apps/site/app/layout.js`) utilise Space Grotesk/Inter à la place — décision prise après coup, jugée « moins générique ». À vérifier lequel fait foi avant d'implémenter l'app géomètres ; ne pas supposer que `_ds/` est à jour par rapport au package réel.

## Refonte du 23 octobre 2026

Livrée par Gislain sous la forme de `Carte OGEC géomètres.zip` : prototype `Carte OGEC.dc.html` (mobile, tablette, desktop), son compte rendu `Revue OGEC.dc.html` (décisions UX, hypothèses à valider) et le « OGEC Design System » (`_ds/`). **C'est la référence de l'implémentation actuelle** ; le prototype d'août ci-dessus est périmé.

L'implémentation s'écarte du prototype là où il promettait ce que l'app statique ne fait pas — voir BRIEF.md §1 (ligne « Design (refonte du 23 octobre 2026) »). Les fichiers du zip ne sont pas archivés dans le dépôt à la date de cette note.
