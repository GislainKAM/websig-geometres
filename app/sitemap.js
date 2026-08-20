// Une seule page, donc un sitemap d'une seule URL. Il n'est pas là pour la
// découverte — l'accueil est lié depuis websig.app — mais pour donner un
// point d'entrée à déclarer dans robots.txt et dans la Search Console, que
// le domaine n'avait ni l'un ni l'autre (/sitemap.xml renvoyait 404).
//
// Pas de lastModified : il vaudrait la date du build, pas celle du Tableau
// OGEC. Le jour où la fraîcheur des données doit être exposée, elle l'est
// déjà par SOURCE.dateVerification dans lib/geometres.js.
export default function sitemap() {
  return [{ url: 'https://geometres.websig.app/' }];
}
