import React from 'react';
import { Button, Input, Textarea, Radio, Checkbox, Icon } from '../ui/index.js';
import { TYPES } from '../../lib/i18n.js';
import { CONTACT_ORDRE } from '../../lib/config.js';
import { QUARTIERS } from '../../lib/quartiers.js';
import { distanceKm } from '../../lib/geo.js';

/** Quartier ou ville la plus proche d'un point : « Lieu choisi près de Akwa, Douala ». */
function lieuProche(coord, villes) {
  let meilleur = null;
  let dmin = Infinity;
  Object.keys(QUARTIERS).forEach(n => {
    const d = distanceKm(coord, QUARTIERS[n][1]);
    if (d < dmin) { dmin = d; meilleur = `${n}, ${QUARTIERS[n][0]}`; }
  });
  villes.forEach(v => {
    const d = distanceKm(coord, [v.lat, v.lon]) + 1.5;
    if (d < dmin) { dmin = d; meilleur = v.ville; }
  });
  return dmin < 25 ? meilleur : null;
}

// Le message est rédigé en français quelle que soit la langue de l'écran : son
// destinataire est l'Ordre.
function composerMessage(rep, membre, villes) {
  const type = TYPES.FR.find(x => x.v === rep.type);
  const lignes = [`Objet : ${type ? type.l : 'Signalement'}`];
  if (membre) lignes.push(`Concerne : ${membre.nom} · ${membre.identifiant}`);
  if (rep.loc) {
    const [lat, lon] = rep.loc;
    const proche = lieuProche(rep.loc, villes);
    lignes.push(`Lieu : ${proche ? 'près de ' + proche + ' — ' : ''}https://www.openstreetmap.org/?mlat=${lat.toFixed(5)}&mlon=${lon.toFixed(5)}#map=17/${lat.toFixed(5)}/${lon.toFixed(5)}`);
  }
  lignes.push('', rep.desc.trim());
  if (rep.phone.trim()) lignes.push('', `Téléphone pour me rappeler : ${rep.phone.trim()}`);
  lignes.push('', '— Message préparé depuis la Carte des géomètres (ogec.cm).');
  return lignes.join('\n');
}

