# Brief — annuaire des géomètres

*Extrait et adapté de `BRIEF-PROJET.md` (websig-platform), état au 10 août
2026. Mis à jour au 19 août 2026 pour refléter l'implémentation réelle —
voir [README.md](README.md) pour l'architecture et l'état courants, ce
document reste le journal des décisions et de leur raisonnement, pas la
référence technique.*

## Ce que c'est

Une carte des membres de l'Ordre National des Géomètres du Cameroun, à partir du tableau officiel 2026. **Ce n'est pas une carte thématique ordinaire, c'est un annuaire géolocalisé** : le point porté sur la carte est le cabinet, pas la personne.

C'est une **webmap** au sens de la plateforme websig : elle suit le système de design par défaut (`packages/design` dans `websig-platform`), elle ne porte pas sa propre identité visuelle comme le font les projets « WebSIG » (RGNC, MboaLogis).

## Trois exigences qui découlent du caractère officiel

1. **Exactitude**, et date de mise à jour visible en permanence. *Mis en œuvre le 19 août 2026* : badge dans l'en-tête, dérivé de `SOURCE.statut`/`SOURCE.dateVerification` (`lib/geometres.js`, câblé sur le statut réel de `data/ocr-draft/tableau-ogec-2026.json`, pas un texte figé) — voir `data/ocr-draft/README.md` pour la relecture qui l'a fait passer de « brouillon » à « relu ». Visible seulement en desktop pour l'instant (`components/AnnuaireApp.jsx`, en-tête mobile n'a pas d'équivalent) — écart à corriger, pas une exigence encore pleinement tenue.
2. **Données personnelles** — tranché le 17 août 2026 : le Tableau OGEC est un document officiel déjà public (stampé, signé, diffusé par l'Ordre), donc **toutes ses colonnes sont publiables telles quelles**, contact et email de cabinet compris. Pas de séparation public/privé à faire dans les données.
3. **Convention avec l'Ordre** — la question « quelles colonnes » est tranchée (toutes, cf. #2). Reste ouvert : qui valide l'exactitude de ce qui est affiché, et qui répond d'une erreur (numéro erroné, personne radiée entre-temps) — d'autant que la source actuelle est une transcription manuelle non celle de l'Ordre. Voir `data/ocr-draft/README.md`.

## §1 — Décisions en attente

| Sujet | Question |
|---|---|
| Données de l'Ordre | Le Tableau OGEC 2026 (`HPSC0177.pdf`, scan reçu le 17 août 2026) sert de source ; toutes ses colonnes sont publiables (décision du 17 août, voir exigence #2 ci-dessus). Transcription relue le 19 août 2026 (100 % des listes 1 et 2, échantillon large des listes 3 et 4, contrôle structurel intégral, zéro écart trouvé) — voir [`data/ocr-draft/README.md`](data/ocr-draft/README.md) pour la méthode et sa portée exacte. Reste ouvert, distinct de l'exactitude : qui valide institutionnellement auprès de l'Ordre (exigence #3 ci-dessus, inchangée). |
| Mise à jour des données | Reporté (17 août 2026) — fichier transmis périodiquement ou interface d'administration, à trancher plus tard. La seconde impose une authentification et un backend — bascule le projet en niveau 2. |
| Design | ~~Gislain fournit un design dédié~~ — livré le 17 août 2026, prototype haute fidélité dans [`design/prototype-2026-08-17/`](design/prototype-2026-08-17). Résolu, avec un écart assumé : l'implémentation s'éloigne du prototype partout où l'usage réel l'exigeait (échelle typographique redescendue, portraits au lieu de pastilles de couleur, carte MapLibre réelle au lieu du cadre décoratif à tuiles fixes) — voir l'historique des commits pour le détail de chaque écart et son raisonnement. |

Les données affichées sont réelles (source officielle) et relues depuis le 19 août 2026 (voir tableau ci-dessus) : la date de transcription, la date de relecture et leur statut doivent rester visibles en permanence — c'est ce que dérive `SOURCE` dans `lib/geometres.js`, pas un état figé une fois pour toutes (une régression future de `data/ocr-draft/tableau-ogec-2026.json` redescendrait le badge automatiquement).

## Ce qui existait déjà avant ce projet (websig-platform, retiré, jamais repris)

Pour mémoire, avant que ce code ne soit retiré de `websig-platform` (voir son historique git, commit `3172532` et antérieurs) — **rien de tout ça n'a été repris**, la direction prise a été différente :

- Moteur de discrétisation (quantiles, intervalles égaux, Jenks, écart-type, seuils manuels), testé unitairement.
- `MapShell` : carte MapLibre GL, panneau synchronisé, filtres, permalien, équivalent tabulaire pour lecteurs d'écran.
- Limites administratives régionales réelles (geoBoundaries, CC-BY 3.0), simplifiées de 49 %, centroïdes d'aire pour les symboles proportionnels.
- Script de contrôle sans navigateur de toute la chaîne carto (`verifier-carte.mjs`).

Ce projet n'est pas une carte thématique à discrétiser (pas de choroplèthe, pas de symboles proportionnels par région) — c'est un annuaire filtrable avec une carte de repérage. Le moteur de discrétisation et les cinq recettes thématiques de la plateforme (voir `websig-platform/BRIEF-PROJET.md`) ne s'appliquent donc pas ici ; MapLibre GL, si, et c'est bien ce qui est en place (`components/MapView.jsx`).

## Design system

**Vendorisé, pas consommé en dépendance** — décision du 19 août 2026, revenue sur l'intention initiale ci-dessous. `components/ui/` porte une copie des treize composants React et des jetons CSS de `@websig/design` réellement utilisés ici. Chaque projet de l'infra websig a son propre dépôt Git ; une dépendance `file:../websig-platform/...` marche en local mais casse dans tout contexte CI/Docker qui n'a pas exactement la même disposition de dossiers sur le disque — bloquant avant de préparer un déploiement. Contrepartie assumée : une évolution du design system ne se propage plus ici automatiquement, voir la note de provenance dans `components/ui/index.js`.

Origine, pour mémoire : le kit `ui_kits/webmap-annuaire` du projet Claude Design « websig Design System » (`aebc7a59-511f-4429-b016-dbfec12fd958`) donnait le gabarit générique de webmap (en-tête sombre, panneau latéral, carte plein cadre, table attributaire) dont ce projet n'était qu'un exemple illustratif à données factices — **pas la maquette validée** de ce projet spécifique, qui est venue ensuite (`design/prototype-2026-08-17/`).

## Conventions de travail

Mêmes que `websig-platform` : jamais de `Co-Authored-By` dans les commits, aucun secret dans Git, réponses en français, pas de complaisance — argumenter et accepter de contredire une position antérieure quand elle était mal fondée.
