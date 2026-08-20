// Voir la note jumelle dans websig-platform : en août 2026 le robots.txt
// servi sur ce domaine était celui, managé, de Cloudflare — que des
// commentaires sur les content signals, aucune règle, aucun sitemap. Si
// après déploiement la ligne Sitemap n'apparaît pas, c'est Cloudflare qui
// masque l'origine (tableau de bord, section AI Crawl Control).
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://geometres.websig.app/sitemap.xml',
    host: 'https://geometres.websig.app'
  };
}
