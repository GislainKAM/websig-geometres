import { getGeometres, getVilles, getNonLocalisesCount, PROFIL_LIST, SOURCE } from '../lib/geometres.js';
import { AnnuaireApp } from '../components/AnnuaireApp.jsx';

// Toutes les colonnes du Tableau OGEC sont publiables (décision du 17 août
// 2026, document officiel déjà public — voir BRIEF.md exigence #2). La
// réserve qui reste, et que l'UI doit garder visible, porte sur
// l'exactitude de la transcription : voir data/ocr-draft/README.md.
export default function Home() {
  const geometres = getGeometres();
  const villes = getVilles();
  const nonLocalises = getNonLocalisesCount();

  return (
    <AnnuaireApp
      geometres={geometres}
      villes={villes}
      profils={PROFIL_LIST}
      source={SOURCE}
      nonLocalises={nonLocalises}
    />
  );
}
