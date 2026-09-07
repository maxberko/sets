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

Les URL de référence de chaque exercice sont collectées dans `content/videos.json` du dossier de conception. Le lecteur n'est pas encore branché : l'exigence est que la vidéo se lise dans l'appli sans jamais ouvrir d'onglet tiers, ce qu'un lecteur YouTube intégré ne permet pas, puisqu'il porte toujours un titre cliquable et un bouton « Regarder sur YouTube » qui ouvre l'application YouTube sur Android. Les fiches affichent donc les étapes, les points clés, le ressenti et les erreurs, et le bloc vidéo indique que le lecteur reste à choisir.

## Sources

Les 50 références citées par les fiches et par l'onglet Science sont dans `src/data/sources.ts`, chacune avec son URL. Le plan complet et le raisonnement derrière le programme sont dans le document de conception.
