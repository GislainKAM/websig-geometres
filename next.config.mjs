/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image de conteneur minimale (patron websig-platform / RGNC).
  output: 'standalone',
  // @websig/design est un package workspace non pré-compilé (JSX brut),
  // consommé ici via une dépendance file: vers websig-platform en local —
  // Next doit le transpiler comme du code applicatif. Voir design/README.md
  // pour le lien vers le design system source.
  transpilePackages: ['@websig/design']
};

export default nextConfig;
