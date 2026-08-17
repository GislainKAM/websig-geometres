# Brief — annuaire des géomètres

*Extrait et adapté de `BRIEF-PROJET.md` (websig-platform), état au 10 août 2026.*

## Ce que c'est

Une carte des membres de l'Ordre National des Géomètres du Cameroun, à partir du tableau officiel 2026. **Ce n'est pas une carte thématique ordinaire, c'est un annuaire géolocalisé** : le point porté sur la carte est le cabinet, pas la personne.

C'est une **webmap** au sens de la plateforme websig : elle suit le système de design par défaut (`packages/design` dans `websig-platform`), elle ne porte pas sa propre identité visuelle comme le font les projets « WebSIG » (RGNC, MboaLogis).

## Trois exigences qui découlent du caractère officiel

1. **Exactitude**, et date de mise à jour visible en permanence.
2. **Données personnelles** — nom, spécialité, numéro d'inscription, adresse professionnelle sont publiables ; téléphone personnel, domicile, e-mail privé ne le sont pas. La séparation est appliquée **par une vue SQL de publication**, pas par une case à cocher dans le front.
3. **Convention avec l'Ordre** — prérequis, pas formalité : elle définit les colonnes publiables, qui les valide, et qui répond d'une erreur affichée.

## §1 — Décisions en attente

| Sujet | Question |
|---|---|
| Données de l'Ordre | Le Tableau OGEC 2026 (`HPSC0177.pdf`, scan reçu le 17 août 2026) est dans le dépôt, avec un brouillon OCR transcrit à la main dans [`data/ocr-draft/`](data/ocr-draft/README.md) (242 entrées, non vérifié, non publiable). Reste à trancher : ce scan fait-il office de fichier source, ou en demande-t-on un directement à l'Ordre ? Bloque toujours la vraie carte tant que la réponse n'est pas actée. |
| Mise à jour des données | Fichier transmis périodiquement, ou interface d'administration ? La seconde impose une authentification et un backend — bascule le projet en niveau 2. |
| Design | ~~Gislain fournit un design dédié~~ — livré le 17 août 2026, prototype haute fidélité dans [`design/prototype-2026-08-17/`](design/prototype-2026-08-17). Résolu. |

Tant que les données réelles ne sont pas là, tout effectif affiché doit être signalé comme fictif (bandeau visible), jamais silencieux.

## Ce qui existait déjà (référence technique, websig-platform, avant retrait)

Pour mémoire, avant que ce code ne soit retiré de `websig-platform` (voir son historique git, commit `3172532` et antérieurs) :

- Moteur de discrétisation (quantiles, intervalles égaux, Jenks, écart-type, seuils manuels), testé unitairement.
- `MapShell` : carte MapLibre GL, panneau synchronisé, filtres, permalien, équivalent tabulaire pour lecteurs d'écran.
- Limites administratives régionales réelles (geoBoundaries, CC-BY 3.0), simplifiées de 49 %, centroïdes d'aire pour les symboles proportionnels.
- Script de contrôle sans navigateur de toute la chaîne carto (`verifier-carte.mjs`).

Rien de tout ça n'est repris automatiquement ici — à réévaluer une fois les vraies données et le design en main, mais l'approche technique (rendu vectoriel MapLibre, discrétisation calculée au build, PMTiles statiques par défaut) reste celle de la plateforme, voir `websig-platform/BRIEF-PROJET.md`.

## Design system

`websig-geometres` consommera `@websig/design` (tokens + composants React) depuis `websig-platform` une fois ce dépôt prêt à coder — pas de système propre à réinventer. Le kit `ui_kits/webmap-annuaire` du projet Claude Design « websig Design System » (`aebc7a59-511f-4429-b016-dbfec12fd958`) donne le gabarit générique de webmap (en-tête sombre, panneau latéral, carte plein cadre, table attributaire) dont ce projet n'était qu'un exemple illustratif à données factices — **pas la maquette validée** de ce projet spécifique.

## Conventions de travail

Mêmes que `websig-platform` : jamais de `Co-Authored-By` dans les commits, aucun secret dans Git, réponses en français, pas de complaisance — argumenter et accepter de contredire une position antérieure quand elle était mal fondée.
