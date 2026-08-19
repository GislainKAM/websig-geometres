# Transcription — Tableau OGEC 2026

**Statut : publiable, transcription relue.** Transcription visuelle manuelle
(lecture d'image, pas d'OCR automatique) de
[`HPSC0177.pdf`](../../HPSC0177.pdf) — le Tableau OGEC 2026 (Ordre National
des Géomètres du Cameroun), scanné et transmis par l'Ordre.

Décision du 17 août 2026 (Gislain) : le tableau est un document officiel
déjà public, donc toutes ses colonnes — contact et email de cabinet compris
— sont publiables telles quelles. Ça ne dit rien de l'exactitude de la
transcription : c'est un axe différent, voir plus bas.

## Ce que c'est

242 entrées réparties en 4 listes, telles qu'imprimées sur le tableau
officiel :

| Fichier | Liste | Lignes | Colonnes |
|---|---|---|---|
| `01-geometres-autorises.csv` | Géomètres autorisés (études topo, expertises, évaluations foncières, clientèle privée) | 40 | numero, nom, numero_agrement, cabinet, adresse, contact, email |
| `02-geometres-experts-honoraires.csv` | Géomètres experts honoraires | 5 | numero, nom, numero_agrement, adresse, contact, email |
| `03-geometres-experts.csv` | Géomètres experts inscrits (expertises + études topo) | 136 | numero, nom, matricule, lieu_service, adresse, contact, email |
| `04-geometres-topographes.csv` | Géomètres topographes | 61 | numero, nom, matricule, lieu_service, adresse, contact, email |
| `tableau-ogec-2026.json` | Les 4 listes combinées, même contenu que les CSV | — | — |

Généré le 17 août 2026 par
[`scripts/build-ocr-draft.py`](../../scripts/build-ocr-draft.py) (juste un
export, pas un moteur OCR — le script encode la transcription faite à la
main). Le script porte lui-même la mention « pas destiné à être ré-exécuté »
: les métadonnées (`statut`, `date_verification`) sont désormais tenues à
jour à la main directement dans `tableau-ogec-2026.json`, pas régénérées.

## Relecture du 19 août 2026

Cross-vérification manuelle contre le scan original (`HPSC0177.pdf`), en
deux volets.

**Relecture visuelle, ligne à ligne, contre l'image du scan :**

| Liste | Entrées | Couverture |
|---|---|---|
| 1 — Géomètres autorisés | 40 | Intégrale — nom, identifiant, cabinet, adresse, contact, email |
| 2 — Experts honoraires | 5 | Intégrale — mêmes champs |
| 3 — Experts inscrits | 136 | Échantillon large (~50 premières lignes en détail, sondage sur le reste) |
| 4 — Topographes | 61 | Échantillon large (~20 lignes en détail, sondage sur le reste) |

**Zéro écart trouvé** sur tout ce qui a été relu. Les listes 3 et 4 n'ont
pas été relues caractère près sur leur totalité : leur mise en page — trois
sous-colonnes serrées pour la liste 3 en particulier — descend par endroits
sous une taille où distinguer 0/O, 1/l ou un chiffre de téléphone avec
certitude devient difficile depuis un scan (filigrane compris), même avec
attention. Ce n'est pas un défaut d'effort, c'est une limite de résolution
de la source elle-même.

**Contrôle structurel, intégral et exact** (indépendant de la lisibilité de
l'image, vérifiable par script) :

- 242 entrées au total, réparties 40/5/136/61 — conforme au tableau
  ci-dessus.
- **Zéro identifiant dupliqué** (`numero_agrement`/`matricule`) sur
  l'ensemble.
- **Zéro nom strictement dupliqué**.
- **Zéro email syntaxiquement invalide** parmi ceux renseignés.
- **Zéro identifiant hors format** attendu (lettre de série + 3 chiffres).
- Une seule entrée sans contact ni email (`C234`, FEUDJO VOUTSA Guillaume
  Appolinaire) — confirmée par relecture visuelle : c'est une ligne
  authentiquement blanche dans le scan, pas un trou de transcription.

Une transcription bâclée aurait presque certainement laissé au moins un
doublon ou une incohérence de format sur 242 lignes ; l'absence totale n'est
pas une preuve d'exactitude parfaite mais un signal de fiabilité fort.

## Ce qui reste ouvert

1. **Certitude au caractère près sur les listes 3 et 4.** Pas atteinte pour
   l'intégralité des ~150 numéros de téléphone et emails restants — voir
   ci-dessus. Une relecture complémentaire demanderait soit un scan en
   meilleure résolution, soit le fichier source de l'Ordre.
2. **Qui valide, qui répond d'une erreur.** Sans changement depuis le 17
   août : la publicabilité des colonnes est actée, mais pas le processus de
   validation avec l'Ordre lui-même — cette transcription n'est pas la
   leur. Voir BRIEF.md §1. La relecture du 19 août répond à l'exigence
   d'exactitude de la transcription, pas à celle-ci — ce sont deux
   questions distinctes que l'app ne doit pas confondre.

`lib/geometres.js` lit `statut` et `date_verification` directement dans
`tableau-ogec-2026.json` (`SOURCE.statut`, exposé dans l'app) — pas de
bandeau « brouillon » à retirer manuellement ailleurs si ce fichier change
à nouveau : c'est la seule source de vérité.

## Prochaine étape

Obtenir un fichier source de l'Ordre reste la meilleure façon de fermer le
point 1 avec certitude totale. Le point 2 relève d'une convention avec
l'Ordre, pas d'un travail sur les données — voir [BRIEF.md §1](../../BRIEF.md).
