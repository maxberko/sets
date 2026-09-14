import { CIBLES_HEBDO, COULEUR_PROGRAMME, NOM_PROGRAMME, SEMAINES_BLOC, planDe } from '../data'
import { JOURS } from '../data/seances'
import { useDonnees } from '../lib/etat'
import { lundiDe, volumeParSemaine } from '../lib/semaine'

/**
 * Le suivi, tel qu'il s'affiche sous la séance du jour sur l'écran d'accueil.
 * Il avait son propre onglet ; on ne l'ouvrait qu'en y pensant.
 *
 * Il ne reste que la semaine : séries par programme et séances de mobilité.
 * Deux rubriques ont été retirées. « Ta progression » ne suivait qu'un exercice
 * codé en dur, affichait un maximal théorique dont l'appli ne fait rien, et sa
 * courbe devenait une ligne pleine largeur — lue comme une jauge remplie — dès
 * que deux séances se valaient. « Le point du corps » montrait surtout deux
 * « pas encore » plus gros que les valeurs qu'ils attendaient.
 */
export function SuiviAccueil() {
  const d = useDonnees()
  const maintenant = new Date()
  const volumes = volumeParSemaine(d.seances)
  const cle = lundiDe(maintenant)
  const cette = volumes.find((v) => v.semaine === cle)?.parProgramme ?? {}

  const plan = planDe(d.reglages.formule)
  const mobilitePrevues = JOURS.reduce((n, j) => n + (plan[j] ?? []).filter((x) => x === 'mobilite').length, 0)
  const mobiliteFaites = d.seances.filter((s) => s.fin && s.templateId === 'mobilite' && lundiDe(new Date(s.debut)) === cle).length

  const rubrique = { borderTop: '1.5px solid var(--encre)', paddingTop: '18px', display: 'flex', flexDirection: 'column' as const, gap: '12px' }

  return (
    <>
      <section style={rubrique}>
        <h3>Ta semaine</h3>
        {(['pecs', 'abdos'] as const).map((p) => (
          <Barres key={p} programme={p} volumes={volumes} actuel={cette[p] ?? 0} />
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <span class="pastille" style={{ background: COULEUR_PROGRAMME.mobilite }} />
            <strong>Mobilité</strong>
            <span class="discret num">
              {mobiliteFaites} séance{mobiliteFaites > 1 ? 's' : ''} sur {mobilitePrevues} cette semaine
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mobilitePrevues}, minmax(0, 1fr))`, gap: '4px' }}>
            {Array.from({ length: mobilitePrevues }, (_, i) => (
              <div
                key={i}
                style={{
                  height: '10px',
                  borderRadius: '1px',
                  background: i < mobiliteFaites ? COULEUR_PROGRAMME.mobilite : 'rgba(62,146,200,0.25)',
                }}
              />
            ))}
          </div>
        </div>
      </section>

    </>
  )
}




export function Champ({ label, valeur, onChange, type = 'decimal' }: { label: string; valeur: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
      <span class="discret">{label}</span>
      <input
        value={valeur}
        inputMode={type as never}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        style={{
          font: 'inherit',
          fontSize: '17px',
          padding: '12px 14px',
          border: '1.5px solid var(--encre)',
          borderRadius: 'var(--r)',
          background: 'transparent',
          color: 'var(--encre)',
          minHeight: 'var(--cible)',
          width: '100%',
        }}
      />
    </label>
  )
}

function Barres({
  programme,
  volumes,
  actuel,
}: {
  programme: 'pecs' | 'abdos'
  volumes: { semaine: string; parProgramme: Record<string, number> }[]
  actuel: number
}) {
  const cible = CIBLES_HEBDO[programme]!
  const max = 24
  const h = 66
  const largeur = 342
  const n = SEMAINES_BLOC
  const pas = largeur / n
  const barre = pas - 18
  const y = (v: number) => h - 2 - (Math.min(v, max) / max) * (h - 8)
  const derniers = volumes.slice(-n)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
        <span class="pastille" style={{ background: COULEUR_PROGRAMME[programme] }} />
        <strong>{NOM_PROGRAMME[programme]}</strong>
        <span class="discret num">
          {actuel} cette semaine · cible {cible[0]}–{cible[1]}
        </span>
      </div>
      <svg viewBox={`0 0 ${largeur} ${h + 4}`} width="100%" height={h + 4} role="img" aria-label={`Séries efficaces ${NOM_PROGRAMME[programme]} par semaine, cible ${cible[0]} à ${cible[1]}`} style={{ display: 'block', overflow: 'visible' }}>
        <rect x="0" y={y(cible[1])} width={largeur} height={Math.max(0, y(cible[0]) - y(cible[1]))} fill={COULEUR_PROGRAMME[programme]} opacity="0.12" />
        <line x1="0" y1={h - 1.5} x2={largeur} y2={h - 1.5} stroke="var(--encre)" stroke-width="1" />
        {Array.from({ length: n }, (_, i) => {
          const v = derniers[i]?.parProgramme[programme] ?? 0
          if (v <= 0) return null
          const x = i * pas + 4
          const haut = y(v)
          return <rect key={i} x={x} y={haut} width={barre} height={h - 2 - haut} rx="2" fill={COULEUR_PROGRAMME[programme]} />
        })}
        <text x={largeur} y="9" font-size="10" fill="var(--sourdine)" text-anchor="end">{max}</text>
      </svg>
    </div>
  )
}

