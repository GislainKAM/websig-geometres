# Brouillon OCR — Tableau OGEC 2026

**Statut : publiable dans son principe, exactitude non vérifiée.** Transcription visuelle manuelle (lecture d'image, pas d'OCR automatique) de [`HPSC0177.pdf`](../../HPSC0177.pdf) — le Tableau OGEC 2026 (Ordre National des Géomètres du Cameroun), scanné et transmis par l'Ordre.

Décision du 17 août 2026 (Gislain) : le tableau est un document officiel déjà public, donc toutes ses colonnes — contact et email de cabinet compris — sont publiables telles quelles. Ça ne dit rien de l'exactitude de la transcription ci-dessous : c'est un axe différent, voir plus bas.

## Ce que c'est

242 entrées réparties en 4 listes, telles qu'imprimées sur le tableau officiel :

| Fichier | Liste | Lignes | Colonnes |
|---|---|---|---|
| `01-geometres-autorises.csv` | Géomètres autorisés (études topo, expertises, évaluations foncières, clientèle privée) | 40 | numero, nom, numero_agrement, cabinet, adresse, contact, email |
| `02-geometres-experts-honoraires.csv` | Géomètres experts honoraires | 5 | numero, nom, numero_agrement, adresse, contact, email |
| `03-geometres-experts.csv` | Géomètres experts inscrits (expertises + études topo) | 136 | numero, nom, matricule, lieu_service, adresse, contact, email |
| `04-geometres-topographes.csv` | Géomètres topographes | 61 | numero, nom, matricule, lieu_service, adresse, contact, email |
| `tableau-ogec-2026.json` | Les 4 listes combinées, même contenu que les CSV | — | — |

Généré par [`scripts/build-ocr-draft.py`](../../scripts/build-ocr-draft.py) (juste un export, pas un moteur OCR — le script encode la transcription faite à la main).

## Ce qui reste ouvert

1. **Exactitude non garantie.** Transcription manuelle de ~250 lignes sur un scan dense avec filigrane — erreurs plausibles sur les caractères ambigus (0/O, 1/l), les chiffres de téléphone, et les emails écrits en petit corps. Aucune relecture croisée n'a été faite. C'est pour ça que l'app affiche ces données avec un statut « brouillon » et une date de transcription visibles, pas comme un fait acquis.
2. **Qui valide, qui répond d'une erreur.** La publicabilité des colonnes est actée, mais pas le processus de validation avec l'Ordre lui-même — cette transcription n'est pas la leur. Voir BRIEF.md exigence #3.

Ces fichiers alimentent désormais l'app (`lib/geometres.js`) — pas seulement un brouillon de travail interne. À remplacer par une transcription vérifiée (ou un fichier source de l'Ordre) dès que possible.

## Prochaine étape

Faire relire ces fichiers (ou obtenir un fichier source) par l'Ordre pour lever la réserve d'exactitude. Voir [BRIEF.md §1](../../BRIEF.md).
