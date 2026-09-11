import type { Exercise, SessionTemplate, Slot, Venue } from './types'
import { EXERCICES } from './exercices'
import { MOBILITE } from './mobilite'
import { SEANCES, dechargeConcerne, seriesDeLaSemaine } from './seances'

export * from './types'
export * from './seances'
export { SOURCES, source, sourcesFor } from './sources'

export const TOUS_EXERCICES: Exercise[] = [...EXERCICES, ...MOBILITE]

const PAR_ID = new Map(TOUS_EXERCICES.map((e) => [e.id, e]))
const SEANCE_PAR_ID = new Map(SEANCES.map((s) => [s.id, s]))

export function exercice(id: string): Exercise | undefined {
  return PAR_ID.get(id)
}

export function seance(id: string): SessionTemplate | undefined {
  return SEANCE_PAR_ID.get(id)
}

export function exerciceDuSlot(slot: Slot, venue: Venue): Exercise | undefined {
  return PAR_ID.get(venue === 'salle' ? slot.salle : slot.tapis)
}

/** Séries prévues par programme pour une séance, pour afficher la cible hebdomadaire. */
export function seriesParProgramme(template: SessionTemplate, venue: Venue): Record<string, number> {
  const total: Record<string, number> = {}
  for (const slot of template.slots) {
    const ex = exerciceDuSlot(slot, venue)
    if (!ex) continue
    total[ex.programme] = (total[ex.programme] ?? 0) + slot.series
  }
  return total
}

export interface BlocProgramme {
  programme: string
  exercices: number
  series: number
}

/**
 * Découpe une séance en blocs de programme, dans l'ordre où ils arrivent.
 *
 * Une séance « pecs » n'est pas faite que de pectoraux : `pecs-a` enchaîne huit
 * séries de pectoraux puis huit d'abdominaux. Rien ne l'annonçait avant d'y être.
 */
export function blocsDeSeance(template: SessionTemplate, venue: Venue, semaine?: number): BlocProgramme[] {
  const ordre: string[] = []
  const par: Record<string, BlocProgramme> = {}
  for (const slot of template.slots) {
    const ex = exerciceDuSlot(slot, venue)
    if (!ex) continue
    let bloc = par[ex.programme]
    if (!bloc) {
      bloc = { programme: ex.programme, exercices: 0, series: 0 }
      par[ex.programme] = bloc
      ordre.push(ex.programme)
    }
    bloc.exercices += 1
    const reduite = semaine !== undefined && dechargeConcerne(ex.programme)
    bloc.series += reduite ? seriesDeLaSemaine(slot.series, semaine) : slot.series
  }
  return ordre.map((p) => par[p]!)
}

/**
 * Séries efficaces par muscle et par semaine. Les abdominaux suivent la même
 * fourchette que les pectoraux : aucune étude ne mesure le volume utile qui leur
 * est propre, donc on applique la règle générale (12–20 chez l'homme entraîné,
 * Baz-Valle 2022), comme l'écran Science le dit déjà. L'ancien 8–12 n'avait pas
 * de source et contredisait ce principe ; le programme, lui, en donnait 16.
 */
export const CIBLES_HEBDO: Record<string, [number, number]> = {
  pecs: [12, 20],
  abdos: [12, 20],
}

export const NOM_PROGRAMME: Record<string, string> = {
  pecs: 'Pecs',
  abdos: 'Abdos',
  mobilite: 'Mobilité',
}

export const COULEUR_PROGRAMME: Record<string, string> = {
  pecs: 'var(--pecs)',
  abdos: 'var(--abdos)',
  mobilite: 'var(--mobilite)',
}
