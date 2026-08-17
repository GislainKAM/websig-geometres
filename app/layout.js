import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import '@websig/design/tokens.css';
import './globals.css';

// Mêmes familles que @websig/site (apps/site/app/layout.js dans
// websig-platform) — voir design/README.md sur l'écart avec le readme du
// prototype (Montserrat/Poppins), qui n'est pas la source de vérité.
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display-src', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body-src', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap' });

export const metadata = {
  title: 'Annuaire des géomètres — websig',
  description: "Répertoire cartographié des membres de l'Ordre National des Géomètres du Cameroun."
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
