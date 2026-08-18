import localFont from 'next/font/local';
import '@websig/design/tokens.css';
import './globals.css';

// Polices servies depuis le dépôt et non téléchargées au build.
//
// `next/font/google` va chercher les fichiers sur fonts.gstatic.com à chaque
// compilation. Derrière une inspection TLS (proxy d'entreprise, antivirus qui
// re-signe le HTTPS), Node rejette le certificat — UNABLE_TO_VERIFY_LEAF_
// SIGNATURE — et Next retombe silencieusement sur les polices système : la
// typographie affichée n'est alors plus du tout celle du design. Le même
// raisonnement a déjà fait réécrire Icon.jsx dans @websig/design pour ne plus
// dépendre d'unpkg au runtime ; voir app/fonts/README.md pour la provenance.
//
// Familles et graisses inchangées — seule la source l'est.
const spaceGrotesk = localFont({
  src: [{ path: './fonts/space-grotesk-latin-var.woff2', weight: '500 700', style: 'normal' }],
  variable: '--font-display-src',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif']
});

const inter = localFont({
  src: [{ path: './fonts/inter-latin-var.woff2', weight: '400 600', style: 'normal' }],
  variable: '--font-body-src',
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

export const metadata = {
  title: 'Annuaire des géomètres — websig',
  description: "Répertoire cartographié des membres de l'Ordre National des Géomètres du Cameroun."
};

// `suppressHydrationWarning` sur <html> et lui seul : certaines extensions de
// navigateur posent un attribut sur la balise racine (crxlauncher, barres
// d'outils, gestionnaires de mots de passe) avant que React n'hydrate, ce qui
// déclenche une erreur d'hydratation pour un écart qui ne vient pas de l'app.
// React ne suppresse l'avertissement que d'un niveau — les attributs de <html>
// eux-mêmes — donc les vrais écarts plus bas dans l'arbre restent signalés.
// Contrepartie assumée : un écart légitime sur <html> (une classe de thème
// calculée côté client, par exemple) passerait désormais inaperçu.
export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
