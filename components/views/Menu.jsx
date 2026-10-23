import React from 'react';
import { Icon } from '../ui/index.js';

export function Menu({ A }) {
  const { t, T, geometres, go, showAll, openReport, lang, setLang, patch } = A;
  const lignes = [
    { ic: 'list', label: T('Voir tous les géomètres', 'See all surveyors') + ' · ' + geometres.length, onClick: showAll },
    { ic: 'help', label: t.mHelp, onClick: () => go('help', { faqQ: '' }) },
    { ic: 'info', label: t.howRead, onClick: () => go('legend') },
    { ic: 'flag', label: t.reportProblem, onClick: () => openReport(null, null) },
    { ic: 'user', label: t.mMaj, onClick: () => openReport(null, 'maj') },
    { ic: 'file', label: T('Devenir membre de l\'Ordre', 'Joining the Order'), onClick: () => go('admission') },
    { ic: 'book', label: t.mAbout, onClick: () => go('about') },
    { ic: 'replay', label: t.mReplay, onClick: () => patch({ screen: 'onb', view: 'home', stack: [] }) }
  ];
  return (
    <nav aria-label="Menu" className="menu" data-screen-label="Menu">
      {lignes.map(l => (
        <button key={l.ic} type="button" className="menu__ligne" onClick={l.onClick}>
          <Icon name={l.ic} /><span>{l.label}</span><Icon name="chevR" />
        </button>
      ))}
      <div className="menu__langue">
        <span className="eyebrow">{t.langLabel}</span>
        <div role="radiogroup" aria-label={t.langLabel} className="menu__radios">
          <button type="button" role="radio" aria-checked={lang === 'FR'} onClick={() => setLang('FR')}>Français</button>
          <button type="button" role="radio" aria-checked={lang === 'EN'} onClick={() => setLang('EN')}>English</button>
        </div>
      </div>
    </nav>
  );
}
