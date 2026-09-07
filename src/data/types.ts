export type Programme = 'pecs' | 'abdos' | 'mobilite'
export type Venue = 'salle' | 'tapis'

/** Filled = at least one trial supports doing this. Hollow = clinical convention, no trial. */
export type Evidence = 'pleine' | 'creuse'

export interface VideoRef {
  /** Where the clip lives. The display method is not settled yet; see README. */
  url: string
  creator: string
  /** Seconds into the video where the teaching segment starts / ends, when known. */
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
