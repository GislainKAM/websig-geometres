import React from 'react';
import { Badge } from '../ui/index.js';
import { dateCourte } from '../../lib/i18n.js';

/** Sources, fraîcheur et limites des données. Le statut de relecture est celui de la source, pas un texte figé. */
export function About({ A }) {
  const { t, T, source, geometres, nonLocalises, openReport } = A;
  const verifie = source && source.statut === 'verifie';
  const fraicheur = T('Transcription du ', 'Transcribed on ') + dateCourte(source.dateTranscription)
    + (verifie ? T(' · relue le ', ' · reviewed on ') + dateCourte(source.dateVerification) : T(' · non vérifiée', ' · not verified'));

  return (
    <div className="apropos" data-screen-label="10 À propos">
      <div>
        <h1 className="home__titre">{t.aboutTitle}</h1>
        <p className="muted muted--l">{t.aboutT}</p>
      </div>
      <dl className="dl dl--liste">
        <div className="dl__c"><dt>{t.srcLbl}</dt><dd>{T('Tableau officiel de l\'Ordre 2026, ', 'Official 2026 Register of the Order, ')}{geometres.length}{T(' inscrits.', ' registered.')}</dd></div>
        <div className="dl__c"><dt>{t.updated}</dt><dd>{fraicheur} <Badge tone={verifie ? 'agree' : 'alerte'}>{verifie ? T('Relue', 'Reviewed') : T('Non vérifiée', 'Unverified')}</Badge></dd></div>
        {source.ajouts.n ? (
          <div className="dl__c"><dt>{T('Inscriptions récentes', 'Recent registrations')}</dt><dd>{T(`${source.ajouts.n} géomètres ajoutés d'après la ${source.ajouts.decisions.join(' ; ').replace(/^Décision/, 'décision')}. Seuls leur nom et leur matricule figurent dans la décision : ville, téléphone et e-mail ne sont pas connus. Ces fiches n'ont pas été relues.`, `${source.ajouts.n} surveyors added from ${source.ajouts.decisions.join('; ')}. The decision gives only their name and registration number: town, phone and email are not known. These profiles have not been reviewed.`)}</dd></div>
        ) : null}
        <div className="dl__c"><dt>{t.statusLbl}</dt><dd>{t.statusT}</dd></div>
        <div className="dl__c"><dt>Positions</dt><dd>{t.posT}{nonLocalises ? ' ' + T(`${nonLocalises} fiche${nonLocalises > 1 ? 's' : ''} sans ville reconnue ${nonLocalises > 1 ? 'ne sont pas placées' : "n'est pas placée"} sur la carte, mais ${nonLocalises > 1 ? 'figurent' : 'figure'} dans la liste.`, `${nonLocalises} profile${nonLocalises > 1 ? 's' : ''} with no recognised town ${nonLocalises > 1 ? 'are' : 'is'} not placed on the map but appear${nonLocalises > 1 ? '' : 's'} in the list.`) : ''}</dd></div>
        <div className="dl__c"><dt>{t.basemap}</dt><dd>{t.basemapT}<br />{T('Vues aériennes : © Esri, Maxar, Earthstar Geographics', 'Aerial views: © Esri, Maxar, Earthstar Geographics')}<br />{T('Limites du Cameroun : geoBoundaries (CC-BY 3.0)', 'Cameroon boundaries: geoBoundaries (CC-BY 3.0)')}</dd></div>
        <div className="dl__c"><dt>{t.yourData}</dt><dd>{t.yourDataT}</dd></div>
      </dl>
      <p className="muted muted--s">
        {t.err1}
        <button type="button" className="link" onClick={() => openReport(null, 'fiche')}>{t.err2}</button>
        {t.err3}
      </p>
      <div className="apropos__pied">
        <img src="/brand/logo-ogec-mark.svg" alt="OGEC" style={{ height: 28, width: 'auto' }} />
      </div>
    </div>
  );
}
