import { useState } from 'preact/hooks'
import { Plus } from '../composants/icones'
import { CIBLES_HEBDO, COULEUR_PROGRAMME, NOM_PROGRAMME, SEMAINES_BLOC, planDe } from '../data'
import { JOURS } from '../data/seances'
import { modifier, useDonnees } from '../lib/etat'
import { lundiDe, tendance, volumeParSemaine } from '../lib/semaine'

/**
 * Le suivi, tel qu'il s'affiche sous la séance du jour sur l'écran d'accueil.
 * Il avait son propre onglet ; on ne l'ouvrait qu'en y pensant. Il suit désormais
 * ce qu'il y a à faire aujourd'hui, dans l'ordre : la semaine, la progression,
 * puis le point du corps, qui ne change qu'une fois par semaine.
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

  const points = tendance(d.seances, 'developpe-incline-halteres')
  const dernierCheck = d.checkins[d.checkins.length - 1]
  const premierCheck = d.checkins[0]

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

      {points.length > 1 && (
        <section style={rubrique}>
          <h3>Ta progression</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Développé incliné haltères</span>
            <span class="discret" style={{ fontSize: '13px' }}>1RM estimé {points[points.length - 1]!.rm} kg</span>
          </div>
          <Courbe points={points} />
        </section>
      )}

      <section style={rubrique}>
        <h3>Le point du corps</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
          <Mesure valeur={dernierCheck?.kg} unite="kg" delta={delta(dernierCheck?.kg, premierCheck?.kg)} legende="Poids" />
          <Mesure valeur={dernierCheck?.tailleCm} unite="cm" delta={delta(dernierCheck?.tailleCm, premierCheck?.tailleCm)} legende="Tour de taille" />
        </div>
        <FormulaireCheckIn />
      </section>
    </>
  )
}

function delta(actuel?: number, premier?: number): string | null {
  if (actuel === undefined || premier === undefined || actuel === premier) return null
  const d = Math.round((actuel - premier) * 10) / 10
  return `${d > 0 ? '+' : '−'}${Math.abs(d)}`
}

function Mesure({ valeur, unite, delta, legende }: { valeur?: number; unite: string; delta: string | null; legende: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        {valeur === undefined ? (
          <span class="discret" style={{ fontSize: '20px', fontWeight: 500 }}>pas encore</span>
        ) : (
          <>
            <span class="chiffre" style={{ fontSize: '32px' }}>{valeur}</span>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{unite}</span>
          </>
        )}
      </div>
      <span class="discret" style={{ fontSize: '13px' }}>
        {legende}
        {delta ? ` · ${delta} ${unite} depuis la semaine 1` : ''}
      </span>
    </div>
  )
}

function FormulaireCheckIn() {
  const [ouvert, setOuvert] = useState(false)
  const [kg, setKg] = useState('')
  const [taille, setTaille] = useState('')

  const enregistrer = () => {
    const p = Number.parseFloat(kg.replace(',', '.'))
    const t = Number.parseFloat(taille.replace(',', '.'))
    modifier((d) => {
      d.checkins.push({
        date: new Date().toISOString().slice(0, 10),
        ...(Number.isFinite(p) ? { kg: p } : {}),
        ...(Number.isFinite(t) ? { tailleCm: t } : {}),
      })
    })
    setKg('')
    setTaille('')
    setOuvert(false)
  }

  if (!ouvert) {
    return (
      <button class="secondaire" onClick={() => setOuvert(true)} style={{ justifyContent: 'space-between' }}>
        <span>Faire le point de la semaine</span>
        <Plus taille={18} />
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Champ label="Poids en kg" valeur={kg} onChange={setKg} />
      <Champ label="Tour de taille au nombril, en cm" valeur={taille} onChange={setTaille} />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 110px', gap: '10px' }}>
        <button class="principal" style={{ justifyContent: 'center' }} onClick={enregistrer} disabled={!kg && !taille}>
          Enregistrer
        </button>
        <button class="secondaire" onClick={() => setOuvert(false)}>
          Annuler
        </button>
      </div>
    </div>
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

function Courbe({ points }: { points: { date: number; kg: number; reps: number; rm: number }[] }) {
  const l = 342
  const h = 72
  const rms = points.map((p) => p.rm)
  const min = Math.min(...rms)
  const max = Math.max(...rms)
  const etendue = Math.max(1, max - min)
  const x = (i: number) => 8 + (i / Math.max(1, points.length - 1)) * (l - 24)
  const y = (v: number) => 50 - ((v - min) / etendue) * 34
  const chemin = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.rm).toFixed(1)}`).join(' ')
  const dernier = points[points.length - 1]!
  const premier = points[0]!

  return (
    <svg viewBox={`0 0 ${l} ${h}`} width="100%" height={h} role="img" aria-label={`Progression du développé incliné, de ${premier.kg} kg à ${dernier.kg} kg`} style={{ display: 'block', overflow: 'visible' }}>
      <line x1="0" y1="56.5" x2={l} y2="56.5" stroke="var(--filet)" stroke-width="1" />
      <path d={chemin} fill="none" stroke={COULEUR_PROGRAMME.pecs} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx={x(points.length - 1)} cy={y(dernier.rm)} r="5" fill={COULEUR_PROGRAMME.pecs} stroke="var(--papier)" stroke-width="2" />
      <text x={l} y="6" font-size="12" font-weight="600" fill="var(--encre)" text-anchor="end">
        {dernier.kg} kg × {dernier.reps}
      </text>
      <text x="0" y={h - 2} font-size="11" fill="var(--sourdine)">
        départ {premier.kg} kg × {premier.reps}
      </text>
    </svg>
  )
}
