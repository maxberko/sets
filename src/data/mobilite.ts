import type { Exercise } from './types'

/**
 * La séance de mobilité, hors de l'eau, tapis uniquement.
 * evidence 'pleine' = au moins un essai clinique soutient le fait de faire ça.
 * evidence 'creuse' = usage clinique et raisonnement anatomique, pas d'essai.
 * Six pleines, cinq creuses. Rien ici n'est vendu comme de la prévention si le point est creux.
 */
export const MOBILITE: Exercise[] = [
  {
    id: 'cheville-genou-mur',
    nom: 'Cheville, genou au mur',
    programme: 'mobilite',
    resume: 'Dorsiflexion de cheville',
    venues: ['tapis'],
    evidence: 'creuse',
    etapes: [
      'Place le pied à une largeur de main du mur, pied bien à plat.',
      'Avance le genou vers le mur en gardant le talon collé au sol.',
      'Si le genou touche sans que le talon décolle, recule le pied et recommence.',
      'Dix allers-retours lents, puis tiens trente secondes en position basse.',
    ],
    points: ['Le talon ne décolle jamais', 'Le genou part vers l\'avant, pas vers l\'intérieur', 'Pied bien aligné'],
    ressenti: "Un étirement à l'arrière de la cheville et dans le mollet.",
    erreurs: ['Laisser le talon se soulever.', 'Laisser le genou partir vers l\'intérieur.', 'Forcer jusqu\'à la douleur.'],
    pourquoi:
      "La cheville alimente le genou. À la réception, pour chaque tranche de 10 % de dorsiflexion non utilisée, l'abduction du genou augmente de 3,2 degrés. Le drill lui-même n'a pas été testé, mais le lien entre cheville et genou, si.",
    sources: ['cheville-genou'],
    video: { url: 'https://theprehabguys.com/unlock-ankle-mobility/', creator: 'The Prehab Guys', youtubeId: 'YH7xjrkq7ic', videoCreator: 'The Basketball Doctors' },
  },
  {
    id: 'hanche-90-90',
    nom: 'Hanche 90/90',
    programme: 'mobilite',
    resume: 'Rotation interne et externe de hanche',
    venues: ['tapis'],
    evidence: 'creuse',
    etapes: [
      'Assis au sol, une jambe devant à 90 degrés, l\'autre sur le côté à 90 degrés.',
      'Buste droit, mains au sol derrière toi si nécessaire.',
      'Bascule d\'un côté à l\'autre en faisant pivoter les deux hanches, huit fois.',
      'Termine par trente secondes de maintien de chaque côté, buste penché en avant.',
    ],
    points: ['Les deux fesses restent au sol autant que possible', 'Buste droit avant de pencher', 'Mouvement lent et contrôlé'],
    ressenti: "L'extérieur de la hanche avant et l'intérieur de la hanche arrière.",
    erreurs: [
      'Forcer en penchant le buste avant que la hanche ne tourne.',
      'Arrondir le bas du dos pour aller plus loin.',
      'Continuer malgré un pincement à l\'avant de la hanche.',
    ],
    pourquoi:
      "Les virages demandent de la rotation interne et externe de hanche, et le conflit fémoro-acétabulaire représente environ deux tiers des blessures de hanche en surf. Aucun essai n'a testé ce drill : il repose sur l'anatomie et l'usage clinique.",
    sources: ['surf-genou-hanche', 'fai-squat'],
    video: { url: 'https://library.theprehabguys.com/vimeo-video/90-90-hip-stretch/', creator: 'The Prehab Guys', youtubeId: 'Y-L0s5uSQ-E', videoCreator: 'E3 Rehab Exercise Library' },
  },
  {
    id: 'psoas-demi-genou',
    nom: 'Psoas en demi-genou',
    programme: 'mobilite',
    resume: 'Fléchisseurs de hanche',
    venues: ['tapis'],
    evidence: 'creuse',
    etapes: [
      'En fente, un genou au sol, l\'autre pied devant à 90 degrés.',
      'Serre la fesse du côté au sol et rentre le bassin sous toi.',
      'Avance très légèrement le bassin, sans cambrer le bas du dos.',
      'Tiens quarante-cinq secondes de chaque côté.',
    ],
    points: [
      'La fesse arrière reste serrée pendant tout le maintien',
      'Le bassin est rentré, pas basculé en avant',
      'Le bas du dos ne se creuse pas',
    ],
    ressenti: "L'avant de la hanche et le haut de la cuisse du côté au sol.",
    erreurs: [
      'Cambrer le bas du dos, ce qui donne la sensation d\'étirement sans étirer le psoas.',
      'Relâcher la fesse arrière.',
      'Avancer trop loin d\'un coup.',
    ],
    pourquoi:
      "La rame maintient les hanches en position raccourcie pendant la moitié d'une session. La durée de maintien vient de la littérature sur l'amplitude, mais l'exercice lui-même relève de l'usage clinique.",
    sources: ['thomas2018', 'delphi2025'],
    video: { url: 'https://squatuniversity.com/active-hip-flexor-stretch/', creator: 'Squat University', youtubeId: 'vIDzsqJiAIo', videoCreator: 'E3 Rehab Exercise Library' },
  },
  {
    id: 'rotation-thoracique',
    nom: 'Rotation thoracique, open book',
    programme: 'mobilite',
    resume: 'Rotation du haut du dos',
    venues: ['tapis'],
    evidence: 'creuse',
    etapes: [
      'Sur le côté, genoux repliés à 90 degrés, bras tendus devant toi l\'un sur l\'autre.',
      'Fais glisser la main du dessus le long de l\'autre bras, puis ouvre vers l\'arrière.',
      'Suis la main du regard, en gardant les genoux collés au sol.',
      'Reviens lentement. Dix ouvertures de chaque côté.',
    ],
    points: ['Les genoux restent au sol', 'Le regard suit la main', 'La rotation vient du haut du dos, pas des lombaires'],
    ressenti: 'Le haut du dos et le devant de la poitrine qui s\'ouvrent.',
    erreurs: ['Laisser les genoux se décoller, ce qui déplace la rotation vers le bas du dos.', 'Aller trop vite.', 'Forcer en fin d\'amplitude.'],
    pourquoi:
      "Les revues sur l'épaule du surfeur recommandent d'améliorer l'extension et la rotation thoraciques, parce que la rame se fait en extension prolongée. Le drill précis n'a pas été testé.",
    sources: ['langenberg2021', 'hanchard2021'],
    video: { url: 'https://barbellrehab.com/three-effective-thoracic-rotation-drills/', creator: 'Barbell Rehab', youtubeId: '917w2gqZwZQ', videoCreator: 'Petroski Physio' },
  },
  {
    id: 'abduction-hanche',
    nom: 'Abduction de hanche allongé',
    programme: 'mobilite',
    resume: 'Moyen fessier',
    venues: ['tapis'],
    evidence: 'pleine',
    etapes: [
      'Allongé sur le côté, jambes tendues, une main sous la tête.',
      'Bascule le bassin très légèrement vers l\'avant.',
      'Monte la jambe du dessus vers le plafond, talon en premier, sans qu\'elle parte en avant.',
      'Redescends en deux secondes. Douze répétitions de chaque côté.',
    ],
    points: ['Le talon monte en premier', 'La jambe reste dans l\'axe du corps', 'Le bassin ne bascule pas en arrière'],
    ressenti: "Le côté de la hanche, en haut de la fesse. Si tu sens l'avant de la cuisse, la jambe part trop en avant.",
    erreurs: ['Laisser la jambe partir devant.', 'Rouler le bassin en arrière.', 'Monter trop haut.'],
    pourquoi:
      "C'est l'exercice qui a les meilleures preuves de tout le programme mobilité. Les méta-analyses sur la douleur fémoro-patellaire montrent que renforcer les abducteurs et les rotateurs externes de hanche en plus du genou bat le travail du genou seul, et que les personnes concernées sont mesurablement plus faibles dans ces deux directions.",
    sources: ['halabchi2025', 'jospt2018'],
    video: { url: 'https://theprehabguys.com/shoulder-strengthening-exercises-for-surfers/', creator: 'The Prehab Guys', youtubeId: '-rDiQXjeXO0', videoCreator: 'The Prehab Guys' },
  },
  {
    id: 'descente-laterale',
    nom: 'Descente latérale',
    programme: 'mobilite',
    resume: 'Contrôle du genou sur une jambe',
    venues: ['tapis'],
    evidence: 'pleine',
    etapes: [
      'Debout sur une marche ou un livre épais, un pied dans le vide sur le côté.',
      'Descends lentement en pliant le genou d\'appui, jusqu\'à effleurer le sol du talon.',
      'Le genou reste aligné au-dessus du deuxième orteil, il ne rentre pas vers l\'intérieur.',
      'Remonte. Trois secondes à la descente, huit répétitions par jambe.',
    ],
    points: [
      'Le genou ne rentre jamais vers l\'intérieur',
      'Le bassin reste horizontal',
      'Trois secondes à la descente',
    ],
    ressenti: 'La cuisse et la fesse de la jambe d\'appui. Le genou doit rester indolore.',
    erreurs: [
      'Laisser le genou partir vers l\'intérieur, exactement ce qu\'on veut éviter.',
      'Laisser la hanche opposée s\'affaisser.',
      'Descendre trop vite.',
    ],
    pourquoi:
      "Le contrôle sur une jambe est au cœur des programmes FIFA 11+ et PEP, qui ont fait baisser les blessures de 30 à 46 % et les ruptures du ligament croisé antérieur de près de 88 % sur une saison. C'est aussi la position qui reproduit la réception d'un aérien.",
    sources: ['fifa11plus', 'pep', 'hohn2018'],
    video: { url: 'https://library.theprehabguys.com/vimeo-video/lateral-step-down-to-single-leg-balance-2/', creator: 'The Prehab Guys', youtubeId: 'AO6lZFFrBdg', videoCreator: 'The Strength Guys' },
  },
  {
    id: 'curl-serviette',
    nom: 'Curl ischios sur serviette',
    programme: 'mobilite',
    resume: 'Chaîne postérieure en excentrique · une serviette',
    venues: ['tapis'],
    // Le point passe de plein à creux en même temps que l'exercice change : le
    // Nordic avait des essais de prévention derrière lui, le curl glissé n'a que
    // de l'EMG. Personne n'a comparé les deux dans un essai d'entraînement.
    evidence: 'creuse',
    echelle: [
      'Pont ischios, talons sur la serviette',
      'Curl deux jambes, descente lente',
      'Curl deux jambes, descente une jambe',
      'Curl une jambe, complet',
    ],
    etapes: [
      'Allonge-toi sur le dos, talons posés sur une serviette, sur un sol lisse.',
      'Monte le bassin jusqu\'à aligner genoux, hanches et épaules.',
      'Laisse glisser les talons loin de toi, le plus lentement possible, sans que le bassin ne tombe.',
      'Ramène les talons en tirant avec l\'arrière des cuisses. Cinq répétitions.',
    ],
    points: [
      'Le bassin reste haut du début à la fin',
      'La descente est lente, c\'est elle qui fait le travail',
      'On s\'arrête avant que le bas du dos ne creuse',
    ],
    ressenti: "L'arrière des cuisses qui travaille en s'allongeant, et les fessiers qui tiennent le bassin en l'air.",
    erreurs: ['Laisser le bassin retomber pendant la descente.', 'Glisser trop loin dès la première séance.', 'Tirer avec le bas du dos pour revenir.'],
    pourquoi:
      "Le curl glissé dépasse 90 % de la contraction maximale sur les deux chefs des ischio-jambiers, au même rang que le Nordic — mais c'est de l'EMG, pas un essai. Il remplace ici le Nordic, qui demandait quelqu'un pour tenir les chevilles : la méta-analyse 2026 ne distingue aucun programme des autres et montre que tout se joue sur l'observance, or un exercice qu'on saute ne protège personne.",
    sources: ['tsaklis2015', 'observance2026', 'impellizzeri2021'],
    // Cet exercice n'avait aucun visuel : ni dessin — la bibliothèque n'a qu'un
    // banc à chevilles — ni vidéo. `creator` désigne ici la vidéo elle-même et
    // non une page de référence : les étapes n'ont pas été vérifiées contre elle,
    // et la fiche n'affiche donc pas « étapes vérifiées contre ».
    video: { url: 'https://www.youtube.com/watch?v=6tUMNj1S-rg', creator: 'Alex Bunt', youtubeId: '6tUMNj1S-rg' },
  },
  {
    id: 'copenhague',
    nom: 'Gainage Copenhague',
    programme: 'mobilite',
    resume: 'Adducteurs',
    venues: ['tapis'],
    evidence: 'pleine',
    echelle: ['Genou du dessus en appui', 'Pied du dessus en appui, jambe pliée', 'Jambe du dessus tendue'],
    etapes: [
      'Sur le côté, coude sous l\'épaule, pied du dessus posé sur une chaise.',
      'Monte le bassin jusqu\'à aligner les chevilles et les épaules.',
      'La jambe du dessous reste décollée du sol.',
      'Tiens vingt secondes de chaque côté.',
    ],
    points: ['Coude sous l\'épaule', 'Bassin haut, ligne droite', 'La jambe du dessous ne touche pas le sol'],
    ressenti: "L'intérieur de la cuisse du dessus, qui tient tout le poids.",
    erreurs: ['Laisser le bassin descendre.', 'Poser la jambe du dessous.', 'Commencer directement par la version tendue.'],
    pourquoi:
      "Le renforcement des adducteurs fait partie des programmes neuromusculaires qui réduisent les blessures. Sur une planche, ce sont eux qui tiennent l'écart entre les deux appuis.",
    sources: ['fifa11plus', 'lauersen2014'],
    video: { url: 'https://theprehabguys.com/why-you-should-do-copenhagen-planks/', creator: 'The Prehab Guys', youtubeId: 'aDsaGBnvDQo', videoCreator: 'E3 Rehab Exercise Library' },
  },
  {
    id: 'reception-unipodale',
    nom: 'Réception sur une jambe',
    programme: 'mobilite',
    resume: 'Amorti et contrôle à la réception',
    venues: ['tapis'],
    evidence: 'pleine',
    etapes: [
      'Debout sur une jambe, saute vingt centimètres sur le côté.',
      'Reçois sur la même jambe, genou fléchi, en amortissant sans bruit.',
      'Fige la position trois secondes avant de repartir.',
      'Cinq réceptions par jambe.',
    ],
    points: [
      'La réception doit être silencieuse',
      'Le genou fléchit et reste aligné sur le pied',
      'On tient trois secondes avant de repartir',
    ],
    ressenti: 'La cuisse, la fesse et la cheville qui absorbent. Rien ne doit claquer dans le genou.',
    erreurs: [
      'Recevoir jambe tendue.',
      'Laisser le genou rentrer vers l\'intérieur à l\'atterrissage.',
      'Enchaîner sans figer la position.',
    ],
    pourquoi:
      "La réception est le mécanisme le plus souvent cité pour les blessures de genou en surf, et le genou est la première articulation blessée chez les professionnels. Les drills de réception sont au cœur des programmes 11+ et PEP.",
    sources: ['hohn2018', 'fifa11plus', 'pep'],
    video: { url: 'https://library.theprehabguys.com/vimeo-video/lateral-step-down-to-single-leg-balance-2/', creator: 'The Prehab Guys', youtubeId: 'cFJcld7hS8Y', videoCreator: 'Next Level Physical Therapy' },
  },
  {
    id: 'bird-dog-gainage',
    nom: 'Bird dog et gainage latéral',
    programme: 'mobilite',
    resume: 'Tronc et bas du dos',
    venues: ['tapis'],
    evidence: 'pleine',
    etapes: [
      'À quatre pattes, tends le bras droit et la jambe gauche à l\'horizontale.',
      'Le bassin ne bascule pas : imagine un verre d\'eau posé sur le bas du dos.',
      'Tiens trois secondes, reviens, alterne. Huit de chaque côté.',
      'Enchaîne avec trente secondes de gainage latéral de chaque côté.',
    ],
    points: ['Le bassin reste horizontal', 'Le bras et la jambe montent à l\'horizontale, pas plus haut', 'Nuque dans l\'axe'],
    ressenti: 'Le bas du dos et la sangle abdominale qui stabilisent, sans douleur lombaire.',
    erreurs: ['Basculer le bassin.', 'Monter la jambe trop haut et cambrer.', 'Aller vite.'],
    pourquoi:
      "Le bas du dos est le premier site de blessure chronique chez les surfeurs, devant l'épaule, et le mécanisme le plus cité est la rame prolongée. Ces deux exercices viennent du protocole de McGill et entraînent la stabilité sans charger le disque en flexion.",
    sources: ['hanchard2021', 'mcgill', 'fifa11plus'],
    video: { url: 'https://squatuniversity.com/2018/06/21/the-mcgill-big-3-for-core-stability/', creator: 'Squat University', youtubeId: 'egKWoMZ6cXM', videoCreator: 'E3 Rehab Exercise Library' },
  },
  {
    id: 'rotation-externe',
    nom: 'Rotation externe d\'épaule',
    programme: 'mobilite',
    resume: 'Rotateurs externes · un élastique léger',
    venues: ['tapis'],
    evidence: 'creuse',
    etapes: [
      'Coude au corps, plié à 90 degrés, avant-bras devant le ventre.',
      'Élastique léger accroché à hauteur de coude, ouvre l\'avant-bras vers l\'extérieur.',
      'Le coude reste collé au buste pendant tout le mouvement.',
      'Douze répétitions de chaque côté, lentement.',
    ],
    points: ['Le coude ne quitte pas le buste', 'Le mouvement vient de l\'épaule, pas du poignet', 'Retour contrôlé'],
    ressenti: "L'arrière de l'épaule qui travaille. Rien ne doit pincer sur le dessus.",
    erreurs: ['Décoller le coude.', 'Faire pivoter tout le buste.', 'Utiliser un élastique trop dur.'],
    pourquoi:
      "La rame est propulsée par les rotateurs internes, et les surfeurs présentent un déficit de rotation externe. Les revues recommandent de renforcer les rotateurs externes, mais aucun essai n'a testé ce programme chez des surfeurs, donc le point reste creux. C'est le seul exercice de l'appli qui demande du matériel à la maison : sans élastique, il ne reste que le poids de l'avant-bras, trop peu pour charger une épaule entraînée.",
    sources: ['langenberg2021', 'furness2018'],
    video: { url: 'https://theprehabguys.com/shoulder-strengthening-exercises-for-surfers/', creator: 'The Prehab Guys', youtubeId: 'UyBb2-bP0CU', videoCreator: 'E3 Rehab Exercise Library' },
  },
]
