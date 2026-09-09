/**
 * Où reprendre une séance à partir des étapes déjà enregistrées.
 *
 * Sert à deux choses qui se ressemblent :
 *  - reprendre une séance interrompue (téléphone verrouillé, appli tuée) ;
 *  - revenir sur le lecteur après un aller-retour vers une fiche d'exercice,
 *    puisque le composant est démonté puis remonté et perdrait sa position.
 *
 * Les deux lecteurs ne découpent pas une série de la même façon : le lecteur de
 * force enregistre une entrée par série, celui de mobilité en enregistre une par
 * côté. D'où `etapesParSerie`, que l'appelant fournit.
 */

export interface CreneauReprise {
  id: string
  series: number
  /** 1 pour une série simple, 2 pour un exercice fait des deux côtés. */
  etapesParSerie: number
}

export interface Position {
  /** Index du créneau dans la séance. */
  creneau: number
  /** Index de la série dans le créneau. */
  serie: number
  /** 0 = premier côté (ou série simple), 1 = deuxième côté. */
  etape: number
}

const DEBUT: Position = { creneau: 0, serie: 0, etape: 0 }

export function positionDeReprise(creneaux: CreneauReprise[], journal: { slotId: string }[]): Position {
  if (creneaux.length === 0) return DEBUT
  if (journal.length === 0) return DEBUT

  for (let i = 0; i < creneaux.length; i++) {
    const c = creneaux[i]!
    const parSerie = Math.max(1, c.etapesParSerie)
    const faites = journal.filter((e) => e.slotId === c.id).length
    const attendues = c.series * parSerie
    if (faites < attendues) {
      return { creneau: i, serie: Math.floor(faites / parSerie), etape: faites % parSerie }
    }
  }

  // Tout est fait : on reste sur le dernier créneau plutôt que de reboucler au début.
  const dernier = creneaux.length - 1
  return { creneau: dernier, serie: Math.max(0, creneaux[dernier]!.series - 1), etape: 0 }
}

/** Raccourci pour le lecteur de force, qui n'a besoin que du créneau. */
export function creneauDeReprise(creneaux: CreneauReprise[], journal: { slotId: string }[]): number {
  return positionDeReprise(creneaux, journal).creneau
}
