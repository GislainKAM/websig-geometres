# websig-geometres

Annuaire cartographié des membres de l'Ordre National des Géomètres du
Cameroun — un projet **webmap** de la plateforme [websig.app](https://websig.app).

Ce n'est pas une carte thématique ordinaire, c'est un **annuaire
géolocalisé** : le point porté sur la carte est le chef-lieu déclaré au
tableau, pas l'adresse exacte du cabinet (que la source ne donne pas).

**État : en production sur geometres.websig.app ; bascule vers [ogec.cm/annuaire](https://ogec.cm/annuaire) décidée le 23 octobre 2026 (les URL du code pointent déjà dessus ; la racine ogec.cm renvoie à /annuaire).** Côté infra, à faire : DNS et proxy pour ogec.cm (tout le trafic vers le conteneur, y compris `/` qui redirige), redirection 301 de geometres.websig.app vers ogec.cm/annuaire, et décision sur `www.ogec.cm` (rediriger vers l'apex ou garder le site actuel de l'Ordre). Tant que le domaine ne sert pas l'app, canonical, sitemap et aperçu de partage pointent vers une adresse qui ne répond pas encore.

## Ce que ça fait

Un outil public : **trouver et vérifier un géomètre inscrit au tableau**,
sans culture cartographique. Refonte du 23 octobre 2026 d'après le
prototype de design OGEC (voir `design/` et BRIEF.md) — l'ancien
répertoire SIG à quatre onglets (Chercher / Par ville / Vérifier / Analyser,
table attributaire, couches, EPSG) est remplacé par un seul geste de
recherche.

- **Une barre de recherche** qui comprend un quartier (« Akwa »), une ville,
  une région, un numéro d'inscription (« A055 ») ou un nom ; un numéro exact
  ouvre directement la fiche.
- **Autour de moi** — géolocalisation du navigateur, liste triée par
  distance au centre de la ville (jamais à l'adresse : la source n'en donne
  pas). La position n'est ni envoyée ni conservée.
- **Résultats** groupés par série de matricule, puces de catégorie,
  filtres avec compte annoncé avant validation (région, ville, distance,
  types, experts honoraires).
- **Fiche** : statut, numéro, contact (liens `tel:` et `mailto:`),
  partage par lien (`#s=detail&id=A055`), signalement.
- **Signaler un problème / mettre à jour ma fiche** : parcours en trois
  étapes qui prépare un message que l'utilisateur envoie lui-même (lien
  `mailto:`, ou copie du message). Aucun envoi côté serveur — voir
  `lib/config.js`.
- Aide et questions fréquentes, « comment lire la carte », À propos et
  sources (fraîcheur dérivée de la source), présentation du premier passage.
- Hors connexion : la liste déjà chargée reste consultable, le fond de carte
  tombe sur la trame millimétrée du système de design.

Carte MapLibre GL réelle (panoramique, zoom, tactile) : fond OpenStreetMap (OpenFreeMap « Liberty ») allégé aux routes et aux noms de villes et quartiers, masque qui éteint tout ce qui est hors de la ville ciblée (ou du Cameroun), un symbole par
catégorie — la **forme** porte l'information (carré plein, carré vide,
losange, rond) —, regroupements en carrés d'encre avec le nom de la ville
au-dessus de 8 de zoom, amas de symboles ensuite.

Bilingue FR/EN, responsive : tiroir glissable à trois hauteurs en mobile
(< 768 px), panneau latéral en desktop.

## Architecture

```
app/
  page.js            composant serveur — charge les données au build, rien côté client
  layout.js          polices (next/font/local, voir app/fonts/README.md), métadonnées
  tokens.css         jetons du système de design OGEC (vendorisés)
  globals.css        coque, composants et écrans — classes, pas de styles en ligne
components/
  AnnuaireApp.jsx    composant client principal — état, navigation entre écrans, tiroir mobile
  MapView.jsx        wrapper MapLibre GL — fond OSM allégé, masque, regroupements, symboles, repères
  Bits.jsx           symbole de catégorie, avatar, vignette aérienne
  views/             un fichier par écran : Onboarding, Home, Places, Results, Detail,
                     Filters, Legend, Report, Help, About, Menu
  ui/                composants OGEC vendorisés : Button, Badge, Input/Select/Textarea,
                     Switch/Radio/Checkbox, Toast, Icon
lib/
  geometres.js       lecture des données, profils, téléphones, agrégats par ville
  villes.js          ville/région/coordonnées à partir du champ adresse brut
  quartiers.js       quartiers reconnus par la recherche
  recherche.js       filtrage et interprétation de la saisie (fonctions pures)
  geo.js             distance, initiales, projection des vignettes
  cameroun.js        contour national et emprise
  markers.js         symboles de carte en SVG
  i18n.js, dico.js   textes FR/EN, catégories, FAQ
  config.js          adresse de réception des signalements (à renseigner)
  format.js          formatage de nombre
public/brand/        logo OGEC (verrouillage, sigle, blanc)
data/
  ocr-draft/         transcription du Tableau OGEC 2026 — voir son propre README
  limites/           contour national (geoBoundaries, CC-BY 3.0)
scripts/
  build-ocr-draft.py export ponctuel de la transcription (pas destiné à être ré-exécuté)
```

**Pas de backend, pas de base de données.** Les données du tableau OGEC
sont bundlées au build (`data/ocr-draft/tableau-ogec-2026.json`, import
statique dans `lib/geometres.js`) — une page entièrement statique, générée
une fois par `next build`.

**Design system vendorisé, pas consommé en dépendance.** `components/ui/`
et `app/tokens.css` portent une copie du « OGEC Design System » (export du
23 octobre 2026 : six couleurs, Space Grotesk + IBM Plex Mono, rayon 0/2 px,
filet 1 px, aucune ombre, cible tactile 44 px). Chaque projet de l'infra a
son propre dépôt ; une dépendance `file:` vers un autre dépôt marche en
local mais casse dans n'importe quel contexte CI/Docker. Contrepartie
assumée : une évolution du design system ne se propage pas ici toute seule.
Le bleu de remplissage des boutons est `--bleu-fonce` (4,7:1 sous du texte
blanc), `--bleu` n'atteignant que 3:1 et restant réservé aux symboles.

## Données

Le Tableau OGEC 2026 (`HPSC0177.pdf`, scan transmis par l'Ordre), transcrit
à la main en 243 entrées réparties en 4 catégories. Statut détaillé,
méthode de relecture et ce qui reste ouvert : voir
[`data/ocr-draft/README.md`](data/ocr-draft/README.md).

Le contour national du Cameroun (tracé de frontière, cadrage de la vue nationale, masque)
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

Adresse cible : `ogec.cm/annuaire` (voir l'état ci-dessus).

## Contexte et décisions

[BRIEF.md](BRIEF.md) — origine du projet, exigences liées au caractère
officiel des données, décisions en attente.
