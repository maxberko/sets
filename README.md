# Sets

Programme de force et de mobilité, basé sur les preuves. Application web installable sur Android, hors ligne, sans compte et sans serveur. Toutes les données restent sur le téléphone.

## Ce que fait l'appli

Deux séances de force par semaine pour les pectoraux et les abdominaux, trois séances de mobilité de 14 minutes pour les genoux et les hanches. Un bloc dure 8 semaines, avec un allègement en semaine 5.

Rien n'est calé sur les sessions de surf : l'appli ne demande jamais quand tu vas à l'eau.

## Les deux idées qui structurent le code

**Le créneau, pas l'exercice.** Une séance est une liste de `Slot`. « Presse haut des pectoraux, 3 × 8-12 » est un rôle qui pèse le même poids dans le volume hebdomadaire, qu'il soit rempli par un développé incliné en salle ou par des pompes pieds surélevés sur le tapis. Chaque séance de force commence par une question, salle ou tapis, et les deux réponses produisent le même nombre de séries efficaces. Les kilos et les échelons de difficulté progressent séparément : une série de tapis ne remet jamais à zéro une charge de salle.

**Le point de preuve.** Chaque exercice de mobilité porte un point plein quand au moins un essai clinique soutient le fait de le faire, un point creux quand il ne repose que sur l'anatomie et l'usage clinique. Six pleins, cinq creux. Aucun exercice à point creux n'est présenté comme de la prévention. C'est ce qui rend la promesse « basé sur les preuves » vérifiable au lieu d'être décorative.

## Développement

```bash
npm install
npm run dev      # http://localhost:5173/sets/
npm test         # moteur de progression
npm run build    # vérifie les types puis construit dist/
```

`npm run build` échoue si les types ne passent pas. Le déploiement GitHub Actions rejoue types, tests et build avant de publier.

## Structure

| Dossier | Contenu |
|---|---|
| `src/data/` | Le contenu : exercices, séances, sources. C'est là que vit la connaissance, pas dans les composants. |
| `src/lib/progression.ts` | Le moteur de progression, pur et testé. Ce que l'écran affiche est exactement ce qu'il calcule. |
| `src/lib/db.ts` | IndexedDB via `idb-keyval`, plus export et import d'une sauvegarde JSON. |
| `src/ecrans/` | Un fichier par écran. |
| `scripts/icones.mjs` | Génère les icônes PNG sans dépendance, à partir de zlib. |

## Déploiement

Pousser sur `main` déclenche le workflow. Dans les réglages du dépôt, mettre Pages sur « GitHub Actions ». L'appli est servie sous `/sets/` ; pour un domaine personnalisé, construire avec `BASE_PATH=/`.

## Vidéos

La vidéo se lit **dans la page**, dans une iframe `youtube-nocookie`, sans vidéos suggérées
et sans plein écran forcé : appuyer sur lecture ne quitte pas l'appli. Rien n'est chargé
avant l'appui, sinon chaque ouverture de fiche irait chercher le lecteur de Google, plus
lourd que toute l'appli. Réserve honnête : la barre de contrôle de YouTube porte un lien
« Regarder sur YouTube » que leurs conditions interdisent de masquer.

**26 exercices sur 28 ont une démonstration.** Deux en sont volontairement dépourvus,
`dips-chaises` et `roulade-avant-bras` : les seules vidéos trouvées montraient un autre
mouvement que les étapes écrites, et une vidéo qui contredit la consigne est pire qu'une
absence annoncée. Ces fiches le disent et nomment la source.

`creator` et `videoCreator` sont deux choses différentes, et le champ le reste exprès :
les étapes ont souvent été vérifiées contre une page ExRx ou ACE tandis que la
démonstration vient d'ailleurs (Renaissance Periodization, E3 Rehab, The Prehab Guys,
Athlean-X). La fiche affiche les deux.

Trois vidéos longues portent un `start` et un `end` en secondes, pris dans les chapitres
publiés par la chaîne, pour ne lire que le passage utile. Aucun horodatage n'a été deviné :
sans chapitre, la vidéo démarre au début.

### Vérifier le catalogue

```bash
npm run check:videos
```

Contrôle que chaque `youtubeId` pointe sur une vidéo qui existe, publique, autorisée hors
de YouTube, et que la chaîne correspond à celle annoncée. Sans ce contrôle, une référence
erronée donne un cadre noir dans l'appli, sans message d'erreur. À relancer après toute
modification du catalogue : les vidéos sont supprimées ou passent en privé sans prévenir.

## Sources

Les 50 références citées par les fiches et par l'onglet Science sont dans `src/data/sources.ts`, chacune avec son URL. Le plan complet et le raisonnement derrière le programme sont dans le document de conception.
