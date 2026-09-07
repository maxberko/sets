import type { Jour } from '../data/seances'
import { JOURS, SEMAINES_BLOC } from '../data/seances'
import { exercice } from '../data'
import { estSerieEfficace, repMax } from './progression'
import type { SessionLog } from './db'

export function jourDe(d: Date): Jour {
  // getDay() renvoie 0 pour dimanche ; le plan commence le lundi.
  return JOURS[(d.getDay() + 6) % 7]!
}

/** Numéro de semaine dans le bloc de 8, borné entre 1 et 8. */
export function semaineDuBloc(debutBloc: string, maintenant = new Date()): number {
  const debut = new Date(`${debutBloc}T00:00:00`)
  if (Number.isNaN(debut.getTime())) return 1
  const jours = Math.floor((maintenant.getTime() - debut.getTime()) / 86_400_000)
  const semaine = Math.floor(jours / 7) + 1
  return Math.min(SEMAINES_BLOC, Math.max(1, semaine))
}

/** Lundi de la semaine contenant la date, en AAAA-MM-JJ. */
export function lundiDe(d: Date): string {
  const copie = new Date(d)
  copie.setHours(0, 0, 0, 0)
  copie.setDate(copie.getDate() - ((copie.getDay() + 6) % 7))
  return copie.toISOString().slice(0, 10)
}

export interface VolumeSemaine {
  /** clé = lundi de la semaine */
  semaine: string
  parProgramme: Record<string, number>
}

/** Séries efficaces par programme et par semaine. Les échauffements ne sont pas comptés. */
export function volumeParSemaine(seances: SessionLog[]): VolumeSemaine[] {
  const carte = new Map<string, Record<string, number>>()
  for (const s of seances) {
    const semaine = lundiDe(new Date(s.debut))
    const bloc = carte.get(semaine) ?? {}
    for (const serie of s.series) {
      if (!estSerieEfficace(serie.rir)) continue
      const ex = exercice(serie.exerciceId)
      if (!ex) continue
      bloc[ex.programme] = (bloc[ex.programme] ?? 0) + 1
    }
    carte.set(semaine, bloc)
  }
  return [...carte.entries()]
    .map(([semaine, parProgramme]) => ({ semaine, parProgramme }))
    .sort((a, b) => a.semaine.localeCompare(b.semaine))
}

export function seriesCetteSemaine(seances: SessionLog[], programme: string, maintenant = new Date()): number {
  const cle = lundiDe(maintenant)
  const semaine = volumeParSemaine(seances).find((v) => v.semaine === cle)
  return semaine?.parProgramme[programme] ?? 0
}

export interface PointTendance {
  date: number
  kg: number
  reps: number
  rm: number
}

/** Meilleure série par séance pour un exercice, pour la courbe de tendance. */
export function tendance(seances: SessionLog[], exerciceId: string): PointTendance[] {
  const points: PointTendance[] = []
  for (const s of seances) {
    let meilleur: PointTendance | undefined
    for (const serie of s.series) {
      if (serie.exerciceId !== exerciceId || !serie.kg || !serie.reps) continue
      const rm = repMax(serie.kg, serie.reps)
      if (!meilleur || rm > meilleur.rm) meilleur = { date: s.debut, kg: serie.kg, reps: serie.reps, rm }
    }
    if (meilleur) points.push(meilleur)
  }
  return points.sort((a, b) => a.date - b.date)
}

export function seancesFaitesLe(seances: SessionLog[], jour: string): SessionLog[] {
  return seances.filter((s) => new Date(s.debut).toISOString().slice(0, 10) === jour && s.fin)
}

export function formatDateCourte(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function formatChrono(secondes: number): string {
  const m = Math.floor(secondes / 60)
  const s = Math.max(0, Math.floor(secondes % 60))
  return `${m}:${String(s).padStart(2, '0')}`
}
