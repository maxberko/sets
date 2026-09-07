import type { Exercise, SessionTemplate, Slot, Venue } from './types'
import { EXERCICES } from './exercices'
import { MOBILITE } from './mobilite'
import { SEANCES } from './seances'

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

export const CIBLES_HEBDO: Record<string, [number, number]> = {
  pecs: [12, 20],
  abdos: [8, 12],
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
