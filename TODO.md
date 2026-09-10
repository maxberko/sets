# À faire

Liste tenue au fil des retours d'usage. Rien ici n'est engagé : ce sont des
constats à instruire, pas des décisions prises.

## Lecteur de mobilité

### Réorganiser le bloc de comptage

Écran : `src/ecrans/LecteurMobilite.tsx`, en haut du lecteur.

Aujourd'hui le compte est un chiffre géant (`10`) et l'unité tombe dans une
petite ligne en dessous, mêlée au côté : `répétitions · côté droit`. La paire
« 8 répétitions » ne se lit pas comme une seule information.

À reprendre : la composition du bloc, pour que le nombre et son unité forment un
ensemble. Aucune solution retenue pour l'instant.

### Mettre le côté dans le titre de l'exercice

Écran : même fichier.

Le côté travaillé vit aujourd'hui dans la ligne de dose, à côté de l'unité. Il
devrait faire partie du nom de l'exercice :

    Descente latérale — côté droit
    Descente latérale — côté gauche

Concerne les exercices unilatéraux (`repsParCote`, et les maintiens joués côté
droit puis côté gauche).

## Fin de séance

### Féliciter avec une vidéo de surf

Quand tous les exercices d'une séance sont validés, l'écran de fin doit récompenser
plutôt que se contenter de renvoyer à l'accueil. Une vidéo de surf, comme
félicitation.

À instruire : d'où vient la vidéo. Le composant `Demonstration`
(`src/composants/demonstration.tsx`) sait déjà jouer un extrait YouTube sans
quitter l'application, mais ces vidéos-là sont des démonstrations techniques,
créditées et vérifiées par `npm run check:videos` — une vidéo de surf n'entre pas
dans ce cadre et demandera sa propre source et son propre crédit.

Concerne le lecteur de force (`terminer()`, qui redirige aujourd'hui vers `/`) et
`FinMobilite` dans `src/ecrans/LecteurMobilite.tsx`, qui a déjà un écran de fin.

## Navigation

### Revoir la barre d'onglets

Fichier : `BarreOnglets` dans `src/composants/communs.tsx`.

Deux sujets : la navigation elle-même, et l'espacement entre les entrées du menu.
Le critique de design l'avait relevé indépendamment — « Aujourd'hui » et
« Programme » se touchent presque alors que « Suivi » et « Science » flottent dans
de larges intervalles, parce que les quatre colonnes sont d'égale largeur alors que
les libellés n'ont pas du tout la même longueur.

### Mélanger Aujourd'hui et Suivi à l'ouverture

L'écran d'arrivée doit combiner les deux : d'abord ce qu'il y a à faire
aujourd'hui, ensuite le suivi. Aujourd'hui ce sont deux onglets séparés
(`src/ecrans/Aujourdhui.tsx` et `src/ecrans/Suivi.tsx`).

À trancher : ce que devient l'onglet Suivi s'il est absorbé, et quelle part du
suivi mérite d'être vue à chaque ouverture plutôt qu'une fois par semaine.

## Ouvert, non traité

- Gouttière blanche observée sur téléphone autour du champ coloré. Le DOM mesure
  pourtant la fenêtre entière (375 × 812 pile) dans le panneau de
  prévisualisation, donc la cause n'est pas identifiée. Suspects : le
  `max-width: 480px` posé sur `.ecran` et `.entete` dans `src/styles/tokens.css`.
- Sous-titres automatiques anglais visibles sur certaines vidéos malgré
  `cc_load_policy=0` (vu sur le développé couché). Le paramètre ne suffit pas
  toujours.
- `Suivi.tsx:52` écrit `rgba(62,146,200,0.25)` en dur : un doublon du bleu
  `--mobilite` à 25 %. Il correspond aujourd'hui, mais ne suivra pas si le jeton
  change.
- Contrôle en salle des six équipements Basic-Fit (Biarritz), à faire sur place.
- Échelon de départ des pompes non réglable à la main ; le moteur se corrige en
  deux séances.
