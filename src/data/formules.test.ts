import { describe, it, expect } from 'vitest'
import { FORMULES, JOURS, SEANCES, planDe, descriptionFormule } from './seances'

/**
 * Le plan est de la donnée écrite à la main : rien n'empêche de compter faux ou de
 * référencer une séance qui n'existe pas. Ces tests attrapent les deux.
 */

const compte = (id: Parameters<typeof planDe>[0]) => {
  const plan = planDe(id)
  const seances = JOURS.flatMap((j) => plan[j])
  return {
    total: seances.length,
    force: seances.filter((s) => s.startsWith('pecs')).length,
    mobilite: seances.filter((s) => s === 'mobilite').length,
    jours: JOURS.filter((j) => plan[j].length > 0).length,
  }
}

describe('les trois formules', () => {
  it('annoncent le nombre de séances qu\'elles contiennent vraiment', () => {
    for (const f of FORMULES) {
      expect(compte(f.id).total, `formule ${f.id}`).toBe(f.seances)
    }
  })

  it('ne référencent que des séances qui existent', () => {
    const connus = new Set(SEANCES.map((s) => s.id))
    for (const f of FORMULES) {
      for (const j of JOURS) {
        for (const id of planDe(f.id)[j]) {
          expect(connus.has(id), `${f.id}/${j}: ${id}`).toBe(true)
        }
      }
    }
  })

  it('gardent les pectoraux au minimum deux fois par semaine', () => {
    // Deux séances hebdomadaires est le plancher que la recherche demande.
    for (const f of FORMULES) {
      expect(compte(f.id).force, `formule ${f.id}`).toBeGreaterThanOrEqual(2)
    }
  })

  it('vont bien du plus léger au plus soutenu', () => {
    const totaux = FORMULES.map((f) => compte(f.id).total)
    expect(totaux).toEqual([...totaux].sort((a, b) => a - b))
    const minutes = FORMULES.map((f) => f.minutes)
    expect(minutes).toEqual([...minutes].sort((a, b) => a - b))
  })

  it('laissent au moins un jour de repos', () => {
    for (const f of FORMULES) {
      expect(compte(f.id).jours, `formule ${f.id}`).toBeLessThan(7)
    }
  })

  it('ne collent jamais deux séances de force sur le même jour', () => {
    for (const f of FORMULES) {
      const plan = planDe(f.id)
      for (const j of JOURS) {
        const force = plan[j].filter((s) => s.startsWith('pecs')).length
        expect(force, `${f.id}/${j}`).toBeLessThanOrEqual(1)
      }
    }
  })

  it('retombent sur standard pour une formule inconnue', () => {
    expect(descriptionFormule('inexistante' as never).id).toBe('standard')
    expect(planDe('inexistante' as never)).toEqual(planDe('standard'))
  })
})
