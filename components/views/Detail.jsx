import React from 'react';
import { Button, Badge, Icon } from '../ui/index.js';
import { Avatar, Aerial } from '../Bits.jsx';
import { dateCourte } from '../../lib/i18n.js';

/** Fiche d'un géomètre : statut, numéro, contact, et les gestes utiles (appeler, partager, signaler). */
export function Detail({ A }) {
  const { selM: m, t, T, rn, C, source, runSearch, openReport, toast } = A;
  if (!m) return null;
  const honoraire = m.profil === 'honoraires';
  const [principal, ...autres] = m.telephones;

  const partager = async () => {
    const url = location.href.split('#')[0] + '#s=detail&id=' + m.identifiant;
    try {
      if (navigator.share) { await navigator.share({ title: m.nom, url }); return; }
    } catch (e) { return; /* partage annulé : rien à signaler */ }
    try { await navigator.clipboard.writeText(url); } catch (e) { /* presse-papiers refusé */ }
    toast(T('Lien de la fiche copié. Collez-le dans un SMS ou sur WhatsApp.', 'Profile link copied. Paste it in a text message or on WhatsApp.'));
  };

  const fraicheur = source && source.statut === 'verifie'
    ? T('transcription relue le ', 'transcription reviewed on ') + dateCourte(source.dateVerification)
    : T('transcription non vérifiée', 'transcription not verified');

  return (
    <article className="fiche" data-screen-label="04 Fiche">
      <div className="fiche__tete">
        {m.villeResolue ? <Aerial lat={m.centre[0]} lon={m.centre[1]} z={16} demiLargeur={260} demiHauteur={110} /> : null}
        <span className="fiche__voile" aria-hidden="true" />
        <div className="fiche__tete-in">
          <Avatar nom={m.nom} profil={m.profil} size={64} bordure />
          <div className="fiche__qui">
            <Badge tone={honoraire ? 'neutre' : 'agree'} onDark>{honoraire ? T('Membre honoraire', 'Honorary member') : t.registered}</Badge>
            <h1 className="fiche__nom">{m.nom}</h1>
            <div className="fiche__type">{C[m.profil].label} · {m.ville || T('Ville non renseignée', 'Town not given')}</div>
          </div>
        </div>
      </div>

      <div className="fiche__corps">
        <dl className="dl">
          <div className="dl__c dl__c--2"><dt>{t.regNo}</dt><dd className="dl__num">{m.identifiant}</dd></div>
          {m.cabinet ? <div className="dl__c dl__c--2"><dt>{t.org}</dt><dd>{m.cabinet}</dd></div> : null}
          <div className="dl__c"><dt>{t.region}</dt><dd>{m.region ? rn(m.region) : '—'}</dd></div>
          <div className="dl__c"><dt>{t.phone}</dt><dd>{m.telephones.length ? m.telephones.map(p => p.affiche).join(' · ') : T('Non communiqué', 'Not provided')}</dd></div>
          {m.email ? <div className="dl__c dl__c--2"><dt>E-mail</dt><dd className="dl__mail"><a href={'mailto:' + m.email}>{m.email}</a></dd></div> : null}
        </dl>

        {!honoraire && principal ? (
          <div className="fiche__appels">
            <a className="btn btn--primary btn--lg btn--full" href={'tel:' + principal.compose}>
              <Icon name="phone" />{T('Appeler le ', 'Call ')}{principal.affiche}
            </a>
            {autres.map(p => (
              <a key={p.compose} className="btn btn--secondary btn--md btn--full" href={'tel:' + p.compose}>
                <Icon name="phone" />{T('Appeler le ', 'Call ')}{p.affiche}
              </a>
            ))}
          </div>
        ) : null}

        {honoraire ? (
          <div className="fiche__hon">
            <p>{t.honT}</p>
            {m.ville ? <Button size="lg" full onClick={() => runSearch(m.ville)}>{T('Voir les autres géomètres à ', 'See other surveyors in ')}{m.ville}</Button> : null}
          </div>
        ) : null}

        <div className="fiche__duo">
          <Button variant="secondary" full onClick={partager}><Icon name="share" />{t.share}</Button>
          <Button variant="secondary" full onClick={() => openReport(m.identifiant, 'fiche')}><Icon name="flag" />{t.report}</Button>
        </div>
        <div className="fiche__conseil"><span className="c-bleu"><Icon name="info" /></span>{t.quote}</div>
        {m.decision ? <p className="fiche__source">{T('Inscrit par la ', 'Registered by ')}{m.decision.replace(/^Décision/, T('décision', 'Decision'))}{T('. Coordonnées non communiquées.', '. Contact details not provided.')}</p> : null}
        <p className="fiche__source">{T('Source : tableau de l\'Ordre 2026 · ', 'Source: 2026 Register of the Order · ')}{fraicheur}</p>
      </div>
    </article>
  );
}
