import { COULEUR_PROGRAMME, seance, seriesParProgramme } from '../data'
import { INITIALE_JOUR, JOURS, type Jour } from '../data/seances'

/**
 * La semaine en sept colonnes : l'initiale du jour, puis un trait par programme
 * travaillé ce jour-là — plein quand la séance est faite, cerné quand elle est à
 * venir. Partagée par l'accueil, qui montre la semaine en cours, et par l'écran
 * Programme, où elle montre ce que chaque formule change.
 */
export function BandeSemaine({ plan, jourActuel, faites }: { plan: Record<Jour, string[]>; jourActuel: Jour; faites: { jour: Jour; id: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '6px' }}>
      {JOURS.map((j) => {
        const prevues = plan[j] ?? []
        const actuel = j === jourActuel
        return (
          <div key={j} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Le jour courant est encré en plein : à la taille d'une initiale, un
                changement de graisse seul ne se voit pas d'un coup d'œil. */}
            <div
              aria-current={actuel ? 'date' : undefined}
              style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                textAlign: 'center',
                lineHeight: 1,
                padding: '4px 0 3px',
                borderRadius: 'var(--r)',
                background: actuel ? 'var(--encre)' : 'transparent',
                color: actuel ? 'var(--papier)' : 'var(--sourdine)',
                fontWeight: actuel ? 700 : 400,
              }}
            >
              {INITIALE_JOUR[j]}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {prevues.length === 0 && <div style={{ height: '10px', background: 'rgba(20,24,26,0.08)', borderRadius: '1px' }} />}
              {prevues.flatMap((id) => {
                const t = seance(id)
                if (!t) return []
                const programmes = Object.keys(seriesParProgramme(t, 'salle'))
                const fait = faites.some((f) => f.jour === j && f.id === id)
                return programmes.map((p) => (
                  <div
                    key={`${id}-${p}`}
                    style={{
                      height: '10px',
                      borderRadius: '1px',
                      background: fait ? COULEUR_PROGRAMME[p] : 'transparent',
                      border: fait ? 'none' : `1.5px solid ${COULEUR_PROGRAMME[p]}`,
                    }}
                  />
                ))
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
