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
  `components/ui/` porte une copie des composants et jetons de
  `@websig/design`. Ne jamais réintroduire de dépendance `file:` vers
  `websig-platform` : ça marche en local et casse en CI/Docker. Une
  évolution du design system ne se propage pas ici automatiquement.
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
- **Les icônes sont vendorisées, comme le design system.**
  `app/icon.svg`, `app/favicon.ico` et `app/apple-icon.png` sont des
  copies de `apps/site/app/` dans `websig-platform`, qui porte la marque
  et le générateur (`npm run favicon`). Elles ne se mettent pas à jour
  toutes seules : une retouche de la marque se recopie ici à la main.
  Voir `docs/referencement.md` de `websig-platform`.
- **Le point sur la carte est le chef-lieu déclaré au tableau**, pas
  l'adresse du cabinet — la source ne la donne pas. Ne pas laisser
  entendre le contraire dans l'interface.

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
