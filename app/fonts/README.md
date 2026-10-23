# Polices

Fichiers servis depuis le dépôt, chargés par `app/layout.js` via
`next/font/local`. Sous-ensemble **latin** uniquement — il couvre les
caractères accentués du français, `œ`/`Œ` (U+0152-0153) compris.

| Fichier | Famille | Graisses | Rôle |
| --- | --- | --- | --- |
| `space-grotesk-latin-var.woff2` | Space Grotesk (variable) | 500–700 | `--font-display` |
| `ibm-plex-mono-latin-400.woff2` | IBM Plex Mono | 400 | `--font-text` |
| `ibm-plex-mono-latin-500.woff2` | IBM Plex Mono | 500 | `--font-text` |

Environ 50 Ko au total. Space Grotesk, variable, tient en un fichier pour
toute sa plage de graisses ; IBM Plex Mono n'existant qu'en statique, ses
deux graisses sont deux fichiers. Inter, utilisée avant la refonte du
23 octobre 2026, a été retirée : le système de design OGEC n'a que ces deux
familles.

## Licence

Les deux familles sont sous **SIL Open Font License 1.1**, qui autorise la
redistribution, y compris intégrée à un projet. Texte de la licence :
<https://openfontlicense.org>.

- Space Grotesk — Florian Karsten
- IBM Plex Mono — IBM

## Provenance

Téléchargés depuis `fonts.gstatic.com` le 18 août 2026, via les URL que
l'API `fonts.googleapis.com/css2` renvoie pour la plage `latin`.

## Pourquoi pas `next/font/google`

Ce module télécharge les fichiers à **chaque compilation**. Derrière une
inspection TLS — proxy d'entreprise, antivirus qui re-signe le HTTPS — Node
rejette le certificat (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`) et Next retombe
**silencieusement** sur les polices système : le build réussit, mais la
typographie affichée n'est plus celle du design. Servir les fichiers depuis
le dépôt rend la compilation reproductible et hors-ligne.

Pour mettre à jour une famille, reprendre l'URL depuis l'API `css2` avec un
agent utilisateur récent (sinon Google renvoie du TTF au lieu du WOFF2).
