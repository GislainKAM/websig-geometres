import React from 'react';
import { Input, Icon } from '../ui/index.js';
import { normalizeKey, HORS_CAMEROUN } from '../../lib/villes.js';
import { nomsRegion } from '../../lib/i18n.js';

/** Régions, puis leurs villes : l'entrée « je ne sais pas où chercher ». */
export function Places({ A }) {
  const { t, pl, rn, s, patch, runSearch, villes, regCount, cityCount } = A;
  const pk = normalizeKey(s.pq);
  const groupes = Object.keys(regCount)
    .sort((a, b) => (a === HORS_CAMEROUN) - (b === HORS_CAMEROUN) || regCount[b] - regCount[a])
    .map(r => {
      const vs = villes.filter(v => v.region === r).sort((a, b) => cityCount[b.ville] - cityCount[a.ville]);
      const regTouche = !pk || normalizeKey(nomsRegion(r).join(' ')).includes(pk);
      const visibles = vs.filter(v => regTouche || normalizeKey(v.ville).includes(pk));
      return { r, visibles, garde: regTouche || visibles.length > 0 };
    })
    .filter(g => g.garde);

  return (
    <div className="places" data-screen-label="03b Régions et villes">
      <Input
        label={t.placesFilter} type="search" placeholder={t.placesPh}
        value={s.pq} onChange={e => patch({ pq: e.target.value })} prefix={<Icon name="search" />}
      />
      {groupes.map(g => (
        <div key={g.r} className="places__groupe">
          <button type="button" className="places__region" onClick={() => runSearch(g.r)}
            aria-label={`${rn(g.r)} : ${pl(regCount[g.r], ['géomètre', 'géomètres'], ['surveyor', 'surveyors'])}`}>
            <span className="places__nom">{rn(g.r)}</span>
            <span className="places__n">{regCount[g.r]}</span>
            <Icon name="chevR" />
          </button>
          {g.visibles.map(v => (
            <button key={v.ville} type="button" className="places__ville" onClick={() => runSearch(v.ville)}>
              <span className="places__nom">{v.ville}</span>
              <span className="places__c">{cityCount[v.ville]}</span>
            </button>
          ))}
        </div>
      ))}
      {groupes.length === 0 ? <p className="muted">{t.placesEmpty}</p> : null}
    </div>
  );
}
