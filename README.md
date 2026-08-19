# websig-geometres

Annuaire cartographié des membres de l'Ordre National des Géomètres du
Cameroun — un projet **webmap** de la plateforme [websig.app](https://websig.app).

Ce n'est pas une carte thématique ordinaire, c'est un **annuaire
géolocalisé** : le point porté sur la carte est le chef-lieu déclaré au
tableau, pas l'adresse exacte du cabinet (que la source ne donne pas).

**État : application fonctionnelle, pas encore déployée.** Voir
[Déploiement](#déploiement) plus bas.

## Ce que ça fait

Quatre modes, sélectionnés par onglet :

- **Chercher** — liste filtrable (nom, ville, n° d'agrément), recherche
  texte, filtres par catégorie retirables un à un.
- **Par ville** — bulles proportionnelles au nombre de membres, groupées
  par pays.
- **Vérifier** — recherche par numéro d'agrément ou nom, pour confirmer
  qu'une personne figure au tableau.
- **Analyser** — filtres combinés (catégorie, ville, série de matricule)
  et table attributaire redimensionnable.

Une carte MapLibre GL réelle (panoramique, zoom, tactile) sous-tend les
quatre modes : masque qui assombrit tout ce qui est hors de la zone
filtrée, contour national, trois fonds (OpenStreetMap par défaut, Carto,
satellite Esri), amas d'épingles avec comptage au-delà d'un certain
nombre de points groupés.

Bilingue FR/EN, responsive (tiroir glissable en mobile, panneau latéral
en desktop).

## Architecture

```
app/
  page.js          composant serveur — charge les données au build, rien côté client
  layout.js         polices (next/font/local, voir app/fonts/README.md), tokens CSS
components/
  AnnuaireApp.jsx    composant client principal — état, filtres, quatre modes, tiroir mobile
  MapView.jsx        wrapper MapLibre GL — sources, couches, masque, popups, fonds
  MapControls.jsx    zoom / couches / fond, boutons flottants sur la carte
  DetailCard.jsx     fiche membre (panneau latéral et bulle carte)
  Avatar.jsx         portrait par catégorie — silhouette, prêt à recevoir une vraie photo
  SimpleSelect.jsx   <select> stylé — le design system n'en fournit pas
  ui/                sous-ensemble vendorisé de @websig/design (voir plus bas)
lib/
  geometres.js       lecture des données, agrégats par ville, métadonnées de source
  villes.js          résolution ville → coordonnées à partir du champ adresse brut
  mask.js            géométrie du masque et de la zone en focus
  markers.js         épingles SVG par catégorie
  popup.js           recadrage de la bulle carte quand elle déborde du cadre
  i18n.js             libellés FR/EN
  format.js           formatage de nombre
data/
  ocr-draft/          transcription du Tableau OGEC 2026 — voir son propre README
  limites/            contour national (geoBoundaries, CC-BY 3.0)
scripts/
  build-ocr-draft.py  export ponctuel de la transcription (pas destiné à être ré-exécuté)
```

**Pas de backend, pas de base de données.** Les données du tableau OGEC
sont bundlées au build (`data/ocr-draft/tableau-ogec-2026.json`, import
statique dans `lib/geometres.js`) — une page entièrement statique, générée
une fois par `next build`.

**Design system vendorisé, pas consommé en dépendance.** `components/ui/`
porte une copie des composants React et des jetons CSS réellement utilisés
depuis `@websig/design` (websig-platform) — treize composants sur la
vingtaine que porte le design system source. Chaque projet de l'infra a
son propre dépôt ; une dépendance `file:` vers un autre dépôt marche en
local mais casse dans n'importe quel contexte CI/Docker qui n'a pas
exactement la même disposition de dossiers. Contrepartie assumée : une
évolution du design system ne se propage plus ici automatiquement — voir
la note de provenance dans `components/ui/index.js`.

## Données

Le Tableau OGEC 2026 (`HPSC0177.pdf`, scan transmis par l'Ordre), transcrit
à la main en 242 entrées réparties en 4 catégories. Statut détaillé,
méthode de relecture et ce qui reste ouvert : voir
[`data/ocr-draft/README.md`](data/ocr-draft/README.md).

Le contour national du Cameroun (masque de la carte, tracé de frontière)
vient de geoBoundaries, CC-BY 3.0 — voir
[`data/limites/README.md`](data/limites/README.md).

## Développement

Dépôt autonome — plus de dépendance externe depuis le retrait de la
dépendance `file:` vers `websig-platform`.

```bash
npm install
npm run dev
```

```bash
npm run build   # sortie standalone (next.config.mjs), pour le conteneur Docker
npm run start   # sert la sortie de build
```

## Déploiement

Dockerfile et CI (`.github/workflows/publish-image.yml`) en place,
vérifiés par un vrai `docker build` — voir les messages de commit pour le
détail. **Pas encore réellement déployé** : la partie serveur (compte de
déploiement, Proxy Host Nginx, authentification GHCR, secrets GitHub) est
documentée pas à pas dans
[`websig-docs/infra/geometres/README.md`](https://github.com/GislainKAM/websig-docs/blob/add/infra-geometres/infra/geometres/README.md)
(branche `add/infra-geometres`, pas encore fusionnée), à exécuter
manuellement sur le serveur.

Sous-domaine prévu : `geometres.websig.app`.

## Contexte et décisions

[BRIEF.md](BRIEF.md) — origine du projet, exigences liées au caractère
officiel des données, décisions en attente.
