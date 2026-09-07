import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { Entete } from '../composants/communs'
import { Chevron, Coche, Croix, Moins, Plus } from '../composants/icones'
import { COULEUR_PROGRAMME, exerciceDuSlot, seance } from '../data'
import type { Slot, Venue } from '../data/types'
import { biper, garderEcranAllume, vibrer } from '../lib/appareil'
import type { SetLog } from '../lib/db'
import { modifier, useDonnees } from '../lib/etat'
import { prochaineCharge, prochainEchelon, type SerieFaite } from '../lib/progression'
import { aller } from '../lib/routeur'
import { formatChrono } from '../lib/semaine'
import { useFond } from '../lib/fond'
import { Introuvable } from './ChoixLieu'

export function LecteurForce({ templateId, venue }: { templateId: string; venue: Venue }) {
  const d = useDonnees()
  const t = seance(templateId)

  const [slotIndex, setSlotIndex] = useState(0)
  const [journal, setJournal] = useState<SetLog[]>([])
  const [repos, setRepos] = useState<number | null>(null)
  const debut = useRef(Date.now())

  const slot = t?.slots[slotIndex]
  const ex = slot ? exerciceDuSlot(slot, venue) : undefined

  const echelle = ex?.echelle
  const echelonInitial = ex ? Math.min(d.progression.echelons[ex.id] ?? 1, (echelle?.length ?? 1) - 1) : 0
  const chargeInitiale = ex ? chargeDeDepart(d.progression.charges[ex.id], d.reglages.halteresMax, d.reglages.pasCharge) : 0

  const [kg, setKg] = useState(chargeInitiale)
  const [reps, setReps] = useState(slot?.reps?.[1] ?? 10)

  const faitesDuSlot = useMemo(() => journal.filter((s) => s.slotId === slot?.id), [journal, slot?.id])
  const serieIndex = faitesDuSlot.length

  // À chaque changement d'exercice, on recharge la charge et les reps de départ.
  useEffect(() => {
    if (!ex || !slot) return
    setKg(chargeDeDepart(d.progression.charges[ex.id], d.reglages.halteresMax, d.reglages.pasCharge))
    setReps(slot.reps?.[1] ?? slot.repsParCote ?? 10)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotIndex])

  useEffect(() => {
    void garderEcranAllume(d.reglages.ecranAllume)
    return () => void garderEcranAllume(false)
  }, [d.reglages.ecranAllume])

  useFond(t ? (COULEUR_PROGRAMME[t.programme] ?? 'var(--papier)') : 'var(--papier)')

  useEffect(() => {
    if (repos === null) return
    if (repos <= 0) {
      biper(d.reglages.sons)
      vibrer(d.reglages.vibration, [80, 60, 80])
      setRepos(null)
      return
    }
    const id = setTimeout(() => setRepos((r) => (r === null ? null : r - 1)), 1000)
    return () => clearTimeout(id)
  }, [repos, d.reglages.sons, d.reglages.vibration])

  if (!t || !slot || !ex) return <Introuvable />

  const derniereFois = dernierePerf(d.seances, ex.id)
  const couleur = COULEUR_PROGRAMME[t.programme]
  const totalSeries = slot.series
  const dernierSlot = slotIndex >= t.slots.length - 1
  const derniereSerie = serieIndex >= totalSeries - 1

  const valider = () => {
    const entree: SetLog = {
      slotId: slot.id,
      exerciceId: ex.id,
      index: serieIndex,
      reps,
      at: Date.now(),
      rir: slot.rir,
      ...(echelle ? { echelon: echelonInitial } : { kg }),
    }
    const suivant = [...journal, entree]
    setJournal(suivant)
    vibrer(d.reglages.vibration)

    if (derniereSerie) {
      appliquerProgression(ex.id, slot, suivant, echelle, echelonInitial)
      if (dernierSlot) return terminer(suivant)
      setSlotIndex(slotIndex + 1)
      setRepos(slot.reposSec)
      return
    }
    setRepos(slot.reposSec)
  }

  const appliquerProgression = (
    exId: string,
    s: Slot,
    log: SetLog[],
    ech: string[] | undefined,
    echelonCourant: number,
  ) => {
    const series: SerieFaite[] = log
      .filter((l) => l.slotId === s.id)
      .map((l) => ({ reps: l.reps ?? 0, charge: l.kg ?? l.echelon ?? 0 }))
    if (!s.reps) return
    const echecs = d.progression.echecs[exId] ?? 0
    const sousLaFourchette = series.some((x) => x.reps < s.reps![0])

    if (ech) {
      const r = prochainEchelon(series, s.reps, ech, echelonCourant, echecs, s.series)
      modifier((data) => {
        data.progression.echelons[exId] = r.valeur
        data.progression.echecs[exId] = sousLaFourchette ? echecs + 1 : 0
      })
    } else {
      const r = prochaineCharge(series, s.reps, d.reglages.pasCharge, echecs, s.series)
      modifier((data) => {
        data.progression.charges[exId] = r.valeur
        data.progression.echecs[exId] = sousLaFourchette ? echecs + 1 : 0
      })
    }
  }

  const terminer = (log: SetLog[]) => {
    modifier((data) => {
      data.seances.push({
        id: `${templateId}-${debut.current}`,
        templateId,
        venue,
        debut: debut.current,
        fin: Date.now(),
        series: log,
      })
      delete data.enCours
    })
    aller('/')
  }

  const abandonner = () => {
    if (journal.length === 0) return aller('/')
    if (confirm('Arrêter la séance ? Les séries déjà validées sont enregistrées.')) terminer(journal)
  }

  const message = messageProgression(slot, faitesDuSlot, echelle, echelonInitial, d.reglages.pasCharge)

  return (
    <div class="ecran" style={{ background: couleur, color: 'var(--sur-couleur)' }}>
      <Entete
        surCouleur
        gauche={
          <button onClick={abandonner} aria-label="Quitter la séance" style={{ minHeight: 'var(--cible)', minWidth: 'var(--cible)', display: 'flex', alignItems: 'center' }}>
            <Croix />
          </button>
        }
        centre={`${venue === 'salle' ? 'Salle' : 'Tapis'} · exercice ${slotIndex + 1} sur ${t.slots.length}`}
      />

      <div class="contenu" style={{ gap: '0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '26px' }}>{ex.nom}</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', fontSize: '14px' }}>
            <span>{doseLisible(slot, echelle, echelonInitial)}</span>
            <button
              onClick={() => aller(`/exercice/${ex.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, whiteSpace: 'nowrap', minHeight: 'var(--cible)' }}
            >
              La fiche <Chevron taille={14} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '18px' }}>
          {Array.from({ length: totalSeries }, (_, i) => {
            const faite = faitesDuSlot[i]
            const active = i === serieIndex && repos === null
            if (faite) {
              return (
                <div key={i} style={ligne(i === 0)}>
                  <span style={{ opacity: 0.7 }}>Série {i + 1}</span>
                  <span class="num">{faite.kg ? `${faite.kg} kg × ${faite.reps}` : `${faite.reps} reps`}</span>
                  <Coche taille={20} />
                </div>
              )
            }
            if (!active) {
              return (
                <div key={i} style={{ ...ligne(i === 0), opacity: 0.7 }}>
                  <span>Série {i + 1}</span>
                  <span>—</span>
                  <span />
                </div>
              )
            }
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 0 18px', borderTop: i === 0 ? '1.5px solid var(--encre)' : '1px solid rgba(20,24,26,0.35)', borderBottom: '1px solid rgba(20,24,26,0.35)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                  <strong>Série {i + 1}</strong>
                  {derniereFois && <span style={{ opacity: 0.7 }}>Dernière fois {derniereFois}</span>}
                </div>
                {echelle ? (
                  <div style={{ border: '1.5px solid var(--encre)', borderRadius: 'var(--r)', padding: '12px 14px', fontSize: '15px', fontWeight: 600 }}>
                    {echelle[echelonInitial]}
                  </div>
                ) : (
                  <Compteur valeur={kg} unite="kg" pas={d.reglages.pasCharge} min={0} onChange={setKg} />
                )}
                <Compteur valeur={reps} unite="reps" pas={1} min={1} onChange={setReps} />
              </div>
            )
          })}
        </div>

        <div style={{ flex: 1, minHeight: '16px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: 'calc(20px + var(--barre-bas))' }}>
          <p style={{ fontSize: '15px', lineHeight: 1.45 }}>{message}</p>
          {repos !== null ? (
            <button class="principal" onClick={() => setRepos(null)}>
              <span class="num">Repos {formatChrono(repos)}</span>
              <span style={{ fontSize: '15px', fontWeight: 500, opacity: 0.85 }}>Passer</span>
            </button>
          ) : (
            <button class="principal" onClick={valider}>
              <span>{dernierSlot && derniereSerie ? 'Valider et terminer' : `Valider la série ${serieIndex + 1}`}</span>
              <Coche couleur="var(--papier)" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const ligne = (premier: boolean) => ({
  display: 'grid',
  gridTemplateColumns: '68px minmax(0, 1fr) 24px',
  gap: '12px',
  alignItems: 'center',
  padding: '14px 0',
  borderTop: premier ? '1.5px solid var(--encre)' : 'none',
  borderBottom: '1px solid rgba(20,24,26,0.35)',
  fontSize: '15px',
})

/** Première fois sur un exercice chargé : on part d'un tiers de l'haltère le plus lourd du club. */
function chargeDeDepart(enregistree: number | undefined, halteresMax: number, pas: number): number {
  if (enregistree !== undefined && enregistree > 0) return enregistree
  const estimation = Math.round((halteresMax * 0.35) / pas) * pas
  return Math.max(pas, estimation)
}

function Compteur({
  valeur,
  unite,
  pas,
  min,
  onChange,
}: {
  valeur: number
  unite: string
  pas: number
  min: number
  onChange: (v: number) => void
}) {
  const [saisie, setSaisie] = useState<string | null>(null)
  const ajuste = (delta: number) => onChange(Math.max(min, Math.round((valeur + delta) * 100) / 100))

  const valider = () => {
    if (saisie === null) return
    const n = Number.parseFloat(saisie.replace(',', '.'))
    if (Number.isFinite(n)) onChange(Math.max(min, n))
    setSaisie(null)
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '72px minmax(0, 1fr) 72px',
        border: '1.5px solid var(--encre)',
        borderRadius: 'var(--r)',
        height: '80px',
        overflow: 'hidden',
      }}
    >
      <button onClick={() => ajuste(-pas)} aria-label={`Moins ${pas} ${unite}`} style={{ borderRight: '1.5px solid var(--encre)', display: 'grid', placeItems: 'center' }}>
        <Moins />
      </button>
      {saisie === null ? (
        <button
          onClick={() => setSaisie(String(valeur))}
          aria-label={`${valeur} ${unite}, appuie pour saisir au clavier`}
          style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '6px' }}
        >
          <span class="chiffre" style={{ fontSize: '48px' }}>{valeur}</span>
          <span style={{ fontSize: '15px', fontWeight: 500 }}>{unite}</span>
        </button>
      ) : (
        <input
          autoFocus
          value={saisie}
          inputMode="decimal"
          aria-label={`Saisir ${unite}`}
          onInput={(e) => setSaisie((e.target as HTMLInputElement).value)}
          onBlur={valider}
          onKeyDown={(e) => {
            if ((e as KeyboardEvent).key === 'Enter') valider()
          }}
          style={{
            font: 'inherit',
            fontFamily: 'var(--titre)',
            fontWeight: 800,
            fontSize: '44px',
            textAlign: 'center',
            border: 'none',
            background: 'transparent',
            color: 'var(--encre)',
            width: '100%',
            padding: 0,
          }}
        />
      )}
      <button onClick={() => ajuste(pas)} aria-label={`Plus ${pas} ${unite}`} style={{ borderLeft: '1.5px solid var(--encre)', display: 'grid', placeItems: 'center' }}>
        <Plus />
      </button>
    </div>
  )
}

function doseLisible(slot: Slot, echelle: string[] | undefined, echelon: number): string {
  const bout = slot.rir ? ` · ${slot.rir} reps en réserve` : ''
  if (slot.reps) return `${slot.series} × ${slot.reps[0]}–${slot.reps[1]}${bout}`
  if (slot.repsParCote) return `${slot.series} × ${slot.repsParCote} par côté`
  if (slot.secondes) return `${slot.series} × ${slot.secondes} s${echelle ? ` · ${echelle[echelon]}` : ''}`
  return `${slot.series} séries`
}

function dernierePerf(seances: { series: SetLog[] }[], exerciceId: string): string | null {
  for (let i = seances.length - 1; i >= 0; i--) {
    const s = seances[i]!
    const derniere = [...s.series].reverse().find((x) => x.exerciceId === exerciceId)
    if (derniere) return derniere.kg ? `${derniere.kg} kg × ${derniere.reps}` : `${derniere.reps} reps`
  }
  return null
}

function messageProgression(
  slot: Slot,
  faites: SetLog[],
  echelle: string[] | undefined,
  echelon: number,
  pas: number,
): string {
  if (slot.mode === 'reps-par-cote') {
    return `${slot.repsParCote} répétitions de chaque côté, sans laisser le bassin tourner.`
  }
  if (!slot.reps) return 'Tiens la position sans retenir ta respiration.'
  const series: SerieFaite[] = faites.map((l) => ({ reps: l.reps ?? 0, charge: l.kg ?? l.echelon ?? 0 }))
  if (series.length === 0) {
    return echelle
      ? `Vise ${slot.reps[1]} reps sur les ${slot.series} séries pour passer à l'échelon suivant.`
      : `Vise ${slot.reps[1]} reps sur les ${slot.series} séries pour monter de ${pas} kg.`
  }
  const r = echelle
    ? prochainEchelon(series, slot.reps, echelle, echelon, 0, slot.series)
    : prochaineCharge(series, slot.reps, pas, 0, slot.series)
  return r.message
}
