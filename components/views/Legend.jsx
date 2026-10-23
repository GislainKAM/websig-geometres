import React from 'react';
import { Button, Icon } from '../ui/index.js';
import { Sym } from '../Bits.jsx';

/** Comment lire la carte : cinq lignes, chacune un symbole et une phrase. */
export function Legend({ A }) {
  const { t, back } = A;
  const lignes = [
    { sym: (
      <div className="lg__col">{['privee', 'experts', 'topo'].map(k => <Sym key={k} profil={k} size={16} />)}</div>
    ), titre: t.lg1, texte: t.lg1t },
    { sym: <span className="lg__nombre">12</span>, titre: t.lg2, texte: t.lg2t },
    { sym: <span className="lg__moi" />, titre: t.lg3, texte: t.lg3t },
    { sym: <span className="lg__env">≈</span>, titre: t.lg4, texte: t.lg4t },
    { sym: <Icon name="hand" />, titre: t.lg5, texte: t.lg5t }
  ];
  return (
    <div className="lg" data-screen-label="06 Comment lire la carte">
      <ol className="lg__liste">
        {lignes.map((l, i) => (
          <li key={i}>
            <div className="lg__sym">{l.sym}</div>
            <div><div className="lg__t">{l.titre}</div><p className="lg__d">{l.texte}</p></div>
          </li>
        ))}
      </ol>
      <Button size="lg" full onClick={back}>{t.backMap}</Button>
    </div>
  );
}
