// Adresse de réception des signalements et demandes de mise à jour de fiche.
//
// L'app est statique : il n'y a pas de backend pour recevoir un signalement.
// Le parcours « Signaler un problème » prépare donc un message que
// l'utilisateur envoie lui-même depuis sa messagerie (lien mailto:). Tant que
// cette adresse est vide, l'écran final propose de copier le message au lieu
// d'ouvrir la messagerie — aucune adresse inventée.
//
// Adresse relevée sur l'en-tête de la décision n°017/OGEC/PC/2026 du 28 juillet
// 2026 (« contact@ogec.cm »). À faire confirmer comme adresse de réception.
// Chemin sous lequel l'app est servie (ogec.cm/annuaire). Lu par next.config.mjs ;
// les <img> et les liens écrits à la main doivent passer par `chemin()`, Next ne
// préfixe que ses propres liens.
export const BASE_PATH = '/annuaire';
export const chemin = p => BASE_PATH + p;

export const CONTACT_ORDRE = 'contact@ogec.cm';
