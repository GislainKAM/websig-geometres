import React from 'react';
import { Button, Badge, Icon } from '../ui/index.js';
import { Aerial } from '../Bits.jsx';

/** Présentation du premier passage : trois gestes, une langue, un bouton. */
export function Onboarding({ A }) {
  const { t, lang, setLang, finOnboarding } = A;
  const etapes = [
    { n: 1, titre: t.s1, texte: t.s1t, extra: (
      <div aria-hidden="true" className="onb__champ"><Icon name="search" /><span>Akwa, Douala</span></div>
    ) },
    { n: 2, titre: t.s2, texte: t.s2t, extra: <Badge tone="agree">{t.registered}</Badge> },
    { n: 3, titre: t.s3, texte: t.s3t }
  ];
  return (
    <main className="onb" data-screen-label="01 Accueil">
      <div className="onb__feuille">
        <div className="onb__haut">
          <img src="/brand/logo-ogec.svg" alt="Ordre National des Géomètres du Cameroun (OGEC)" className="onb__logo" />
          <Button variant="ghost" onClick={finOnboarding}>{t.skip}</Button>
        </div>
        <div className="onb__photo">
          <Aerial lat={3.8835} lon={11.5135} z={17} demiLargeur={420} demiHauteur={420} />
          <span className="onb__voile" aria-hidden="true" />
          <div className="onb__texte">
            <div className="onb__eyebrow">{t.onbEyebrow}</div>
            <h1 className="onb__titre">{t.onbTitle}</h1>
            <p className="onb__p">{t.onbText}</p>
            <div className="onb__credit">{t.onbCredit}</div>
          </div>
        </div>
        <ol className="onb__etapes">
          {etapes.map(e => (
            <li key={e.n}>
              <span className="onb__n" aria-hidden="true">{e.n}</span>
              <div className="onb__corps">
                <div>
                  <div className="onb__t">{e.titre}</div>
                  <p className="onb__d">{e.texte}</p>
                </div>
                {e.extra || null}
              </div>
            </li>
          ))}
        </ol>
        <div className="onb__bas">
          <Button size="lg" full onClick={finOnboarding}>{t.start}</Button>
          <div role="radiogroup" aria-label={t.langLabel} className="onb__langues">
            <button type="button" role="radio" aria-checked={lang === 'FR'} onClick={() => setLang('FR')}>Français</button>
            <button type="button" role="radio" aria-checked={lang === 'EN'} onClick={() => setLang('EN')}>English</button>
          </div>
        </div>
      </div>
    </main>
  );
}
