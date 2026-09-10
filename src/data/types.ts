export type Programme = 'pecs' | 'abdos' | 'mobilite'
export type Venue = 'salle' | 'tapis'

/** Filled = at least one trial supports doing this. Hollow = clinical convention, no trial. */
export type Evidence = 'pleine' | 'creuse'

export interface VideoRef {
  /**
   * Page de référence : c'est contre elle que les étapes et les points clés ont été
   * vérifiés. Le plus souvent un article (ExRx, ACE, Prehab Guys), donc pas intégrable.
   */
  url: string
  creator: string
  /**
   * Identifiant YouTube, seulement quand une vidéo réellement intégrable existe.
   * Sans lui, la fiche affiche la source sans lecteur : mieux vaut un manque annoncé
   * qu'un cadre vide.
   */
  youtubeId?: string
  /**
   * Chaîne de la vidéo intégrée, quand elle diffère de la source de référence.
   * Les étapes ont pu être vérifiées contre une page ExRx et la démonstration
   * venir d'ailleurs : autant le dire plutôt que de mélanger les deux.
   */
  videoCreator?: string
  /** Secondes de début et de fin du passage utile, quand on les connaît. */
  start?: number
  end?: number
}

export interface Exercise {
  id: string
  nom: string
  programme: Programme
  /** Short line under the title on the sheet. */
  resume: string
  venues: Venue[]
  /** Numbered how-to. */
  etapes: string[]
  /** The three cues that matter. */
  points: string[]
  /** What it should feel like, and where. */
  ressenti: string
  /** Common mistakes and what each one costs. */
  erreurs: string[]
  /** Why it is in the programme. */
  pourquoi: string
  /** Ids from data/sources.ts */
  sources: string[]
  video?: VideoRef
  /** Ordered loading rungs for bodyweight work; index into this list is the current rung. */
  echelle?: string[]
  evidence?: Evidence
  /** Note shown when the club may not have the station. */
  verifierEnSalle?: string
}

export type SlotMode = 'reps' | 'temps' | 'temps-par-cote' | 'reps-par-cote'

export interface Slot {
  id: string
  /** What this slot is for, shown as the small label. */
  role: string
  mode: SlotMode
  series: number
  /** For mode 'reps' */
  reps?: [number, number]
  /** For timed modes, seconds. */
  secondes?: number
  /** For rep-per-side modes. */
  repsParCote?: number
  reposSec: number
  /** Reps in reserve target. */
  rir?: number
  /** Which exercise fills this slot in each venue. */
  salle: string
  tapis: string
}

export interface SessionTemplate {
  id: string
  nom: string
  sousTitre: string
  programme: Programme
  /** Minutes, per venue. Mobility uses the same number for both. */
  minutes: { salle: number; tapis: number }
  /** Mobility never asks where you are. */
  demandeLieu: boolean
  slots: Slot[]
}

export interface Source {
  id: string
  texte: string
  url: string
}
