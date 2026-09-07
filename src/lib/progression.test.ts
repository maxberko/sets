import { describe, it, expect } from 'vitest'
import {
  arrondirAuPas,
  prochaineCharge,
  prochainEchelon,
  prochainMaintien,
  repMax,
  seriesApresDeload,
  estSerieEfficace,
} from './progression'

const s = (reps: number, charge: number) => ({ reps, charge })

describe('arrondirAuPas', () => {
  it('colle au pas de charge de la salle', () => {
    expect(arrondirAuPas(23, 2)).toBe(24)
    expect(arrondirAuPas(22.4, 2)).toBe(22)
    expect(arrondirAuPas(21.3, 2.5)).toBe(22.5)
  })
})

describe('prochaineCharge, double progression', () => {
  it('monte quand toutes les séries atteignent le sommet de la fourchette', () => {
    const r = prochaineCharge([s(12, 22), s(12, 22), s(12, 22)], [8, 12], 2)
    expect(r.changement).toBe('monte')
    expect(r.valeur).toBe(24)
    expect(r.message).toContain('24 kg')
  })

  it('ne monte pas si une seule série reste sous le sommet', () => {
    const r = prochaineCharge([s(12, 22), s(12, 22), s(11, 22)], [8, 12], 2)
    expect(r.changement).toBe('stable')
    expect(r.valeur).toBe(22)
    expect(r.message).toContain('1 série')
  })

  it("ne promet rien tant que les séries prévues ne sont pas toutes faites", () => {
    // Une seule série sur trois, au sommet : c'est encourageant, ce n'est pas une montée.
    const r = prochaineCharge([s(12, 22)], [8, 12], 2, 0, 3)
    expect(r.changement).toBe('stable')
    expect(r.valeur).toBe(22)
    expect(r.message).toContain('2 séries')
    expect(r.message).not.toContain('la prochaine fois')
  })

  it('monte une fois les trois séries faites au sommet', () => {
    const r = prochaineCharge([s(12, 22), s(12, 22), s(12, 22)], [8, 12], 2, 0, 3)
    expect(r.changement).toBe('monte')
    expect(r.message).toContain('3 séries')
  })

  it("n'allège pas sur une séance encore incomplète", () => {
    const r = prochaineCharge([s(5, 22)], [8, 12], 2, 1, 3)
    expect(r.changement).toBe('stable')
    expect(r.valeur).toBe(22)
  })

  it('garde la charge au premier échec sous le bas de la fourchette', () => {
    const r = prochaineCharge([s(9, 22), s(8, 22), s(7, 22)], [8, 12], 2, 0)
    expect(r.changement).toBe('stable')
    expect(r.valeur).toBe(22)
  })

  it('allège de 10 % au deuxième échec consécutif', () => {
    const r = prochaineCharge([s(9, 22), s(8, 22), s(7, 22)], [8, 12], 2, 1)
    expect(r.changement).toBe('baisse')
    expect(r.valeur).toBe(20)
  })

  it("ne descend jamais sous un pas de charge", () => {
    const r = prochaineCharge([s(3, 2)], [8, 12], 2, 1)
    expect(r.valeur).toBeGreaterThanOrEqual(2)
  })

  it('reste stable sans série enregistrée', () => {
    const r = prochaineCharge([], [8, 12], 2)
    expect(r.changement).toBe('stable')
  })
})

