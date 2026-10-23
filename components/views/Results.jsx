import React from 'react';
import { Button, Badge, Icon } from '../ui/index.js';
import { Sym, Avatar } from '../Bits.jsx';
import { formatKm } from '../../lib/geo.js';
import { TOUTES, filtresInitiaux } from '../../lib/recherche.js';

const PUCES = ['privee', 'experts', 'topo'];
const VILLES_RACCOURCIS = ['Yaoundé', 'Douala', 'Bafoussam', 'Kribi', 'Bertoua', 'Bamenda'];

function PuceVille({ ville, n, onClick }) {
  return (
    <button type="button" className="puce-ville" onClick={onClick}>{ville}<span>{n}</span></button>
  );
}

/** Liste de résultats : recherche, autour de moi, ville, région ou tout le tableau. */
export function Results({ A }) {
  const { s, patch, t, T, pl, rn, C, results, mesure, nR, nActive, anchorLabel, openDetail, openFilters, openReport, runSearch, nearMe, cityCount } = A;
  const villesChips = VILLES_RACCOURCIS.filter(v => cityCount[v]);

  if (s.geoState === 'locating') {
    return (
      <div role="status" className="res__attente" data-screen-label="Recherche de la position">
        <div className="res__attente-t"><Icon name="locate" />{t.locating}</div>
        {[1, 2, 3, 4].map(k => (
          <div key={k} aria-hidden="true" className="squelette">
            <span className="squelette__c" />
            <span className="squelette__l"><span style={{ width: '70%' }} /><span style={{ width: '45%' }} /></span>
          </div>
        ))}
      </div>
    );
  }

  if (s.geoState === 'denied') {
    return (
      <div className="res__refus" data-screen-label="09 Localisation refusée">
        <div className="res__refus-boite">
          <Badge tone="alerte">{t.locUnav}</Badge>
          <h2>{t.cantLocate}</h2>
          <p>{t.deniedT}</p>
        </div>
        <div>
          <h3 className="res__h3">{t.chooseCity}</h3>
          <div className="puces">
            {villesChips.map(v => <PuceVille key={v} ville={v} n={cityCount[v]} onClick={() => runSearch(v)} />)}
          </div>
        </div>
        <details className="res__aide">
          <summary>{t.howLoc}</summary>
          <ol><li>{t.loc1}</li><li>{t.loc2}</li><li>{t.loc3}</li></ol>
        </details>
        <Button variant="secondary" full onClick={nearMe}>{t.locRetry}</Button>
      </div>
    );
  }

  let etiquette;
  if (s.anchor) etiquette = anchorLabel(s.anchor) + ' · ' + pl(nR, ['géomètre', 'géomètres'], ['surveyor', 'surveyors']);
  else if (!s.textQ) etiquette = T('Tout le tableau', 'Full register') + ' · ' + pl(nR, ['géomètre', 'géomètres'], ['surveyor', 'surveyors']);
  else etiquette = '« ' + s.textQ + ' » · ' + pl(nR, ['résultat', 'résultats'], ['result', 'results']);

  const geoTags = [];
  if (s.region !== TOUTES) geoTags.push({ k: 'r', label: rn(s.region), aria: T('Retirer le filtre ', 'Remove filter ') + rn(s.region), retirer: () => patch({ region: TOUTES, city: TOUTES }) });
  if (s.city !== TOUTES) geoTags.push({ k: 'c', label: s.city, aria: T('Retirer le filtre ', 'Remove filter ') + s.city, retirer: () => patch({ city: TOUTES }) });
  if (s.radius) geoTags.push({ k: 'd', label: T('Moins de ', 'Within ') + s.radius + ' km', aria: T('Retirer la distance', 'Remove distance'), retirer: () => patch({ radius: null }) });

  const toggle = k => patch(st => ({ cats: { ...st.cats, [k]: !st.cats[k] } }));

  // Regroupement par série de matricule (A…, B…, C…) quand la liste est
  // triée par matricule ; trié par distance, un regroupement n'aurait pas de sens.
  const lignes = [];
  let derniere = null;
  results.forEach(m => {
    const serie = String(m.identifiant).charAt(0).toUpperCase() || '—';
    if (!mesure && serie !== derniere) {
      lignes.push({ titre: serie, n: results.filter(x => (String(x.identifiant).charAt(0).toUpperCase() || '—') === serie).length });
      derniere = serie;
    }
    lignes.push({ m });
  });

  const titreVide = s.textQ
    ? T('Aucun géomètre ne correspond à « ', 'No surveyor matches “') + s.textQ + T(' »', '”')
    : s.anchor && s.anchor.kind === 'me' && !nActive ? t.noneNear
    : T('Aucun géomètre avec ces filtres', 'No surveyor with these filters');
  const texteVide = nActive
    ? T('Certains filtres réduisent la liste. Retirez-en un, ou essayez une autre ville.', 'Some filters narrow the list. Remove one, or try another town.')
    : T('Vérifiez l\'orthographe, ou cherchez une ville proche. Un numéro d\'inscription s\'écrit avec une lettre et trois chiffres (A055).', 'Check the spelling, or search a nearby town. A registration number is one letter and three digits (A055).');

  return (
    <div className="res" data-screen-label="03 Résultats">
      <div className="res__tete">
        <span role="status" className="eyebrow">{etiquette}</span>
        {geoTags.length ? (
          <div className="puces">
            {geoTags.map(g => (
              <button key={g.k} type="button" className="etiquette-geo" onClick={g.retirer} aria-label={g.aria}>
                <Icon name="pin" />{g.label}<span aria-hidden="true" className="etiquette-geo__x">×</span>
              </button>
            ))}
          </div>
        ) : null}
        <div className="puces">
          {PUCES.map(k => (
            <button key={k} type="button" aria-pressed={!!s.cats[k]} className={`puce${s.cats[k] ? ' puce--on' : ''}`} onClick={() => toggle(k)}>
              {(s.cats[k] ? '✓ ' : '') + C[k].chip}
            </button>
          ))}
          <button type="button" className="puce puce--filtres" onClick={openFilters}>
            <Icon name="sliders" />{(A.en ? 'Filters' : 'Filtres') + (nActive ? ' (' + nActive + ')' : '')}
          </button>
        </div>
      </div>

      {nR === 0 ? (
        <div className="res__vide" data-screen-label="09 Aucun résultat">
          <h2>{titreVide}</h2>
          <p>{texteVide}</p>
          {nActive ? <Button onClick={() => patch({ ...filtresInitiaux() })}>{t.showAllTypes}</Button> : null}
          <div className="puces">
            {villesChips.slice(0, 4).map(v => <PuceVille key={v} ville={v} n={cityCount[v]} onClick={() => runSearch(v)} />)}
          </div>
          <button type="button" className="link link--bloc" onClick={() => openReport(null, null)}>{t.notListed}</button>
        </div>
      ) : (
        <>
          <ul className="res__liste">
            {lignes.map((l, i) => (l.titre ? (
              <li key={'t' + l.titre} className="res__serie" aria-hidden="true">{T('Série ', 'Series ')}{l.titre}<span>{l.n}</span></li>
            ) : (
              <li key={l.m.id}>
                <button type="button" className="rang" onClick={() => openDetail(l.m)}>
                  <span className="rang__av">
                    <Avatar nom={l.m.nom} profil={l.m.profil} />
                    <span className="rang__sym"><Sym profil={l.m.profil} size={10} /></span>
                  </span>
                  <span className="rang__txt">
                    <span className="rang__nom">{l.m.nom}</span>
                    <span className="rang__sous">{C[l.m.profil].label}{l.m.cabinet ? ' · ' + l.m.cabinet : ''}</span>
                    <span className="rang__lieu">
                      {(l.m.profil === 'honoraires' ? T('N\'exerce plus · ', 'No longer practising · ') : '')}
                      {l.m.ville || T('Ville non renseignée', 'Town not given')}
                      {mesure && l.m.d != null ? T(' · à ', ' · ') + formatKm(l.m.d) : ''}
                    </span>
                  </span>
                  <span className="rang__num">{l.m.identifiant}<Icon name="chevR" /></span>
                </button>
              </li>
            )))}
          </ul>
          <p className="res__note">{t.posNote}</p>
        </>
      )}
    </div>
  );
}