export function Report({ A }) {
  const { s, t, T, en, geometres, villes, setRep, setRepStep, goHome, toast, mapApi } = A;
  const rep = s.rep;
  if (!rep) return null;
  const types = TYPES[en ? 'EN' : 'FR'];
  const maj = rep.type === 'maj';
  const membre = rep.about ? geometres.find(m => m.identifiant === rep.about) : null;
  const errs = rep.errs || {};
  const proche = rep.loc ? lieuProche(rep.loc, villes) : null;
  const message = rep.step === 4 ? composerMessage(rep, membre, villes) : '';
  const mailto = CONTACT_ORDRE
    ? `mailto:${CONTACT_ORDRE}?subject=${encodeURIComponent('Carte des géomètres · ' + ((TYPES.FR.find(x => x.v === rep.type) || {}).l || 'Signalement'))}&body=${encodeURIComponent(message)}`
    : null;

  const suivant1 = () => { if (!rep.type) { setRep({ errs: { type: 1 } }); return; } setRepStep(2); };
  const maPosition = () => {
    if (!navigator.geolocation) { toast(T('Position indisponible. Touchez plutôt la carte à l\'endroit concerné.', 'Location unavailable. Tap the map where it happens instead.'), 'erreur'); return; }
    navigator.geolocation.getCurrentPosition(pos => {
      const me = [pos.coords.latitude, pos.coords.longitude];
      setRep({ loc: me });
      if (mapApi) mapApi.flyTo(me[0], me[1], 14);
    }, () => toast(T('Position indisponible. Touchez plutôt la carte à l\'endroit concerné.', 'Location unavailable. Tap the map where it happens instead.'), 'erreur'), { timeout: 12000 });
  };
  const preparer = () => {
    const e = {};
    if (rep.desc.trim().length < 10) e.desc = 1;
    if (!rep.consent) e.consent = 1;
    if (e.desc || e.consent) { setRep({ errs: e }); return; }
    setRepStep(4);
  };
  const copier = async () => {
    try { await navigator.clipboard.writeText(message); toast(t.msgCopied); } catch (e) { toast(T('Copie impossible : sélectionnez le texte du message.', 'Copy failed: select the message text.'), 'erreur'); }
  };

  const etape = Math.min(rep.step, 3);
  return (
    <div className="rapport" data-screen-label="07 Signalement">
      {rep.step < 4 ? (
        <div className="rapport__etapes">
          <span className="eyebrow">{T('Étape ', 'Step ')}{etape}{T(' sur 3', ' of 3')}</span>
          <div aria-hidden="true" className="rapport__barres">
            {[1, 2, 3].map(i => <span key={i} className={i <= etape ? 'on' : ''} />)}
          </div>
        </div>
      ) : null}
      {membre && rep.step < 4 ? <div className="rapport__sur">{t.about}<strong>{membre.nom} · {membre.identifiant}</strong></div> : null}

      {rep.step === 1 ? (
        <>
          <fieldset className="rapport__types">
            <legend>{t.whatReport}</legend>
            {types.map(x => (
              <div key={x.v} className={`rapport__type${rep.type === x.v ? ' on' : ''}`}>
                <Radio name="rtype" checked={rep.type === x.v} onChange={() => setRep({ type: x.v, errs: {} })} label={x.l} />
              </div>
            ))}
            {errs.type ? <p role="alert" className="erreur">{t.chooseAnswer}</p> : null}
          </fieldset>
          <Button size="lg" full onClick={suivant1}>{t.continue}</Button>
        </>
      ) : null}

      {rep.step === 2 ? (
        <>
          <div>
            <h2 className="rapport__h2">{maj ? T('Où se trouve votre cabinet ?', 'Where is your office?') : T('Où cela se passe-t-il ?', 'Where is it happening?')}</h2>
            <p className="muted">{t.tapMapLong}</p>
          </div>
          <div className={`rapport__lieu${rep.loc ? ' on' : ''}`}>
            <Icon name="pin" />
            <span>{rep.loc ? (proche ? T('Lieu choisi près de ', 'Place chosen near ') + proche : T('Lieu choisi sur la carte', 'Place chosen on the map')) : T('Aucun lieu choisi pour l\'instant', 'No place chosen yet')}</span>
          </div>
          <div className="duo">
            <Button variant="secondary" onClick={maPosition}><Icon name="locate" />{t.myPos}</Button>
            <Button variant="ghost" onClick={() => setRepStep(3)}>{t.skip}</Button>
          </div>
          <Button size="lg" full disabled={!rep.loc} onClick={() => setRepStep(3)}>{t.confirmPlace}</Button>
        </>
      ) : null}

      {rep.step === 3 ? (
        <div className="rapport__form">
          <h2 className="rapport__h2">{t.describe}</h2>
          <Textarea
            label={t.happened} rows={5} placeholder={t.descPh} value={rep.desc}
            onChange={e => setRep({ desc: e.target.value, errs: { ...errs, desc: 0 } })}
            error={errs.desc ? T('Décrivez la situation en quelques mots (10 caractères minimum).', 'Describe the situation in a few words (10 characters minimum).') : undefined}
            hint={T('Dates, lieu, nom de la personne : tout détail aide l\'Ordre.', 'Dates, place, the person\'s name: every detail helps the Order.')}
          />
          <Input label={t.phoneOpt} hint={t.phoneHint} type="tel" inputMode="tel" placeholder="6XX XX XX XX" value={rep.phone} onChange={e => setRep({ phone: e.target.value })} />
          <div>
            <Checkbox checked={rep.consent} onChange={() => setRep({ consent: !rep.consent, errs: { ...errs, consent: 0 } })} label={t.consent} />
            {errs.consent ? <p role="alert" className="erreur">{t.consentErr}</p> : null}
          </div>
          <Button size="lg" full onClick={preparer}>{t.prepare}</Button>
        </div>
      ) : null}

      {rep.step === 4 ? (
        <div className="rapport__fin" data-screen-label="09 Message prêt" role="status">
          <span className="rapport__ok"><Icon name="check" size={28} /></span>
          <div>
            <h2 className="rapport__h2">{t.msgReady}</h2>
            <p className="muted">{mailto ? '' : t.msgNoAddr}</p>
          </div>
          <pre className="rapport__msg">{message}</pre>
          {mailto ? (
            <>
              <div>
                <h3 className="res__h3">{t.next}</h3>
                <ol className="rapport__suite"><li>{t.n1}</li><li>{t.n2}</li><li>{t.n3}</li></ol>
              </div>
              <a className="btn btn--primary btn--lg btn--full" href={mailto}><Icon name="mail" />{t.openMail}</a>
            </>
          ) : null}
          <Button variant={mailto ? 'secondary' : 'primary'} size="lg" full onClick={copier}><Icon name="copy" />{t.copyMsg}</Button>
          <Button variant="ghost" full onClick={goHome}>{t.backMap}</Button>
        </div>
      ) : null}
    </div>
  );
}
