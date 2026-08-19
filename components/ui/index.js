// Sous-ensemble de @websig/design (websig-platform/packages/design) copié
// dans ce dépôt le 19 août 2026 — chaque projet de l'infra a son propre
// dépôt, et la dépendance `file:../websig-platform/...` ne survivait à
// aucun contexte CI/Docker qui n'a pas exactement cette disposition de
// dossiers sur le disque.
//
// Seuls les composants réellement consommés par cette app sont repris ;
// treize sur la vingtaine que porte le design system. Une évolution du
// design system ne se propage plus ici automatiquement — recopier le
// fichier à la main si une mise à jour doit suivre. Source, telle quelle,
// à la date du portage : websig-platform commit courant au 19 août 2026.
export { Icon } from './Icon.jsx';
export { Logo } from './Logo.jsx';
export { Button } from './Button.jsx';
export { IconButton } from './IconButton.jsx';
export { Badge } from './Badge.jsx';
export { Tag } from './Tag.jsx';
export { Input } from './Input.jsx';
export { Checkbox } from './Checkbox.jsx';
export { Tabs } from './Tabs.jsx';
export { StatBlock } from './StatBlock.jsx';
export { EmptyState } from './EmptyState.jsx';
export { DataTable } from './DataTable.jsx';
export { Legend } from './Legend.jsx';
