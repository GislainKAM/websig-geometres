import React from 'react';
import { Icon } from '../ui/index.js';
import { Aerial } from '../Bits.jsx';

// Villes proposées en raccourci, par ordre d'usage courant (capitales de
// région d'abord), réduites à celles qui ont au moins un membre.
const RACCOURCIS = ['Yaoundé', 'Douala', 'Bafoussam', 'Kribi', 'Bertoua', 'Bamenda', 'Garoua', 'Maroua'];

export function Home({ A }) {
  const { t, T, pl, geometres, villes, cityCount, nCities, nRegions, runSearch, go, openReport, showAll, nearMe } = A;
  const cartes = RACCOURCIS.filter(v => cityCount[v]).slice(0, 6)
    .map(v => ({ ville: v, count: cityCount[v], info: villes.find(x => x.ville === v) }));
  const nbMembres = geometres.length;

  return (
    <div className="home" data-screen-label="02 Carte">
      <div>
        <div className="eyebrow">{pl(nbMembres, ['géomètre inscrit', 'géomètres inscrits'], ['registered surveyor', 'registered surveyors'])} · {nCities}{T(' villes', ' towns')}</div>
        <h1 className="home__titre">{t.whereLook}</h1>
      </div>

      <div className="home__villes">
        {cartes.map(c => (
          <button key={c.ville} type="button" className="ville-carte" onClick={() => runSearch(c.ville)}
            aria-label={`${c.ville} : ${pl(c.count, ['géomètre', 'géomètres'], ['surveyor', 'surveyors'])}`}>
            <Aerial lat={c.info.lat} lon={c.info.lon} z={15} demiLargeur={110} demiHauteur={60} />
            <span className="ville-carte__voile" aria-hidden="true" />
            <span className="ville-carte__pied">
              <span className="ville-carte__nom">{c.ville}</span>
              <span className="ville-carte__n">{c.count}</span>
            </span>
          </button>
        ))}
      </div>

      <button type="button" className="ligne-action home__tire home__moi" onClick={nearMe}>
        <span className="ligne-action__ic"><Icon name="locate" /></span>
        <span className="ligne-action__t">{t.nearMeLbl}</span>
        <Icon name="chevR" />
      </button>
      <button type="button" className="ligne-action home__tire" onClick={() => go('places', { pq: '' })}>
        <span className="ligne-action__ic"><Icon name="pin" /></span>
        <span className="ligne-action__t">{T('Toutes les régions et villes', 'All regions and towns')} · {nRegions} / {nCities}</span>
        <Icon name="chevR" />
      </button>
      <button type="button" className="ligne-action home__tire" onClick={showAll}>
        <span className="ligne-action__ic"><Icon name="list" /></span>
        <span className="ligne-action__t">{T('Voir tous les géomètres', 'See all surveyors')} · {geometres.length}</span>
        <Icon name="chevR" />
      </button>

      <div className="home__numero">
        <div>
          <div className="home__numero-t">{t.checkNum}</div>
          <div className="home__numero-d">{t.checkNumT}</div>
        </div>
        <span className="home__numero-ex">A055</span>
      </div>

      <nav aria-label={t.otherActions} className="home__autres">
        <button type="button" onClick={() => go('legend')}><span className="c-bleu"><Icon name="info" /></span>{t.readMap}</button>
        <button type="button" onClick={() => openReport(null, null)}><span className="c-alerte"><Icon name="flag" /></span>{t.reportProblem}</button>
        <button type="button" onClick={() => openReport(null, 'maj')}><span className="c-bleu"><Icon name="user" /></span>{t.surveyorArea}</button>
      </nav>
    </div>
  );
}
