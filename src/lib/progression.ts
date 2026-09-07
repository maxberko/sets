/**
 * Moteur de progression. Déterministe et lisible : ce que l'appli affiche à l'écran
 * est exactement ce que ces fonctions calculent.
 *
 * Deux échelles de charge indépendantes pour un même créneau :
 *   - en salle, des kilos, en double progression
 *   - sur le tapis, des échelons de difficulté
 * Une série de tapis ne remet jamais à zéro une charge de salle, et l'inverse non plus.
 */

export type Changement = 'monte' | 'baisse' | 'stable'

export interface ResultatProgression {
  valeur: number
  changement: Changement
  message: string
}

export interface SerieFaite {
  reps: number
  /** Kilos en salle, indice d'échelon sur le tapis. */
  charge: number
}

/** Arrondit à un multiple du pas de charge disponible dans la salle. */
export function arrondirAuPas(kg: number, pas: number): number {
  if (pas <= 0) return Math.round(kg)
  return Math.round(kg / pas) * pas
}

/**
 * Double progression. Toutes les séries au sommet de la fourchette : on monte d'un pas.
 * Une série sous le bas de la fourchette deux séances de suite : on redescend de 10 %.
 */
export function prochaineCharge(
  series: SerieFaite[],
  repsCible: [number, number],
  pas: number,
  echecsPrecedents = 0,
  /** Nombre de séries prévues au créneau. Tant qu'elles ne sont pas toutes faites, on ne promet rien. */
  seriesAttendues = series.length,
): ResultatProgression {
  const [min, max] = repsCible
  const chargeActuelle = series.length > 0 ? Math.max(...series.map((s) => s.charge)) : 0
  const attendues = Math.max(seriesAttendues, series.length)

  if (series.length === 0) {
    return { valeur: chargeActuelle, changement: 'stable', message: 'Aucune série enregistrée.' }
  }

  const completes = series.length >= attendues
  const toutesAuSommet = completes && series.every((s) => s.reps >= max)
  if (toutesAuSommet) {
    const valeur = arrondirAuPas(chargeActuelle + pas, pas)
    return {
      valeur,
      changement: 'monte',
      message: `${max} reps sur les ${attendues} séries. La prochaine fois tu passes à ${valeur} kg.`,
    }
  }

  const uneEnDessous = series.some((s) => s.reps < min)
  if (uneEnDessous && completes && echecsPrecedents >= 1) {
    const valeur = Math.max(pas, arrondirAuPas(chargeActuelle * 0.9, pas))
    return {
      valeur,
      changement: 'baisse',
      message: `Deux séances sous ${min} reps. On redescend à ${valeur} kg pour repartir proprement.`,
    }
  }

  if (uneEnDessous) {
    return {
      valeur: chargeActuelle,
      changement: 'stable',
      message: `Sous ${min} reps sur une série. On garde ${chargeActuelle} kg, si ça se répète on allègera.`,
    }
  }

  const manque = attendues - series.filter((s) => s.reps >= max).length
  return {
    valeur: chargeActuelle,
    changement: 'stable',
    message: `Encore ${manque} série${manque > 1 ? 's' : ''} à ${max} reps et tu montes de ${pas} kg.`,
  }
}

/**
 * Échelle de difficulté au poids de corps. Même logique, mais on change d'exercice
 * au lieu d'ajouter du poids.
 */
export function prochainEchelon(
  series: SerieFaite[],
  repsCible: [number, number],
  echelle: string[],
  echelonActuel: number,
  echecsPrecedents = 0,
  seriesAttendues = series.length,
): ResultatProgression {
  const [min, max] = repsCible
  const dernier = echelle.length - 1
  const borne = (n: number) => Math.min(dernier, Math.max(0, n))
  const attendues = Math.max(seriesAttendues, series.length)
  const completes = series.length >= attendues

  if (series.length === 0) {
    return { valeur: echelonActuel, changement: 'stable', message: 'Aucune série enregistrée.' }
  }

  if (completes && series.every((s) => s.reps >= max)) {
    if (echelonActuel >= dernier) {
      return {
        valeur: dernier,
        changement: 'stable',
        message: `Dernier échelon atteint. Ajoute du poids dans le sac plutôt que des répétitions.`,
      }
    }
    const valeur = borne(echelonActuel + 1)
    return {
      valeur,
      changement: 'monte',
      message: `${max} reps partout. Échelon suivant : ${echelle[valeur]}.`,
    }
  }

  if (series.some((s) => s.reps < min) && completes && echecsPrecedents >= 1) {
    const valeur = borne(echelonActuel - 1)
    return {
      valeur,
      changement: 'baisse',
      message: `Deux séances sous ${min} reps. On revient à : ${echelle[valeur]}.`,
    }
  }

  const suivant = echelle[borne(echelonActuel + 1)]
  return {
    valeur: echelonActuel,
    changement: 'stable',
    message: `${max} reps sur toutes les séries et tu passes à : ${suivant}.`,
  }
}

export const PALIERS_MAINTIEN = [20, 30, 45, 60]

/**
 * Maintiens : on ne monte d'un palier qu'après deux séances notées « facile ».
 */
export function prochainMaintien(secondesActuelles: number, facilesConsecutifs: number): ResultatProgression {
  const i = PALIERS_MAINTIEN.indexOf(secondesActuelles)
  const index = i === -1 ? 0 : i
  const dernier = PALIERS_MAINTIEN.length - 1

  if (facilesConsecutifs >= 2 && index < dernier) {
    const valeur = PALIERS_MAINTIEN[index + 1]!
    return { valeur, changement: 'monte', message: `Deux fois « facile ». On passe à ${valeur} s.` }
  }
  if (index >= dernier) {
    return { valeur: secondesActuelles, changement: 'stable', message: `Palier maximum, ${secondesActuelles} s.` }
  }
  const reste = 2 - facilesConsecutifs
  return {
    valeur: secondesActuelles,
    changement: 'stable',
    message: `Encore ${reste} séance${reste > 1 ? 's' : ''} notée${reste > 1 ? 's' : ''} « facile » et tu passes à ${PALIERS_MAINTIEN[index + 1]} s.`,
  }
}

/** Une série compte comme efficace si elle finit à 3 reps ou moins de l'échec. */
export function estSerieEfficace(rir: number | undefined): boolean {
  return rir === undefined || rir <= 3
}

/** Semaine 5 sur 8 : mêmes charges, 60 % des séries. */
export function seriesApresDeload(series: number, semaine: number, semaineDeload: number, ratio: number): number {
  if (semaine !== semaineDeload) return series
  return Math.max(1, Math.round(series * ratio))
}

/** Epley, uniquement pour la courbe de tendance. */
export function repMax(kg: number, reps: number): number {
  if (kg <= 0 || reps <= 0) return 0
  return Math.round(kg * (1 + reps / 30))
}
