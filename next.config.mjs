import { BASE_PATH } from './lib/config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image de conteneur minimale (patron websig-platform / RGNC).
  output: 'standalone',

  // L'annuaire vit sous ogec.cm/annuaire : le domaine appartient à l'Ordre et
  // portera son site plus tard. Tout (pages, _next, public/) est préfixé.
  basePath: BASE_PATH,

  async redirects() {
    return [
      // Tant que rien d'autre n'est publié sur ogec.cm, la racine renvoie à
      // l'annuaire. Redirection TEMPORAIRE (307) : un 301 serait mis en cache
      // par les navigateurs et les moteurs, et gênerait l'arrivée du site de
      // l'Ordre à la racine.
      { source: '/', destination: BASE_PATH, basePath: false, permanent: false },
      // robots.txt et sitemap.xml ne sont lus qu'à la racine du domaine ; Next ne
      // permet pas de les y réécrire sous un basePath, donc on redirige (les
      // moteurs suivent la redirection de robots.txt).
      { source: '/robots.txt', destination: `${BASE_PATH}/robots.txt`, basePath: false, permanent: false },
      { source: '/sitemap.xml', destination: `${BASE_PATH}/sitemap.xml`, basePath: false, permanent: false }
    ];
  },

};

export default nextConfig;
