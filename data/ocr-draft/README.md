# Brouillon OCR — Tableau OGEC 2026

**Statut : brouillon non validé, non publiable.** Transcription visuelle manuelle (lecture d'image, pas d'OCR automatique) de [`HPSC0177.pdf`](../../HPSC0177.pdf) — le Tableau OGEC 2026 (Ordre National des Géomètres du Cameroun), scanné et transmis par l'Ordre.

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

## Pourquoi ce n'est pas publiable en l'état

Ça répond à la question ouverte du [BRIEF.md §1](../../BRIEF.md) sur l'origine des données, mais **pas** à ses deux autres exigences :

1. **Exactitude non garantie.** Transcription manuelle de ~250 lignes sur un scan dense avec filigrane — erreurs plausibles sur les caractères ambigus (0/O, 1/l), les chiffres de téléphone, et les emails écrits en petit corps. Aucune relecture croisée n'a été faite.
2. **Colonnes publiables non tranchées.** Le brief est explicite : la séparation entre ce qui est publiable (nom, spécialité, n° d'inscription, adresse professionnelle) et ce qui ne l'est pas (téléphone/email personnels) doit venir d'une **convention avec l'Ordre**, pas d'une supposition de ce script. Les colonnes `contact` et `email` ci-dessus sont donc à traiter comme non publiables par défaut tant que cette convention n'existe pas.

**Ne pas** utiliser ces fichiers comme source pour la carte publique. Ils servent de brouillon de travail interne — pour se projeter sur le volume et la structure réelle des données, pas pour peupler `websig-geometres`.

## Prochaine étape

Faire valider ces fichiers (ou obtenir directement un fichier source) par l'Ordre avant tout usage — et clarifier au même moment quelles colonnes sont publiables. Voir [BRIEF.md §1](../../BRIEF.md).
