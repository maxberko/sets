import type { SessionTemplate } from './types'
import { seriesApresDeload } from '../lib/progression'

/**
 * Un Slot est un rôle, pas un exercice. « Presse haut des pectoraux, 3 × 8-12 » pèse
 * le même poids dans le volume hebdomadaire, qu'il ait été rempli par un développé
 * incliné en salle ou par des pompes pieds surélevés sur le tapis.
 */
export const SEANCES: SessionTemplate[] = [
  {
    id: 'pecs-a',
    nom: 'Jour du développé incliné',
    sousTitre: 'Pecs A · avec les abdos',
    programme: 'pecs',
    minutes: { salle: 39, tapis: 36 },
    demandeLieu: true,
    slots: [
      {
        id: 'a1', role: 'Haut des pectoraux', mode: 'reps', series: 3, reps: [8, 12], reposSec: 120, rir: 2,
        salle: 'developpe-incline-halteres', tapis: 'pompes-pieds-sureleves',
      },
      {
        id: 'a2', role: 'Presse horizontale', mode: 'reps', series: 3, reps: [6, 10], reposSec: 150, rir: 2,
        salle: 'developpe-couche-halteres', tapis: 'pompes-lestees',
      },
      {
        id: 'a3', role: 'Pectoraux en étirement', mode: 'reps', series: 2, reps: [10, 15], reposSec: 90, rir: 1,
        salle: 'ecarte-poulie', tapis: 'pompes-lentes',
      },
      {
        id: 'a4', role: 'Bas des abdominaux', mode: 'reps', series: 3, reps: [8, 15], reposSec: 90, rir: 1,
        salle: 'releve-jambes-suspendu', tapis: 'crunch-inverse',
      },
      {
        id: 'a5', role: 'Flexion chargée', mode: 'reps', series: 3, reps: [10, 15], reposSec: 90, rir: 1,
        salle: 'crunch-poulie', tapis: 'roulade-avant-bras',
      },
      {
        id: 'a6', role: 'Anti-rotation', mode: 'reps-par-cote', series: 2, repsParCote: 10, reposSec: 60,
        salle: 'pallof-poulie', tapis: 'gainage-touches-epaule',
      },
    ],
  },
  {
    id: 'pecs-b',
    nom: 'Jour du développé couché',
    sousTitre: 'Pecs B · avec les abdos',
    programme: 'pecs',
    minutes: { salle: 38, tapis: 35 },
    demandeLieu: true,
    slots: [
      {
        id: 'b1', role: 'Presse horizontale', mode: 'reps', series: 3, reps: [6, 10], reposSec: 150, rir: 2,
        salle: 'developpe-couche-halteres', tapis: 'pompes-lestees',
      },
      {
        id: 'b2', role: 'Haut des pectoraux', mode: 'reps', series: 2, reps: [8, 12], reposSec: 120, rir: 2,
        salle: 'developpe-incline-halteres', tapis: 'pompes-pieds-sureleves',
      },
      {
        id: 'b3', role: 'Bas des pectoraux', mode: 'reps', series: 2, reps: [8, 15], reposSec: 90, rir: 1,
        salle: 'dips-assistes', tapis: 'dips-chaises',
      },
      {
        id: 'b4', role: 'Bas des abdominaux', mode: 'reps', series: 3, reps: [10, 15], reposSec: 90, rir: 1,
        salle: 'releve-jambes-suspendu', tapis: 'crunch-inverse',
      },
      {
        id: 'b5', role: 'Anti-extension', mode: 'reps', series: 3, reps: [6, 12], reposSec: 90, rir: 1,
        salle: 'roulette-abdominale', tapis: 'roulade-avant-bras',
      },
      {
        id: 'b6', role: 'Obliques', mode: 'temps-par-cote', series: 2, secondes: 40, reposSec: 45,
        salle: 'gainage-lateral-leste', tapis: 'gainage-lateral',
      },
    ],
  },
  {
    id: 'mobilite',
    nom: 'Genoux et hanches',
    sousTitre: "Mobilité · hors de l'eau",
    programme: 'mobilite',
    minutes: { salle: 14, tapis: 14 },
    demandeLieu: false,
    slots: [
      { id: 'm1', role: 'Cheville', mode: 'temps-par-cote', series: 1, secondes: 45, reposSec: 10, salle: 'cheville-genou-mur', tapis: 'cheville-genou-mur' },
      { id: 'm2', role: 'Rotation de hanche', mode: 'temps-par-cote', series: 1, secondes: 45, reposSec: 10, salle: 'hanche-90-90', tapis: 'hanche-90-90' },
      { id: 'm3', role: 'Fléchisseurs de hanche', mode: 'temps-par-cote', series: 1, secondes: 45, reposSec: 10, salle: 'psoas-demi-genou', tapis: 'psoas-demi-genou' },
      { id: 'm4', role: 'Haut du dos', mode: 'reps-par-cote', series: 1, repsParCote: 10, reposSec: 10, salle: 'rotation-thoracique', tapis: 'rotation-thoracique' },
      { id: 'm5', role: 'Moyen fessier', mode: 'reps-par-cote', series: 2, repsParCote: 12, reposSec: 30, salle: 'abduction-hanche', tapis: 'abduction-hanche' },
      { id: 'm6', role: 'Contrôle du genou', mode: 'reps-par-cote', series: 2, repsParCote: 8, reposSec: 45, salle: 'descente-laterale', tapis: 'descente-laterale' },
      { id: 'm7', role: 'Ischio-jambiers', mode: 'reps', series: 2, reps: [5, 5], reposSec: 60, salle: 'nordic-ischios', tapis: 'nordic-ischios' },
      { id: 'm8', role: 'Adducteurs', mode: 'temps-par-cote', series: 2, secondes: 20, reposSec: 30, salle: 'copenhague', tapis: 'copenhague' },
      { id: 'm9', role: 'Réception', mode: 'reps-par-cote', series: 1, repsParCote: 5, reposSec: 30, salle: 'reception-unipodale', tapis: 'reception-unipodale' },
      { id: 'm10', role: 'Tronc', mode: 'reps-par-cote', series: 1, repsParCote: 8, reposSec: 30, salle: 'bird-dog-gainage', tapis: 'bird-dog-gainage' },
      { id: 'm11', role: 'Épaules', mode: 'reps-par-cote', series: 2, repsParCote: 12, reposSec: 30, salle: 'rotation-externe', tapis: 'rotation-externe' },
    ],
  },
]

