# websig-geometres

Répertoire cartographié des membres de l'Ordre National des Géomètres du Cameroun — un projet **webmap** de la plateforme [websig.app](https://websig.app).

**État : brief seulement, aucun code.** L'implémentation précédente (moteur de discrétisation, `MapShell`, données ADM1) vivait dans `websig-platform` et en a été retirée pour que ce dépôt reparte propre — elle reste consultable dans l'historique git de `websig-platform`, commit `3172532` et antérieurs (dossiers `apps/geometres/`, `packages/ui/`). À reprendre comme référence technique si utile, pas à recopier tel quel tant que les décisions ci-dessous ne sont pas prises.

Voir [BRIEF.md](./BRIEF.md) pour le contexte complet.

## Avant de coder

1. **Données réelles de l'Ordre** — pas encore obtenues. Voir BRIEF.md §1.
2. **Design dédié** — Gislain doit fournir un design spécifique à ce projet (le kit `webmap-annuaire` du design system websig n'est qu'un gabarit générique illustratif, pas la maquette validée de ce projet).
3. **Convention avec l'Ordre** — définit les colonnes publiables, qui les valide, qui répond d'une erreur affichée. Prérequis, pas formalité.

## Infra

Suivra le même patron que RGNC — conteneur Docker, sous-domaine `geometres.websig.app`, proxy Nginx Proxy Manager. Voir [websig-docs](https://github.com/GislainKAM/websig-docs).
