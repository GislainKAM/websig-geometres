import React from 'react';
import { Button } from '../ui/index.js';

// Pièces du dossier d'admission à l'Ordre pour les ingénieurs géomètres /
// topographes formés à l'étranger. Transcrit de « Admission OGEC.pdf »
// (document de l'Ordre, 1 page, non daté). Seule la catégorie « parcours à
// l'étranger » figure dans ce document : ne pas laisser croire que c'est la
// liste complète pour tous les candidats. Faute du texte source corrigée :
// « Gille » → « Grille ».
const PIECES = {
  FR: [
    'Demande timbrée sur papier libre adressée au président du conseil',
    'Extrait de casier judiciaire, bulletin n° 3, de moins de 3 mois',
    'Photocopie certifiée de la carte nationale d\'identité',
    'Certificat de nationalité',
    'Photocopie certifiée du ou des diplômes',
    'Grille des programmes de l\'école',
    'C.V. détaillé',
    'Engagement sur l\'honneur (signature légalisée dans un commissariat), confirmant n\'avoir subi aucune condamnation pour fait contraire à la probité (vol, détournement de deniers publics, escroquerie, abus de confiance, faux et usage de faux) ni atteinte aux bonnes mœurs',
    'Provision de cinquante mille (50 000) FCFA'
  ],
  EN: [
    'Stamped application on plain paper addressed to the president of the council',
    'Criminal record extract, bulletin no. 3, less than 3 months old',
    'Certified photocopy of the national identity card',
    'Certificate of nationality',
    'Certified photocopy of the diploma(s)',
    'Curriculum outline of the school',
    'Detailed CV',
    'Sworn statement (signature certified at a police station) confirming no conviction for acts contrary to probity (theft, embezzlement of public funds, fraud, breach of trust, forgery and use of forged documents) nor offence against public morals',
    'Deposit of fifty thousand (50,000) FCFA'
  ]
};

export function Admission({ A }) {
  const { en, T, back, openReport } = A;
  return (
    <div className="adm" data-screen-label="11 Admission">
      <div>
        <div className="eyebrow">{T('Devenir membre de l\'Ordre', 'Joining the Order')}</div>
        <h1 className="home__titre">{T('Dossier d\'admission : parcours à l\'étranger', 'Admission file: trained abroad')}</h1>
        <p className="muted muted--l">{T(
          'Pièces à fournir par les ingénieurs géomètres et topographes qui ont suivi leur formation à l\'étranger. Le siège de l\'Ordre est à Yaoundé.',
          'Documents to provide for land-surveying and topography engineers trained abroad. The Order\'s head office is in Yaoundé.')}</p>
      </div>
      <ol className="adm__liste">
        {PIECES[en ? 'EN' : 'FR'].map((p, i) => (
          <li key={i}><span className="adm__n" aria-hidden="true">{i + 1}</span><span>{p}</span></li>
        ))}
      </ol>
      <p className="muted muted--s">{T(
        'Source : document de l\'Ordre « Dossier à fournir pour l\'admission à l\'OGEC », non daté. Il ne couvre que ce parcours : pour une formation suivie au Cameroun, demandez la liste à l\'Ordre.',
        'Source: Order document “File to provide for admission to the OGEC”, undated. It covers this route only: for training completed in Cameroon, ask the Order for the list.')}</p>
      <Button size="lg" full onClick={() => openReport(null, 'question')}>{T('Poser une question à l\'Ordre', 'Ask the Order a question')}</Button>
      <Button variant="ghost" full onClick={back}>{T('Retour', 'Back')}</Button>
    </div>
  );
}
