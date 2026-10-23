import localFont from 'next/font/local';
import './tokens.css';
import './globals.css';
import { BASE_PATH } from '../lib/config.js';

// Polices servies depuis le dépôt et non téléchargées au build.
//
// `next/font/google` va chercher les fichiers sur fonts.gstatic.com à chaque
// compilation. Derrière une inspection TLS (proxy d'entreprise, antivirus qui
// re-signe le HTTPS), Node rejette le certificat — UNABLE_TO_VERIFY_LEAF_
// SIGNATURE — et Next retombe silencieusement sur les polices système : la
// typographie affichée n'est alors plus du tout celle du design. Voir
// app/fonts/README.md pour la provenance.
//
// Deux familles seulement, comme le système de design OGEC : Space Grotesk
// (titres, libellés d'action) et IBM Plex Mono (corps et données).
const spaceGrotesk = localFont({
  src: [{ path: './fonts/space-grotesk-latin-var.woff2', weight: '500 700', style: 'normal' }],
  variable: '--font-display-src',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif']
});

const plexMono = localFont({
  src: [
    { path: './fonts/ibm-plex-mono-latin-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/ibm-plex-mono-latin-500.woff2', weight: '500', style: 'normal' }
  ],
  variable: '--font-plex-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'monospace']
});

const TITRE = 'Carte des géomètres · Tableau de l\'Ordre 2026';
const DESCRIPTION = "Trouvez et vérifiez un géomètre inscrit au Tableau de l'Ordre National des Géomètres du Cameroun : recherche par ville, quartier, nom ou numéro d'inscription, sur une carte.";

// Open Graph : sans ces balises, WhatsApp et LinkedIn n'affichent que le
// titre et la description, sans image. metadataBase est indispensable,
// og:image doit être une URL absolue — ces plateformes ne résolvent pas
// les chemins relatifs. Image en 1200x630 sous les 300 Ko : au-delà,
// WhatsApp l'ignore silencieusement.
export const metadata = {
  metadataBase: new URL('https://ogec.cm'),
  // Site d'une seule page : le canonical ne peut désigner qu'elle. Il est
  // ici et pas seulement implicite parce que l'auto-canonical de Google se
  // fait sur l'URL crawlée — n'importe quel lien entrant portant un
  // paramètre de campagne (?utm_source=…) devient alors une URL distincte.
  alternates: { canonical: BASE_PATH },
  title: TITRE,
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: 'Carte des géomètres',
    locale: 'fr_FR',
    url: BASE_PATH,
    title: TITRE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_PATH}/og/apercu.jpg`, width: 1200, height: 630, alt: 'Carte des géomètres inscrits au Tableau de l\'Ordre du Cameroun' }]
  },
  twitter: { card: 'summary_large_image', title: TITRE, description: DESCRIPTION, images: [`${BASE_PATH}/og/apercu.jpg`] }
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#14181A' };

// Données structurées : de quoi nommer le site et sa langue aux moteurs. Aucune
// affirmation d'éditeur : la carte n'est pas validée par l'Ordre (BRIEF.md).
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Carte des géomètres',
  alternateName: 'Annuaire des géomètres du Cameroun',
  url: `https://ogec.cm${BASE_PATH}`,
  inLanguage: ['fr', 'en'],
  description: DESCRIPTION
};

// `suppressHydrationWarning` sur <html> et lui seul : certaines extensions de
// navigateur posent un attribut sur la balise racine (crxlauncher, barres
// d'outils, gestionnaires de mots de passe) avant que React n'hydrate, ce qui
// déclenche une erreur d'hydratation pour un écart qui ne vient pas de l'app.
// React ne suppresse l'avertissement que d'un niveau — les attributs de <html>
// eux-mêmes — donc les vrais écarts plus bas dans l'arbre restent signalés.
// Contrepartie assumée : un écart légitime sur <html> (une classe de thème
// calculée côté client, par exemple) passerait désormais inaperçu. L'attribut
// `lang` est ajusté côté client quand l'utilisateur passe en anglais.
export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${spaceGrotesk.variable} ${plexMono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        {children}
      </body>
    </html>
  );
}
