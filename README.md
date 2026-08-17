# websig-geometres

Répertoire cartographié des membres de l'Ordre National des Géomètres du Cameroun — un projet **webmap** de la plateforme [websig.app](https://websig.app).

**État : scaffold Next.js en place, page d'accueil provisoire seulement.** L'implémentation précédente (moteur de discrétisation, `MapShell`, données ADM1) vivait dans `websig-platform` et en a été retirée pour que ce dépôt reparte propre — elle reste consultable dans l'historique git de `websig-platform`, commit `3172532` et antérieurs (dossiers `apps/geometres/`, `packages/ui/`). À reprendre comme référence technique si utile, pas à recopier tel quel tant que les décisions ci-dessous ne sont pas prises.

Voir [BRIEF.md](./BRIEF.md) pour le contexte complet.

## Avant l'annuaire réel

1. **Données réelles de l'Ordre** — le Tableau OGEC 2026 scanné est dans le dépôt (`HPSC0177.pdf`) avec un brouillon OCR non validé dans [`data/ocr-draft/`](data/ocr-draft/README.md). Ne remplace pas la décision : fichier source de l'Ordre ou ce scan comme référence ? Voir BRIEF.md §1.
2. **Design dédié** — livré le 17 août 2026, prototype haute fidélité dans [`design/prototype-2026-08-17/`](design/prototype-2026-08-17). Résout le point design de BRIEF.md.
3. **Convention avec l'Ordre** — définit les colonnes publiables, qui les valide, qui répond d'une erreur affichée. Prérequis, pas formalité. Tant que ce n'est pas acté, la page d'accueil n'affiche aucun effectif (ni réel ni fictif).

## Développement

Dépend de `@websig/design`, résolu en local via un chemin relatif vers `websig-platform` (voir `package.json`) — les deux dépôts doivent être clonés côte à côte :

```
Desktop/
├── websig-geometres/
└── websig-platform/
```

```bash
npm install
npm run dev
```

## Infra

Suivra le même patron que RGNC — conteneur Docker, sous-domaine `geometres.websig.app`, proxy Nginx Proxy Manager. Voir [websig-docs](https://github.com/GislainKAM/websig-docs).
