import React from 'react';
import { Button, Input, Icon } from '../ui/index.js';
import { FAQ } from '../../lib/i18n.js';
import { normalizeKey } from '../../lib/villes.js';

export function Help({ A }) {
  const { s, patch, t, en, openReport } = A;
  const k = normalizeKey(s.faqQ || '');
  const questions = FAQ[en ? 'EN' : 'FR']
    .map((f, i) => ({ ...f, i }))
    .filter(f => !k || normalizeKey(f.q + ' ' + f.a).includes(k));

  return (
    <div className="aide" data-screen-label="08 Aide">
      <Input
        label={t.helpSearch} type="search" placeholder={t.helpPh}
        value={s.faqQ} onChange={e => patch({ faqQ: e.target.value })} prefix={<Icon name="search" />}
      />
      <div className="aide__liste">
        {questions.map(f => {
          const ouvert = s.faqOpen === f.i;
          return (
            <div key={f.i} className="aide__item">
              <button type="button" className="aide__q" aria-expanded={ouvert} onClick={() => patch({ faqOpen: ouvert ? -1 : f.i })}>
                <span>{f.q}</span><Icon name={ouvert ? 'chevU' : 'chevD'} />
              </button>
              {ouvert ? <p className="aide__r">{f.a}</p> : null}
            </div>
          );
        })}
      </div>
      {questions.length === 0 ? <p className="muted">{t.faqNo1} {s.faqQ} {t.faqNo2}</p> : null}
      <div className="aide__ecrire">
        <h2>{t.notFound}</h2>
        <p>{t.notFoundT}</p>
        <Button size="lg" full onClick={() => openReport(null, 'question')}>{t.ask}</Button>
      </div>
    </div>
  );
}
