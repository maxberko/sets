# Sets

Programme de force et de mobilité, basé sur les preuves. Application web installable sur Android, hors ligne, sans compte et sans serveur. Toutes les données restent sur le téléphone.

## Ce que fait l'appli

Deux séances de force par semaine pour les pectoraux et les abdominaux, trois séances de mobilité de 14 minutes pour les genoux et les hanches. Un bloc dure 8 semaines, avec un allègement en semaine 5.

Rien n'est calé sur les sessions de surf : l'appli ne demande jamais quand tu vas à l'eau.

## Les deux idées qui structurent le code

**Le créneau, pas l'exercice.** Une séance est une liste de `Slot`. « Presse haut des pectoraux, 3 × 8-12 » est un rôle qui pèse le même poids dans le volume hebdomadaire, qu'il soit rempli par un développé incliné en salle ou par des pompes pieds surélevés sur le tapis. Chaque séance de force commence par une question, salle ou tapis, et les deux réponses produisent le même nombre de séries efficaces. Les kilos et les échelons de difficulté progressent séparément : une série de tapis ne remet jamais à zéro une charge de salle.

**Rien ne démarre tout seul.** Le chrono d'un exercice de mobilité attend un appui sur
« Démarrer » : on se met en place, puis on lance. Seul le repos entre deux séries part
automatiquement, puisqu'il commence quand la série finit.

**Le point de preuve.** Chaque exercice de mobilité porte un point plein quand au moins un essai clinique soutient le fait de le faire, un point creux quand il ne repose que sur l'anatomie et l'usage clinique. Six pleins, cinq creux. Aucun exercice à point creux n'est présenté comme de la prévention. C'est ce qui rend la promesse « basé sur les preuves » vérifiable au lieu d'être décorative.

## Les trois formules

Elles décident du **nombre** de séances par semaine, jamais de leur contenu :

| Formule | Séances | Par semaine | Compromis assumé |
|---|---|---|---|
| Légère | 3 | ~1 h 30 | Les pectoraux gardent leurs deux séances, plancher demandé par la recherche. La mobilité tombe sous la cible d'amplitude. |
| Standard | 5 | ~2 h | Les deux cibles sont tenues. |
| Soutenue | 6 | ~2 h 40 | Volume pectoraux vers le haut de la fourchette utile ; rien de plus lourd n'est proposé, le gain par série cesse d'y monter. |

Le plan est de la donnée écrite à la main, donc `src/data/formules.test.ts` vérifie que
chaque formule contient bien le nombre de séances qu'elle annonce, ne référence que des
séances existantes, garde les pectoraux au moins deux fois par semaine, laisse un jour de
repos et ne colle jamais deux séances de force le même jour.

## Premier lancement

Deux écrans. Le premier dit ce que fait l'appli et sur quoi elle s'appuie. Le second fait
choisir une formule. Rien d'autre n'est demandé : l'échelle de pompes part d'un échelon
moyen que le moteur corrige en deux séances, et l'équipement du club vit dans les réglages,
parce qu'on ne connaît pas son club avant d'y être allé.

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
| `scripts/verifier-videos.mjs` | Contrôle que chaque vidéo existe, est publique et autorise l'intégration. |

## Déploiement

Pousser sur `main` déclenche le workflow. Dans les réglages du dépôt, mettre Pages sur « GitHub Actions ». L'appli est servie sous `/sets/` ; pour un domaine personnalisé, construire avec `BASE_PATH=/`.

## Vidéos

La vidéo se lit **dans la page**, dans une iframe `youtube-nocookie`, sans vidéos suggérées
et sans plein écran forcé : appuyer sur lecture ne quitte pas l'appli. Sur la fiche, rien
n'est chargé avant l'appui. Dans le lecteur de mobilité elle est présente d'emblée, parce
que c'est là qu'on regarde le mouvement avant de se lancer. Réserve honnête : la barre de
contrôle de YouTube porte un lien « Regarder sur YouTube » que leurs conditions interdisent
de masquer.

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
