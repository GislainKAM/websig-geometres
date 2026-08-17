// Résolution ville/pays/coordonnées à partir du champ `adresse` brut du
// Tableau OGEC (ex. "B.P. 6200 Yaoundé", "Douala", "Montpellier, France").
//
// Précision volontairement limitée à la ville : le tableau ne donne jamais
// d'adresse de rue, donc placer un point par personne à la même coordonnée
// donnerait une fausse impression de précision. La carte affiche des
// symboles proportionnels par ville (voir lib/geometres.js), pas des pins
// individuels.
//
// Coordonnées approximatives (centre-ville), à la main — pas de service de
// géocodage appelé. Étendre CITIES si une nouvelle ville apparaît dans une
// mise à jour des données.

function stripAccents(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function normalizeKey(s) {
  return stripAccents(s).toLowerCase().trim().replace(/\s+/g, ' ');
}

const CITIES = [
  // Cameroun
  { keys: ['yaounde', 'yde', 'messa yaounde'], ville: 'Yaoundé', pays: 'Cameroun', lat: 3.8480, lon: 11.5021 },
  { keys: ['douala', 'dla'], ville: 'Douala', pays: 'Cameroun', lat: 4.0511, lon: 9.7679 },
  { keys: ['kribi'], ville: 'Kribi', pays: 'Cameroun', lat: 2.9424, lon: 9.9077 },
  { keys: ['mfou'], ville: 'Mfou', pays: 'Cameroun', lat: 3.7167, lon: 11.6333 },
  { keys: ['bafoussam'], ville: 'Bafoussam', pays: 'Cameroun', lat: 5.4737, lon: 10.4176 },
  { keys: ['ngoumou'], ville: 'Ngoumou', pays: 'Cameroun', lat: 3.5167, lon: 11.4667 },
  { keys: ['bamenda'], ville: 'Bamenda', pays: 'Cameroun', lat: 5.9597, lon: 10.1494 },
  { keys: ['bertoua'], ville: 'Bertoua', pays: 'Cameroun', lat: 4.5771, lon: 13.6846 },
  { keys: ['edea'], ville: 'Edéa', pays: 'Cameroun', lat: 3.7981, lon: 10.1352 },
  { keys: ['ebolowa'], ville: 'Ebolowa', pays: 'Cameroun', lat: 2.9167, lon: 11.1500 },
  { keys: ['bafia'], ville: 'Bafia', pays: 'Cameroun', lat: 4.7500, lon: 11.2333 },
  { keys: ['maroua'], ville: 'Maroua', pays: 'Cameroun', lat: 10.5913, lon: 14.3153 },
  { keys: ['dibamba'], ville: 'Dibamba', pays: 'Cameroun', lat: 4.0333, lon: 9.9333 },
  { keys: ['mbalmayo'], ville: 'Mbalmayo', pays: 'Cameroun', lat: 3.5167, lon: 11.5000 },
  { keys: ['yokadouma'], ville: 'Yokadouma', pays: 'Cameroun', lat: 3.5167, lon: 15.0500 },
  { keys: ['monatele'], ville: 'Monatélé', pays: 'Cameroun', lat: 4.2833, lon: 11.2000 },
  { keys: ['nkongsamba'], ville: 'Nkongsamba', pays: 'Cameroun', lat: 4.9547, lon: 9.9401 },
  { keys: ['garoua'], ville: 'Garoua', pays: 'Cameroun', lat: 9.3017, lon: 13.3921 },
  { keys: ['limbe'], ville: 'Limbe', pays: 'Cameroun', lat: 4.0225, lon: 9.2148 },
  { keys: ['nkolafamba'], ville: 'Nkolafamba', pays: 'Cameroun', lat: 3.8500, lon: 11.6500 },
  { keys: ['mbankomo'], ville: 'Mbankomo', pays: 'Cameroun', lat: 3.7667, lon: 11.4167 },
  { keys: ['bandjoun'], ville: 'Bandjoun', pays: 'Cameroun', lat: 5.3833, lon: 10.4167 },
  { keys: ['dibombari'], ville: 'Dibombari', pays: 'Cameroun', lat: 4.2333, lon: 9.6333 },
  { keys: ['batouri'], ville: 'Batouri', pays: 'Cameroun', lat: 4.4333, lon: 14.3667 },
  { keys: ['mundemba'], ville: 'Mundemba', pays: 'Cameroun', lat: 4.9500, lon: 8.8667 },
  { keys: ['mbouda'], ville: 'Mbouda', pays: 'Cameroun', lat: 5.6167, lon: 10.2500 },
  { keys: ['meiganga'], ville: 'Meiganga', pays: 'Cameroun', lat: 6.5167, lon: 14.3000 },
  { keys: ['ndop'], ville: 'Ndop', pays: 'Cameroun', lat: 6.0000, lon: 10.4500 },
  { keys: ['dschang'], ville: 'Dschang', pays: 'Cameroun', lat: 5.4500, lon: 10.0667 },
  { keys: ['yagoua'], ville: 'Yagoua', pays: 'Cameroun', lat: 10.3333, lon: 15.2333 },
  { keys: ['kaele'], ville: 'Kaélé', pays: 'Cameroun', lat: 10.1069, lon: 14.4517 },
  { keys: ['lobo'], ville: 'Lobo', pays: 'Cameroun', lat: 3.0500, lon: 11.9833 },
  { keys: ['niete'], ville: 'Niété', pays: 'Cameroun', lat: 2.5667, lon: 10.1667 },
  { keys: ['ndanko ndelele', 'ndelele'], ville: 'Ndelele', pays: 'Cameroun', lat: 4.3500, lon: 14.9500 },
  // Diaspora / étranger
  { keys: ['brazzaville'], ville: 'Brazzaville', pays: 'Congo', lat: -4.2634, lon: 15.2429 },
  { keys: ['evry-courcouronnes', 'evry courcouronnes'], ville: 'Évry-Courcouronnes', pays: 'France', lat: 48.6167, lon: 2.4167 },
  { keys: ['nairobi'], ville: 'Nairobi', pays: 'Kenya', lat: -1.2864, lon: 36.8172 },
  { keys: ['libreville'], ville: 'Libreville', pays: 'Gabon', lat: 0.4162, lon: 9.4673 },
  { keys: ['cotonou'], ville: 'Cotonou', pays: 'Bénin', lat: 6.3703, lon: 2.3912 },
  { keys: ['hampstead'], ville: 'Hampstead', pays: 'Canada', lat: 45.4833, lon: -73.6333 },
  { keys: ['quebec'], ville: 'Québec', pays: 'Canada', lat: 46.8139, lon: -71.2080 },
  { keys: ['longueuil'], ville: 'Longueuil', pays: 'Canada', lat: 45.5333, lon: -73.5167 },
  { keys: ['plymouth'], ville: 'Plymouth', pays: 'Royaume-Uni', lat: 50.3755, lon: -4.1427 },
  { keys: ['montpellier'], ville: 'Montpellier', pays: 'France', lat: 43.6108, lon: 3.8767 },
  { keys: ['freetown'], ville: 'Freetown', pays: 'Sierra Leone', lat: 8.4657, lon: -13.2317 }
];

const INDEX = new Map();
for (const city of CITIES) {
  for (const key of city.keys) INDEX.set(key, city);
}

/**
 * @param {string} adresse — champ brut `adresse` d'une entrée du tableau.
 * @returns {{ville: string, pays: string, lat: number|null, lon: number|null, resolue: boolean}}
 */
export function resolveVille(adresse) {
  if (!adresse) return { ville: '', pays: '', lat: null, lon: null, resolue: false };

  let villeBrute, pays;
  if (adresse.includes(',')) {
    const [v, p] = adresse.split(',').map(s => s.trim());
    villeBrute = v;
    pays = p;
  } else {
    villeBrute = adresse.replace(/^B\.?P\.?:?\s*\d+\s*/i, '').trim() || adresse;
    pays = 'Cameroun';
  }

  const hit = INDEX.get(normalizeKey(villeBrute));
  if (hit) return { ville: hit.ville, pays: hit.pays, lat: hit.lat, lon: hit.lon, resolue: true };
  return { ville: villeBrute, pays: pays || '', lat: null, lon: null, resolue: false };
}