export type Jour = 'lun' | 'mar' | 'mer' | 'jeu' | 'ven' | 'sam' | 'dim'

export const JOURS: Jour[] = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim']

export const NOM_JOUR: Record<Jour, string> = {
  lun: 'Lundi', mar: 'Mardi', mer: 'Mercredi', jeu: 'Jeudi', ven: 'Vendredi', sam: 'Samedi', dim: 'Dimanche',
}

export const INITIALE_JOUR: Record<Jour, string> = {
  lun: 'L', mar: 'M', mer: 'M', jeu: 'J', ven: 'V', sam: 'S', dim: 'D',
}

/**
 * Trois formules. Elles ne changent pas le contenu des séances, seulement combien on
 * en fait, parce que l'investissement possible varie et qu'un plan qu'on ne tient pas
 * ne vaut rien. Les compromis sont réels et affichés tels quels au choix.
 */
export type Formule = 'legere' | 'standard' | 'soutenue'

export interface DescriptionFormule {
  id: Formule
  nom: string
  seances: number
  minutes: number
  resume: string
  compromis: string
}

export const FORMULES: DescriptionFormule[] = [
  {
    id: 'legere',
    nom: 'Légère',
    seances: 3,
    minutes: 90,
    resume: 'Deux séances de force, une de mobilité.',
    compromis:
      "Le muscle garde ses deux séances hebdomadaires, ce que la recherche demande au minimum. La mobilité passe en dessous de la cible d'amplitude, qui veut cinq minutes par muscle et par semaine.",
  },
  {
    id: 'standard',
    nom: 'Standard',
    seances: 5,
    minutes: 120,
    resume: 'Deux séances de force, trois de mobilité.',
    compromis:
      'Les deux cibles sont tenues : 12 à 20 séries efficaces pour les pectoraux, et assez de temps de maintien pour gagner en amplitude.',
  },
  {
    id: 'soutenue',
    nom: 'Soutenue',
    seances: 6,
    minutes: 160,
    resume: 'Trois séances de force, trois de mobilité.',
    // L'ancien texte affirmait rester dans la fourchette utile alors que la formule
    // la dépasse : 23 séries de pectoraux et 24 d'abdominaux par semaine.
    compromis:
      "Pectoraux et abdominaux passent au-dessus de vingt séries par semaine. Chaque série de plus rapporte un peu moins, sans jamais nuire : tu le paies surtout en temps et en récupération.",
  },
]

const PLANS: Record<Formule, Record<Jour, string[]>> = {
  legere: {
    lun: ['pecs-a'],
    mar: [],
    mer: [],
    jeu: ['pecs-b'],
    ven: [],
    sam: ['mobilite'],
    dim: [],
  },
  standard: {
    lun: ['pecs-a'],
    mar: ['mobilite'],
    mer: [],
    jeu: ['pecs-b'],
    ven: ['mobilite'],
    sam: ['mobilite'],
    dim: [],
  },
  soutenue: {
    lun: ['pecs-a'],
    mar: ['mobilite'],
    mer: ['pecs-b'],
    jeu: ['mobilite'],
    ven: ['pecs-a'],
    sam: ['mobilite'],
    dim: [],
  },
}

export function planDe(id: Formule): Record<Jour, string[]> {
  return PLANS[id] ?? PLANS.standard
}

export function descriptionFormule(id: Formule): DescriptionFormule {
  return FORMULES.find((f) => f.id === id) ?? FORMULES[1]!
}

/** Conservé pour les écrans qui n'ont pas besoin de la formule. */
export const PLAN = PLANS.standard

export const SEMAINES_BLOC = 8
export const SEMAINE_DELOAD = 5
/** Le deload garde les charges et coupe le volume. */
export const RATIO_DELOAD = 0.6

export function estSemaineDeDecharge(semaine: number): boolean {
  return semaine === SEMAINE_DELOAD
}

/**
 * La décharge ne concerne que le travail chargé. La mobilité n'a pas de charge à
 * relâcher, et ses gains suivent le temps de maintien hebdomadaire (Thomas 2018) :
 * la couper retirerait le stimulus sans rien récupérer en échange.
 */
export function dechargeConcerne(programme: string): boolean {
  return programme !== 'mobilite'
}

/**
 * Séries d'un créneau pour une semaine donnée du bloc. Seul point d'entrée de la
 * décharge : `seriesApresDeload` était écrite et testée mais aucun écran ne
 * l'appelait, si bien que la semaine 5 se faisait à plein volume.
 */
export function seriesDeLaSemaine(series: number, semaine: number): number {
  return seriesApresDeload(series, semaine, SEMAINE_DELOAD, RATIO_DELOAD)
}
