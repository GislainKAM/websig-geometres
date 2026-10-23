import React from 'react';
import { Button, Select, Switch, Icon } from '../ui/index.js';
import { Sym } from '../Bits.jsx';
import { filtrer, TOUTES, RAYONS, filtresInitiaux } from '../../lib/recherche.js';

/**
 * Filtres : on règle un brouillon, le bouton annonce le nombre de résultats AVANT
 * validation. Rien n'est appliqué tant qu'on n'a pas validé.
 */
export function Filters({ A }) {
  const { s, patch, back, t, T, pl, rn, C, geometres, regions, regCount, cityCount, villes, anchorLabel, nearMe } = A;
  const dr = s.draft || { cats: s.cats, inclHon: s.inclHon, region: s.region, city: s.city, radius: s.radius };
  const setDraft = p => patch(st => ({ draft: { ...st.draft, ...p } }));

  const compter = f => filtrer(geometres, { textQ: s.textQ, anchor: s.anchor, ...f }).liste;
  const resultat = compter(dr);
  const base = compter({ cats: { privee: true, experts: true, topo: true }, inclHon: true, region: dr.region, city: dr.city, radius: dr.radius });

  const optionsRegion = [{ value: TOUTES, label: T('Toutes les régions', 'All regions') }]
    .concat(regions.slice().sort((a, b) => (regCount[b] || 0) - (regCount[a] || 0)).map(r => ({ value: r, label: `${rn(r)} · ${regCount[r] || 0}` })));
  const optionsVille = [{ value: TOUTES, label: T('Toutes les villes', 'All towns') }]
    .concat(villes.filter(v => dr.region === TOUTES || v.region === dr.region)
      .sort((a, b) => cityCount[b.ville] - cityCount[a.ville]).map(v => ({ value: v.ville, label: `${v.ville} · ${cityCount[v.ville]}` })));

  const ancrageDistance = !!(s.anchor && s.anchor.coord && s.anchor.kind !== 'region');

  const appliquer = () => {
    const d = s.draft;
    patch({ cats: d.cats, inclHon: d.inclHon, region: d.region, city: d.city, radius: d.radius });
    if (A.mapApi) {
      if (d.city !== TOUTES && d.city !== s.city) { const v = villes.find(x => x.ville === d.city); if (v) A.mapApi.flyTo(v.lat, v.lon, 12); }
    }
    A.back();
  };

  const types = ['privee', 'experts', 'topo'];
  const vide = resultat.length === 0;

  return (
    <div className="filtres" data-screen-label="05 Filtres">
      <div className="filtres__corps">
        <h3 className="filtres__h"><span className="c-bleu"><Icon name="pin" /></span>{t.zone}</h3>
        <div className="filtres__zone">
          <Select label={t.region} value={dr.region} onChange={e => setDraft({ region: e.target.value, city: TOUTES })} options={optionsRegion} />
          <Select
            label={t.cityLbl} value={dr.city} options={optionsVille}
            onChange={e => {
              const v = e.target.value;
              const ville = villes.find(x => x.ville === v);
              setDraft({ city: v, region: v !== TOUTES && ville ? ville.region : dr.region });
            }}
          />
          <div className="filtres__dist">
            <span className="field__label">{t.radius}</span>
            {ancrageDistance ? (
              <>
                <div className="puces">
                  {RAYONS.map(r => (
                    <button key={String(r)} type="button" aria-pressed={dr.radius === r} className={`puce${dr.radius === r ? ' puce--on' : ''}`} onClick={() => setDraft({ radius: r })}>
                      {r ? r + ' km' : T('Sans limite', 'Any')}
                    </button>
                  ))}
                </div>
                <span className="muted muted--s">{T('Mesurée depuis : ', 'Measured from: ')}{anchorLabel(s.anchor)}{T(' (centre de la ville)', ' (town centre)')}</span>
              </>
            ) : (
              <div className="filtres__besoin">
                <span className="muted muted--s">{t.radiusNeed}</span>
                <Button variant="secondary" onClick={nearMe}><Icon name="locate" />{t.nearMeLbl}</Button>
              </div>
            )}
          </div>
        </div>

        <h3 className="filtres__h">{t.types}</h3>
        {types.map(k => (
          <div key={k} className="filtres__type">
            <span className="filtres__sym"><Sym profil={k} size={14} /></span>
            <div>
              <Switch
                checked={!!dr.cats[k]} label={C[k].chip}
                onChange={() => patch(st => ({ draft: { ...st.draft, cats: { ...st.draft.cats, [k]: !st.draft.cats[k] } } }))}
              />
              <span className="muted muted--s">{C[k].desc}</span>
            </div>
            <span className="muted muted--s filtres__n">{base.filter(m => m.profil === k).length}</span>
          </div>
        ))}

        <button type="button" className="filtres__plus" aria-expanded={!!s.moreOpen} onClick={() => patch({ moreOpen: !s.moreOpen })}>
          <span>{t.more}</span><Icon name={s.moreOpen ? 'chevU' : 'chevD'} />
        </button>
        {s.moreOpen ? (
          <div className="filtres__hon">
            <Switch checked={!!dr.inclHon} onChange={() => setDraft({ inclHon: !dr.inclHon })} label={t.inclHon} />
            <span className="muted muted--s">{t.inclHonT}</span>
          </div>
        ) : null}
      </div>

      <div className="filtres__pied">
        <Button size="lg" full disabled={vide} onClick={appliquer}>
          {vide ? T('Aucun géomètre avec ces choix', 'No surveyor with these choices')
            : T('Afficher ', 'Show ') + pl(resultat.length, ['géomètre', 'géomètres'], ['surveyor', 'surveyors'])}
        </Button>
        <Button variant="ghost" full onClick={() => patch({ draft: { ...filtresInitiaux() } })}>{t.resetAll}</Button>
      </div>
    </div>
  );
}
