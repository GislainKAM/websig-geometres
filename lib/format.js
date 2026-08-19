/** « 1234 » → « 1 234 » — séparateur de milliers, espace insécable évitée à dessein (le tiret bas ordinaire suffit ici, pas de contrainte typographique particulière). */
export function formatNumber(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
