import { describe, it, expect } from 'vitest'
import { creneauDeReprise, positionDeReprise, type CreneauReprise } from './reprise'

// Séance de force : une entrée par série.
const FORCE: CreneauReprise[] = [
  { id: 'a1', series: 3, etapesParSerie: 1 },
  { id: 'a2', series: 3, etapesParSerie: 1 },
  { id: 'a3', series: 2, etapesParSerie: 1 },
]

// Séance de mobilité : deux entrées par série pour les exercices faits des deux côtés.
const MOBILITE: CreneauReprise[] = [
  { id: 'm1', series: 1, etapesParSerie: 2 },
  { id: 'm2', series: 1, etapesParSerie: 2 },
  { id: 'm5', series: 2, etapesParSerie: 2 },
  { id: 'm7', series: 2, etapesParSerie: 1 },
]

const faites = (id: string, n: number) => Array.from({ length: n }, () => ({ slotId: id }))

describe('positionDeReprise, séance de force', () => {
  it('repart au début quand rien n\'est enregistré', () => {
    expect(positionDeReprise(FORCE, [])).toEqual({ creneau: 0, serie: 0, etape: 0 })
  })

  it('repart sur le créneau entamé, à la bonne série', () => {
    expect(positionDeReprise(FORCE, faites('a1', 2))).toEqual({ creneau: 0, serie: 2, etape: 0 })
  })

  it('passe au créneau suivant quand le précédent est complet', () => {
    expect(positionDeReprise(FORCE, faites('a1', 3))).toEqual({ creneau: 1, serie: 0, etape: 0 })
  })

  it('saute les créneaux déjà terminés', () => {
    const journal = [...faites('a1', 3), ...faites('a2', 3), ...faites('a3', 1)]
    expect(positionDeReprise(FORCE, journal)).toEqual({ creneau: 2, serie: 1, etape: 0 })
  })

  it('reste sur le dernier créneau quand tout est fait', () => {
    const journal = [...faites('a1', 3), ...faites('a2', 3), ...faites('a3', 2)]
    expect(positionDeReprise(FORCE, journal).creneau).toBe(2)
  })

  it('creneauDeReprise ne renvoie que le créneau', () => {
    expect(creneauDeReprise(FORCE, faites('a1', 3))).toBe(1)
  })
})

describe('positionDeReprise, séance de mobilité', () => {
  it('revient sur le deuxième côté quand seul le premier est fait', () => {
    // C'est le cas du bug : ouvrir la fiche après le côté droit et revenir.
    expect(positionDeReprise(MOBILITE, faites('m1', 1))).toEqual({ creneau: 0, serie: 0, etape: 1 })
  })

  it('passe à l\'exercice suivant quand les deux côtés sont faits', () => {
    expect(positionDeReprise(MOBILITE, faites('m1', 2))).toEqual({ creneau: 1, serie: 0, etape: 0 })
  })

  it('compte les séries multiples à deux côtés', () => {
    const journal = [...faites('m1', 2), ...faites('m2', 2), ...faites('m5', 3)]
    // 3 étapes sur m5 : première série complète, deuxième série côté droit fait.
    expect(positionDeReprise(MOBILITE, journal)).toEqual({ creneau: 2, serie: 1, etape: 1 })
  })

  it('gère un exercice sans côtés au milieu de la séance', () => {
    const journal = [...faites('m1', 2), ...faites('m2', 2), ...faites('m5', 4), ...faites('m7', 1)]
    expect(positionDeReprise(MOBILITE, journal)).toEqual({ creneau: 3, serie: 1, etape: 0 })
  })

  it('ne reboucle pas au premier exercice une fois la séance finie', () => {
    const journal = [...faites('m1', 2), ...faites('m2', 2), ...faites('m5', 4), ...faites('m7', 2)]
    expect(positionDeReprise(MOBILITE, journal).creneau).toBe(3)
  })
})

describe('cas limites', () => {
  it('supporte une séance vide', () => {
    expect(positionDeReprise([], faites('x', 3))).toEqual({ creneau: 0, serie: 0, etape: 0 })
  })

  it('traite etapesParSerie à 0 comme 1 plutôt que de diviser par zéro', () => {
    const bancal: CreneauReprise[] = [{ id: 'z', series: 2, etapesParSerie: 0 }]
    expect(positionDeReprise(bancal, faites('z', 1))).toEqual({ creneau: 0, serie: 1, etape: 0 })
  })
})
