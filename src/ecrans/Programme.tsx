import { useState } from 'preact/hooks'
import { BarreOnglets, Entete, Titre } from '../composants/communs'
import { Chevron, PointPreuve } from '../composants/icones'
import { COULEUR_PROGRAMME, NOM_PROGRAMME, SEANCES, TOUS_EXERCICES, exerciceDuSlot } from '../data'
import { aller } from '../lib/routeur'

const FILTRES = ['tous', 'pecs', 'abdos', 'mobilite'] as const
type Filtre = (typeof FILTRES)[number]

export function Programme() {
  const [filtre, setFiltre] = useState<Filtre>('tous')
  const liste = TOUS_EXERCICES.filter((e) => filtre === 'tous' || e.programme === filtre)

  return (
    <div class="ecran">
      <Entete />
      <div class="contenu">
        <Titre titre="Programme" apres="2 séances de force · 3 de mobilité" />

        <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SEANCES.map((t) => (
            <button
              key={t.id}
              onClick={() => aller(t.demandeLieu ? `/seance/${t.id}` : `/seance/${t.id}/tapis`)}
              class="rangee"
              style={{ borderBottom: '1px solid var(--filet)' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <span class="pastille" style={{ background: COULEUR_PROGRAMME[t.programme] }} />
                <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                  <span style={{ fontWeight: 600 }}>{t.nom}</span>
                  <span class="discret" style={{ fontSize: '13px' }}>
                    {t.slots.length} exercices · {t.minutes.salle} min
                  </span>
                </span>
              </span>
              <Chevron />
            </button>
          ))}
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px', borderTop: '1.5px solid var(--encre)' }}>
          <h3>Tous les exercices</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {FILTRES.map((f) => {
              // Chaque filtre porte la couleur de son programme, selon la même règle
              // que la bande de semaine : contour quand il est libre, plein quand il
              // est choisi. « Tous » n'est pas un programme, il reste à l'encre.
              const actif = filtre === f
              const teinte = f === 'tous' ? 'var(--encre)' : COULEUR_PROGRAMME[f]
              return (
                <button
                  key={f}
                  onClick={() => setFiltre(f)}
                  aria-pressed={actif}
                  style={{
                    border: `1.5px solid ${teinte}`,
                    borderRadius: 'var(--r)',
                    padding: '9px 13px',
                    fontSize: '13px',
                    fontWeight: 600,
                    background: actif ? teinte : 'transparent',
                    // Encre sur les trois couleurs de programme, vérifiée en
                    // contraste ; seul « Tous », plein d'encre, passe au papier.
                    color: actif && f === 'tous' ? 'var(--papier)' : 'var(--encre)',
                    minHeight: 'var(--cible)',
                  }}
                >
                  {f === 'tous' ? 'Tous' : NOM_PROGRAMME[f]}
                </button>
              )
            })}
          </div>

          {liste.map((e) => (
            <button key={e.id} onClick={() => aller(`/exercice/${e.id}`)} class="rangee">
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <span class="pastille" style={{ background: COULEUR_PROGRAMME[e.programme] }} />
                <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                  <span style={{ fontWeight: 500 }}>{e.nom}</span>
                  <span class="discret" style={{ fontSize: '13px' }}>{e.resume}</span>
                </span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {e.evidence && <PointPreuve plein={e.evidence === 'pleine'} />}
                <Chevron />
              </span>
            </button>
          ))}
        </section>
        <div style={{ height: '12px' }} />
      </div>
      <BarreOnglets />
    </div>
  )
}

export function creneauxLisibles(templateId: string): string {
  const t = SEANCES.find((s) => s.id === templateId)
  if (!t) return ''
  return t.slots.map((s) => exerciceDuSlot(s, 'salle')?.nom ?? '').filter(Boolean).join(' · ')
}
