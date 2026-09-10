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

## Ouvert, non traité

- Gouttière blanche observée sur téléphone autour du champ coloré. Le DOM mesure
  pourtant la fenêtre entière (375 × 812 pile) dans le panneau de
  prévisualisation, donc la cause n'est pas identifiée. Suspects : le
  `max-width: 480px` posé sur `.ecran` et `.entete` dans `src/styles/tokens.css`.
- Sous-titres automatiques anglais visibles sur certaines vidéos malgré
  `cc_load_policy=0` (vu sur le développé couché). Le paramètre ne suffit pas
  toujours.
- Contrôle en salle des six équipements Basic-Fit (Biarritz), à faire sur place.
- Échelon de départ des pompes non réglable à la main ; le moteur se corrige en
  deux séances.
