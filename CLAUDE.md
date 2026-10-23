# CLAUDE.md

Annuaire cartographié des membres de l'Ordre National des Géomètres du
Cameroun. Webmap Next.js statique, en production sur
[geometres.websig.app](https://geometres.websig.app).

**[README.md](README.md) est la référence technique** (architecture,
données, déploiement) et **[BRIEF.md](BRIEF.md) le journal des
décisions**. Ce fichier ne les duplique pas : il porte ce qu'il faut
savoir avant de toucher au code.

## Conventions de travail

Héritées de `websig-platform`, elles priment sur les réglages par défaut
de l'agent :

- **Réponses en français.**
- **Jamais de `Co-Authored-By` dans les messages de commit** — y compris
  la ligne `Co-Authored-By: Claude`, qui est le défaut de l'agent.
- **Aucun secret dans Git.** Les secrets de déploiement vivent dans les
  secrets GitHub (`DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`, `DEPLOY_HOST`).
- **Pas de complaisance** : argumenter, et contredire une position
  antérieure quand elle était mal fondée.
- Messages de commit en français, préfixe conventionnel (`fix(docker):`,
  `add:`, `chore:`).

## Commandes

```bash
npm run dev      # serveur de développement, port 3000
npm run build    # sortie standalone (next.config.mjs)
npm run start    # sert la sortie de build
```

Pas de tests, pas de linter configurés. La vérification se fait en
lançant l'app (`.claude/launch.json` déclare la cible `websig-dev`).

## Ce qui casse si on l'oublie

- **`output: 'standalone'` n'embarque ni `.next/static` ni `public/`.**
  Les deux sont copiés explicitement dans le `Dockerfile`. Sans ça le
  build est vert et la prod renvoie 404 sur les fichiers statiques —
  constaté le 19 août 2026 sur `/og/apercu.jpg`.
- **Le design system est vendorisé, pas consommé en dépendance.**
  `components/ui/` et `app/tokens.css` portent une copie du « OGEC Design
  System » (export du 23 octobre 2026 ; ce n'est plus `@websig/design`).
  Ne jamais réintroduire de dépendance `file:` vers `websig-platform` :
  ça marche en local et casse en CI/Docker. Une évolution du design system
  ne se propage pas ici automatiquement. Règles à ne pas enfreindre : rayon
  0/2 px, filet 1 px, aucune ombre, une seule transition (120 ms), cible
  tactile 44 px, `--bleu` réservé aux symboles (le texte et les boutons
  bleus utilisent `--bleu-fonce`, seul à passer le contraste).
- **Les données sont bundlées au build.** `lib/geometres.js` importe
  statiquement `data/ocr-draft/tableau-ogec-2026.json`. Pas de backend,
  pas de base de données, page entièrement statique.
- **Le badge de fraîcheur est dérivé, pas figé.** `SOURCE.statut` /
  `SOURCE.dateVerification` dans `lib/geometres.js` se calculent depuis
  l'état réel du JSON — une régression des données redescend le badge
  toute seule. Ne pas le remplacer par un texte en dur.
- **La CI ne construit jamais sur le serveur** (6 vCores partagés entre
  tous les projets de l'infra). GitHub Actions pousse l'image sur GHCR,
  le serveur ne fait que `docker compose pull`.
- **Icônes et aperçu de partage aux couleurs de l'OGEC** (plus ceux de
  websig-platform). `app/icon.svg` (le « O » du sigle sur encre) est la
  source ; `app/favicon.ico` (16/32/48) et `app/apple-icon.png` (180) en sont
  dérivés, `public/og/apercu.jpg` (1200×630, < 300 Ko) est composé à part.
  Tout se régénère à la main (rendu navigateur sans en-tête puis `sharp`) :
  une retouche du logo impose de refaire les quatre. L'aperçu ne doit jamais
  montrer une capture de l'interface (elle date vite).
- **Le point sur la carte est le chef-lieu déclaré au tableau**, pas
  l'adresse du cabinet — la source ne la donne pas. Ne pas laisser
  entendre le contraire dans l'interface. Conséquence : les distances
  (« Autour de moi », rayon) se mesurent au **centre de la ville**
  (`membre.centre`), jamais au point dispersé `lat/lon`, et s'affichent au
  kilomètre. Un membre sans ville reconnue reste dans la liste mais n'est
  pas sur la carte.
- **Pas de backend : l'interface ne promet rien que l'app ne fait.** Le
  signalement prépare un message que l'utilisateur envoie lui-même
  (`mailto:` vers `CONTACT_ORDRE` dans `lib/config.js`, ou copie du
  message si l'adresse est vide). Pas de délai de traitement, pas de
  référence de dossier, pas d'« envoyé à l'Ordre ». La carte n'est pas
  validée par l'Ordre (BRIEF.md §1) : ne pas la présenter comme un
  service officiel de l'Ordre.
- **La fraîcheur des données reste visible en permanence** (exigence #1 du
  BRIEF) : bandeau `.fresh` sous la recherche, dérivé de `SOURCE`. Les
  libellés de catégories viennent du courriel d'un membre du Bureau du
  Conseil (14 octobre 2026) : matricule C Géomètres-Topographes, B
  Géomètres-Experts, A Géomètres-Experts agréés en clientèle privée, membres
  honoraires officiellement admis à l'honorariat. Jamais « service public »
  ni « assermenté ».
- **Les régions des villes sont posées à la main** (`REGION_PAR_VILLE` dans
  `lib/villes.js`), comme les coordonnées : le tableau ne les donne pas.
  Une ville camerounaise ajoutée à `CITIES` doit l'être aussi là.
- **Les logos sont vendorisés** dans `public/brand/` (copies du design
  system) ; le verrouillage blanc va sur l'encre, jamais le sigle bleu sur
  fond bleu. Le logo se montre toujours en couleurs (`logo-ogec-sombre.svg` sur l'en-tête : sigle éclairci + filet tricolore, sans baseline). Les vignettes aériennes viennent d'Esri et le fond de carte d'OpenFreeMap (style Liberty filtré dans `MapView.jsx`, repli Esri) :
  conditions d'usage à revoir avant une mise en ligne durable.

## Données personnelles

Le Tableau OGEC 2026 est un document officiel déjà public (stampé, signé,
diffusé par l'Ordre). **Toutes ses colonnes sont publiables telles
quelles**, contact et email de cabinet compris — décision du 17 août
2026, voir BRIEF.md §« Trois exigences ». Pas de séparation
public/privé à faire dans les données.

## Graphe de connaissance (graphify)

Le repo est indexé en graphe de code. Avant de grepper pour comprendre
une dépendance, interroger le graphe :

```bash
python -m graphify query "comment les épingles sont-elles rendues"
python -m graphify affected "markers.js" --depth 2   # impact d'un changement
python -m graphify god-nodes                          # hubs architecturaux
python -m graphify update .                           # reconstruire après refactor
```

`graphify-out/` est ignoré par Git (dérivé, reconstructible).
`.graphifyignore` exclut `design/prototype-2026-08-17/` : son runtime
vendorisé (`support.js`) monopolisait les hubs et noyait les requêtes.