describe("prochainEchelon, échelle au poids de corps", () => {
  const echelle = ['Genoux', 'Au sol', 'Pieds sur marche', 'Pieds sur chaise', 'Sac à dos']

  it("monte d'un échelon quand tout est au sommet", () => {
    const r = prochainEchelon([s(12, 1), s(12, 1), s(12, 1)], [8, 12], echelle, 1)
    expect(r.changement).toBe('monte')
    expect(r.valeur).toBe(2)
    expect(r.message).toContain('Pieds sur marche')
  })

  it("attend les trois séries avant de changer d'échelon", () => {
    const r = prochainEchelon([s(12, 1)], [8, 12], echelle, 1, 0, 3)
    expect(r.changement).toBe('stable')
    expect(r.valeur).toBe(1)
  })

  it('ne dépasse pas le dernier échelon', () => {
    const r = prochainEchelon([s(12, 4), s(12, 4)], [8, 12], echelle, 4)
    expect(r.changement).toBe('stable')
    expect(r.valeur).toBe(4)
    expect(r.message).toContain('sac')
  })

  it('redescend au deuxième échec', () => {
    const r = prochainEchelon([s(6, 3), s(5, 3)], [8, 12], echelle, 3, 1)
    expect(r.changement).toBe('baisse')
    expect(r.valeur).toBe(2)
  })

  it('ne descend pas sous le premier échelon', () => {
    const r = prochainEchelon([s(2, 0)], [8, 12], echelle, 0, 1)
    expect(r.valeur).toBe(0)
  })
})

describe('prochainMaintien', () => {
  it('monte de palier après deux séances faciles', () => {
    expect(prochainMaintien(30, 2)).toMatchObject({ changement: 'monte', valeur: 45 })
  })
  it("attend la deuxième séance facile", () => {
    const r = prochainMaintien(30, 1)
    expect(r.changement).toBe('stable')
    expect(r.message).toContain('1 séance')
  })
  it('plafonne au dernier palier', () => {
    expect(prochainMaintien(60, 5)).toMatchObject({ changement: 'stable', valeur: 60 })
  })
})

describe('volume et deload', () => {
  it('coupe le volume la semaine 5 seulement', () => {
    expect(seriesApresDeload(3, 4, 5, 0.6)).toBe(3)
    expect(seriesApresDeload(3, 5, 5, 0.6)).toBe(2)
    expect(seriesApresDeload(3, 6, 5, 0.6)).toBe(3)
  })
  it('garde au moins une série', () => {
    expect(seriesApresDeload(1, 5, 5, 0.6)).toBe(1)
  })
  it('compte une série comme efficace jusqu\'à 3 reps en réserve', () => {
    expect(estSerieEfficace(2)).toBe(true)
    expect(estSerieEfficace(3)).toBe(true)
    expect(estSerieEfficace(4)).toBe(false)
    expect(estSerieEfficace(undefined)).toBe(true)
  })
})

describe('reprise de séance', () => {
  // Copie de la logique de LecteurForce, gardée sous test parce que c'est elle qui
  // décide où l'on repart après un téléphone verrouillé en pleine séance.
  const slots = [
    { id: 'a1', series: 3 },
    { id: 'a2', series: 3 },
    { id: 'a3', series: 2 },
  ]
  const slotDeReprise = (series: { slotId: string }[]) => {
    if (series.length === 0) return 0
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i]!
      if (series.filter((x) => x.slotId === s.id).length < s.series) return i
    }
    return slots.length - 1
  }
  const faites = (id: string, n: number) => Array.from({ length: n }, () => ({ slotId: id }))

  it('repart au premier exercice quand rien n\'est fait', () => {
    expect(slotDeReprise([])).toBe(0)
  })
  it('repart sur l\'exercice entamé', () => {
    expect(slotDeReprise(faites('a1', 2))).toBe(0)
  })
  it('passe au suivant quand un exercice est complet', () => {
    expect(slotDeReprise(faites('a1', 3))).toBe(1)
  })
  it('saute les exercices déjà finis', () => {
    expect(slotDeReprise([...faites('a1', 3), ...faites('a2', 3), ...faites('a3', 1)])).toBe(2)
  })
})

describe('repMax', () => {
  it('applique Epley', () => {
    expect(repMax(22, 11)).toBe(30)
    expect(repMax(0, 10)).toBe(0)
    expect(repMax(50, 0)).toBe(0)
  })
})
