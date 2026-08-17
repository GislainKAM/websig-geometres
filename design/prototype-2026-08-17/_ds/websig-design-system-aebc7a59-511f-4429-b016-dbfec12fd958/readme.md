# websig — Design System

Système de design par défaut du répertoire de projets **websig** : le site vitrine qui liste les projets de cartographie web, et le gabarit commun de toutes les **webmaps rapides** publiées en sous-domaine.

## Contexte produit

websig est un répertoire personnel de projets SIG web, hébergés sur un même serveur, chacun sur son sous-domaine. Deux familles de projets :

| Famille | Identité visuelle | Rôle |
| --- | --- | --- |
| **WebSIG** | Chaque application porte **sa propre** identité (logo, couleurs) | Applications complètes : cadastre, hydrologie, orthophoto |
| **Webmap** | Suit **ce système par défaut**, sans exception | Cartes rapides publiées pour illustrer une étude ou un annuaire (ex. membres de l'Ordre des géomètres du Cameroun) |

Le site répertoire lui-même suit également ce système.

**Sources fournies :** un unique fichier logo (`logo.svg`, réticule indigo) et une référence de style citée par l'utilisateur : https://plateforme-urbaine.cm/ma-carte. Aucun dépôt de code, aucun fichier Figma, aucune police propriétaire n'ont été fournis — tout le reste du système est dérivé du logo et du contexte métier. Langue : **bilingue FR/EN**, registre **institutionnel**. Technos carto ciblées : **MapLibre/Mapbox GL** et **OpenLayers**.

---

## CONTENT FUNDAMENTALS

**Registre : institutionnel mais direct.** Le site est un répertoire professionnel, pas une agence. On décrit ce qui a été fait, avec des chiffres, sans superlatifs.

- **Personne :** le tutoiement n'apparaît jamais côté public. On écrit à la troisième personne pour décrire les projets (« Le projet couvre… ») et à la première personne du singulier pour l'auteur (« Me contacter », « mes projets »). Jamais de « nous » — c'est un portfolio individuel.
- **Casse :** phrase capitale uniquement. Les titres ne prennent **pas** de majuscule à chaque mot : « Applications WebSIG et cartes rapides », pas « Applications WebSIG Et Cartes Rapides ». Seuls les surtitres (`.ws-eyebrow`) sont en majuscules, 11px, tracking 0.08em : « RÉPERTOIRE DE PROJETS · CAMEROUN ».
- **Longueur :** un titre = une idée, 8 mots maximum. Un résumé de projet = une à deux phrases, jamais plus de 160 caractères.
- **Chiffres :** toujours en mono, espace insécable comme séparateur de milliers, virgule décimale française : `1 284 parcelles`, `42,7 km²`. Les unités sont écrites, jamais abrégées en jargon.
- **Vocabulaire technique :** assumé, jamais expliqué à outrance. « EPSG:32632 », « GeoJSON », « isochrone », « emprise » sont utilisés tels quels — le public visé est professionnel.
- **Émojis : jamais.** Aucun, nulle part. Les statuts passent par des `Badge` colorés à pastille.
- **Bilingue :** chaque surface porte la bascule FR/EN dans l'en-tête. Le français est la langue de référence ; l'anglais est une traduction, pas une réécriture.
- **Boutons :** verbe à l'infinitif, court. « Explorer les projets », « Ouvrir l'application », « Télécharger », « Réinitialiser ». Jamais « Cliquez ici », jamais de point final.
- **États vides :** constat + issue. « Aucun projet ne correspond. Élargis les filtres ou change de région. » — c'est le seul endroit où l'impératif de la 2e personne est toléré, dans l'interface d'outil.

Exemples réels du kit :
- Hero : « Applications WebSIG et cartes rapides, hébergées au même endroit. »
- Sous-titre : « Chaque projet vit sur son propre sous-domaine. Les WebSIG portent leur identité ; les webmaps suivent ce système par défaut. »
- Résumé projet : « Annuaire cartographié des géomètres agréés du Cameroun, filtrable par région et par année d'agrément. »

---

## VISUAL FOUNDATIONS

### Le logo comme grammaire
Le logo est un **réticule** : un cadre carré à coins arrondis (r=14/100), quatre repères aux milieux des côtés, un point de position décentré en haut à droite. Tout le système en découle :
- **Le cadre** → les cartes (`--radius-lg: 14px`, bordure 1px, jamais d'ombre lourde) et les viewports carte.
- **Les repères** → les tirets de la barre d'échelle, les indicateurs 2px sous les onglets, le rail 3px à gauche des lignes sélectionnées.
- **Le point** → les badges à pastille, les entités ponctuelles sur carte, le point de focus.

### Couleur
- **Indigo #46349e** (`--brand-indigo-600`), extrait du logo, est la seule couleur de marque. Elle sert aux actions primaires, aux états actifs et aux entités ponctuelles. Elle n'est **jamais** utilisée en aplat de fond sur de grandes surfaces, sauf l'en-tête d'un WebSIG dédié et la vignette de marque.
- **Neutres teintés** : les gris ne sont pas neutres, ils tirent vers l'indigo (`--ink-900: #14121f`). Aucun gris pur (#888) n'existe dans le système.
- **Couleurs thématiques** cartographiques, une par nature de donnée, jamais réattribuées : hydro (#0e7c86), terrain (#46753c), relief (#b5772a), alerte (#b3261e). Elles ne servent **pas** de couleurs décoratives : une couleur thématique dans l'interface signifie toujours qu'elle correspond à une couche ou un statut.
- **Sémantique des couches** : `--layer-point` (indigo), `--layer-line` (hydro), `--layer-polygon` (terrain), `--layer-raster` (relief), `--layer-selected` (alerte). La pastille dans le panneau de couches, le swatch de légende et le style sur la carte utilisent **le même token**.
- **Mode sombre** : disponible via `[data-theme="dark"]`, utilisé surtout pour les webmaps immersives et les en-têtes `inverse`.

### Typographie
- **Titres — Montserrat**, semibold 600 / bold 700, `letter-spacing: -0.015em`, interlignage 1.1–1.28. Grotesque géométrique : cercles vrais, terminaisons droites, aucune courbe calligraphique. Il porte le registre institutionnel et n'apparaît **que** dans les titres, les chiffres de `StatBlock`, le mot-symbole et les titres de popup.
- **Texte — Poppins**, 16px/1.6, largeur de lecture plafonnée à 68ch. Même logique géométrique que Montserrat, un cran plus ouvert en minuscules.
- **Données — IBM Plex Mono**, `font-variant-numeric: tabular-nums`. Obligatoire pour : coordonnées, EPSG, matricules, surfaces, dates, versions, compteurs. Une colonne de nombres non-mono est un bug.
- **Surtitres** : 11px, semibold, majuscules, tracking 0.08em, ink-500.
- ⚠️ Les trois familles viennent de **Google Fonts** (Montserrat, Poppins, IBM Plex Mono — choix géométrique demandé par l'auteur) (import CSS) — aucun fichier de police n'a été fourni. Si une police propriétaire existe, envoie les fichiers, je remplace les `@import` par des `@font-face` locaux.

### Espacement et mise en page
Échelle base 4px (4·8·12·16·24·32·48·64·80·96). Largeur de page 1200px, gouttière 24px, en-tête fixe 64px, panneau latéral 320px. L'en-tête est `sticky` sur le site répertoire ; sur une webmap la page ne défile pas du tout — carte et table se partagent la hauteur de viewport.

### Coins, bordures, ombres
- Rayons : 4px champs, 8px boutons, **14px cartes et viewports**, 20px grands panneaux, pilule pour badges et tags.
- Bordures : 1px `--border-subtle` au repos, 2px seulement pour les indicateurs d'état (onglet actif, rail de sélection).
- **Ombres discrètes.** Une carte au repos porte `--shadow-xs` (quasi invisible) ; l'ombre n'arrive qu'au survol (`--shadow-md`) ou en modale (`--shadow-lg`). Le seul endroit où l'ombre est franche est le chrome flottant sur carte (`--shadow-chrome`), parce qu'il doit se détacher d'une image.
- Pas de bordure colorée à gauche décorative : le rail 3px de `Card accent` n'existe que pour signaler un **type de couche** ou un statut.

### Transparence et flou
Réservés au chrome cartographique : `--surface-map-chrome` (blanc à 92 %) + `backdrop-filter: saturate(140%) blur(10px)`. Le flou ne s'utilise **jamais** hors d'une carte, sauf le voile de modale (2px). Les dégradés de protection (`--protect-top`, `--protect-bottom`) servent uniquement à poser du texte blanc sur une image ou une carte.

### Imagerie
Pas d'illustration, pas de photo décorative, pas de dessin. **L'image du système, c'est la carte elle-même** : tuiles OpenStreetMap réelles servies par CARTO (`basemaps.cartocdn.com`), désaturées (`saturate(.55)`) pour que l'interface reste lisible par-dessus. Trois fonds : `osm` (Voyager, légèrement désaturé), `light` (Positron, gris clair — le fond par défaut sous du chrome), `dark` (Dark Matter). Registre chromatique : froid, sourd, jamais chaud ni granuleux. L'attribution « © OpenStreetMap · © CARTO » est rendue automatiquement et ne se retire jamais.

### Animation
Sobre et courte. 140ms pour les micro-états (survol, focus), 220ms pour les panneaux et cartes, 600ms pour un recentrage de carte. Courbe par défaut `cubic-bezier(.16,1,.3,1)` — sortie rapide, arrivée douce. **Aucun rebond, aucun ressort, aucune animation d'entrée décorative.** `prefers-reduced-motion` ramène toutes les durées à 0.

### États d'interaction
- **Survol** : le fond fonce d'un cran pour les surfaces pleines (indigo 600 → 700), s'éclaircit d'un cran pour les surfaces claires (blanc → ink-50). Jamais d'opacité.
- **Pression** : `translateY(1px)`, pas de changement de taille ni d'ombre.
- **Focus** : contour 2px indigo 500 avec 2px d'offset, plus `--focus-ring` (halo 3px indigo 200) sur les champs.
- **Actif/sélectionné** : fond `--surface-brand-soft` + indicateur indigo 2px (onglet) ou rail 3px (ligne de liste).
- **Désactivé** : opacité 0.45, `pointer-events: none`. Jamais de gris différent.

---

## ICONOGRAPHY

- **Lucide** est le seul système d'icônes. ⚠️ **Substitution assumée** : aucune icône n'a été fournie avec le logo. Lucide a été retenu pour son trait fin (1.75px), sa grille 24px et sa géométrie sobre, cohérente avec le trait du réticule. Si tu disposes d'un jeu d'icônes maison, envoie-le et je remplace la source.
- **Chargement** : par icône depuis le CDN `unpkg.com/lucide-static@0.460.0`, injectée en **SVG inline** avec `stroke="currentColor"` — l'icône hérite donc toujours de la couleur du texte, et survit aux exports PNG/PDF/PPTX (un masque CSS, lui, se serait aplati en carré plein). Aucun fichier SVG n'est copié dans le projet, aucune icône n'est redessinée à la main.
- **Tailles** : 14px dans les tags et libellés, 15–16px dans les boutons, 18px par défaut, 21px dans les états vides. Jamais au-delà de 24px.
- **Vocabulaire courant** : `map`, `map-pin`, `layers`, `globe`, `compass`, `ruler`, `locate-fixed`, `download`, `filter`, `search`, `share-2`, `external-link`, `maximize-2`, `info`, `chevron-down`, `arrow-right`, `x`.
- **Émoji : jamais.** Aucun caractère Unicode utilisé comme icône, hormis le `×` de fermeture des tags et le `°`/`′`/`″` des coordonnées, qui sont de la typographie, pas de l'iconographie.
- **Logo** : `assets/logo-mark.svg` (indigo), `-white`, `-ink`, plus les verrouillages `logo-lockup.svg` et `-white`. Le composant `Logo` reproduit le tracé en React pour pouvoir le colorer. **Ne jamais redessiner, déformer, faire pivoter ni recolorer le réticule hors des trois couleurs autorisées.**

---

## Index du dépôt

| Chemin | Contenu |
| --- | --- |
| `styles.css` | Point d'entrée unique — uniquement des `@import` |
| `tokens/` | `colors.css`, `typography.css`, `spacing.css`, `elevation.css`, `motion.css`, `base.css` |
| `assets/` | Logo : marque (indigo / blanc / encre) et verrouillages horizontaux |
| `guidelines/` | 16 cartes de spécimen (couleurs, type, espacement, marque, iconographie) |
| `components/` | Primitives réutilisables, groupées par domaine |
| `ui_kits/repertoire/` | Site répertoire cliquable — accueil + fiche projet |
| `ui_kits/webmap-annuaire/` | Gabarit de webmap rapide — annuaire de l'Ordre des géomètres |
| `thumbnail.html` | Vignette du système |
| `SKILL.md` | Enveloppe Agent Skill |

### Components

**core/** — `Button`, `IconButton`, `Card`, `Badge`, `Tag`, `Icon`, `Logo`
**forms/** — `Input`, `Select`, `Checkbox`, `Switch`
**navigation/** — `SiteHeader`, `Tabs`
**data/** — `ProjectCard`, `StatBlock`, `DataTable`
**feedback/** — `Dialog`, `Tooltip`, `EmptyState`
**map/** — `MapFrame`, `LayerPanel`, `Legend`, `ScaleBar`, `FeaturePopup`

Chaque composant a son `.d.ts` (contrat de props) et son `.prompt.md` (usage + exemple).

### Ajouts intentionnels

Aucune source ne définissait d'inventaire de composants — l'ensemble est donc un jeu standard, restreint aux besoins réels des deux surfaces. Les six composants `map/` sont l'ajout spécifique au métier : sans eux, aucune webmap ne peut être maquettée avec ce système, et la carte est le cœur du produit.

### Limites connues

- Aucun fichier de police fourni → Google Fonts (Montserrat / Poppins / IBM Plex Mono).
- Aucun jeu d'icônes fourni → Lucide via CDN.
- Tuiles servies par le CDN public **CARTO** (`basemaps.cartocdn.com`) : les serveurs bénévoles d'`tile.openstreetmap.org` refusent le trafic de maquette, et `maps.wikimedia.org` ne sert plus de tuiles publiques. En production, prévoir sa propre source (MapTiler, Stadia, ou tuiles auto-hébergées).
- Aucune donnée réelle : les projets et les membres de l'Ordre sont des exemples fabriqués.
- `MapFrame` affiche de vraies tuiles OSM mais n'est **pas** une carte interactive : c'est un cadre de maquette. En production, MapLibre GL ou OpenLayers prend le relais, avec le même chrome.
