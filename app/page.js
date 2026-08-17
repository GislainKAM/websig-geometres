import { Badge, Card, Button, Logo } from '@websig/design/react';

// Page d'accueil provisoire — pas encore l'annuaire. Tant que la convention
// avec l'Ordre (colonnes publiables) et le fichier source ne sont pas
// tranchés (BRIEF.md §1), on n'affiche aucun effectif : ni les vraies
// données (non validées comme publiables), ni des données fictives qui
// pourraient laisser croire à un annuaire déjà fonctionnel.
export default function Home() {
  return (
    <main style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 'var(--space-6)',
      padding: 'var(--space-6)', textAlign: 'center', fontFamily: 'var(--font-body)'
    }}>
      <Logo size={40} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: 560 }}>
        <Badge tone="brand">En construction</Badge>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', letterSpacing: 'var(--tracking-tight)', margin: 0 }}>
          Annuaire des géomètres
        </h1>
        <p style={{ color: 'var(--ink-700)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)', margin: 0 }}>
          Répertoire cartographié des membres de l'Ordre National des Géomètres du Cameroun.
          Le fichier source et les colonnes publiables ne sont pas encore actés avec l'Ordre —
          aucun effectif n'est donc affiché ici, réel ou fictif.
        </p>
      </div>
      <Card padding="var(--space-5)" style={{ maxWidth: 560, textAlign: 'left' }}>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--ink-700)', lineHeight: 'var(--leading-normal)' }}>
          Décisions en attente avant la vraie carte : voir <code>BRIEF.md §1</code>.
          Maquette dédiée disponible dans <code>design/prototype-2026-08-17/</code>.
        </p>
      </Card>
      <Button as="a" href="https://github.com/GislainKAM/websig-geometres" variant="secondary">
        Voir le dépôt
      </Button>
    </main>
  );
}
