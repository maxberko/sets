import { useEffect, useRef, useState } from 'preact/hooks'
import { Entete } from '../composants/communs'
import { Chevron, Coche, Croix, Lecture, Pause, PointPreuve } from '../composants/icones'
import { COULEUR_PROGRAMME, exerciceDuSlot, seance } from '../data'
import type { Exercise, Slot } from '../data/types'
import { biper, garderEcranAllume, vibrer } from '../lib/appareil'
import type { SetLog } from '../lib/db'
import { modifier, useDonnees, viderLaFile } from '../lib/etat'
import { aller } from '../lib/routeur'
import { formatChrono } from '../lib/semaine'
import { useFond } from '../lib/fond'
import { positionDeReprise, type CreneauReprise } from '../lib/reprise'
import { Introuvable } from './ChoixLieu'

type Cote = 'droit' | 'gauche' | null

export function LecteurMobilite({ templateId }: { templateId: string }) {
  const d = useDonnees()
  const t = seance(templateId)

  // La position n'est PAS un état à part : elle se déduit du journal des étapes faites.
  // C'est ce qui rend l'écran juste après un aller-retour vers une fiche d'exercice,
  // qui démonte ce composant, et après une séance interrompue. Garder un i/serie/cote
  // en parallèle du journal, c'est se garantir qu'ils finiront par diverger.
  const reprise = d.enCours?.templateId === templateId ? d.enCours : undefined
  const [journal, setJournal] = useState<SetLog[]>(() => (reprise?.series ? [...reprise.series] : []))
  const debut = useRef(reprise?.debut ?? Date.now())

  const slots = t?.slots ?? []
  const etapes = creneaux(slots)
  const total = etapes.reduce((n, c) => n + c.series * c.etapesParSerie, 0)
  const fini = total > 0 && journal.length >= total

  const position = positionDeReprise(etapes, journal)
  const { creneau: i, serie, etape } = position

  const slot = slots[i]
  const ex = slot ? exerciceDuSlot(slot, 'tapis') : undefined
  const cote = coteDe(slot, etape)
  const chrono = estChrono(slot)
  const duree = slot && ex ? dureeDe(slot, d.progression.maintiens[ex.id]) : 0

  const [restant, setRestant] = useState(duree)
  const [enPause, setEnPause] = useState(false)
  // Le chrono ne démarre pas tout seul : on se met en place, puis on appuie.
  const [demarre, setDemarre] = useState(false)

  // Chaque étape repart de sa durée pleine. La clé couvre l'exercice, la série et le côté.
  const cle = `${i}-${serie}-${etape}`
  const cleVue = useRef(cle)
  useEffect(() => {
    if (cleVue.current === cle) return
    cleVue.current = cle
    setRestant(duree)
    setEnPause(false)
    setDemarre(false)
  }, [cle, duree])

  useEffect(() => {
    void garderEcranAllume(d.reglages.ecranAllume)
    return () => void garderEcranAllume(false)
  }, [d.reglages.ecranAllume])

  useFond(fini ? 'var(--papier)' : COULEUR_PROGRAMME.mobilite ?? 'var(--papier)')

  const etapeSuivante = () => {
    if (!slot || !ex) return
    const entree: SetLog = {
      slotId: slot.id,
      exerciceId: ex.id,
      index: serie,
      at: Date.now(),
      ...(chrono ? { secondes: duree } : {}),
    }
    const suivant = [...journal, entree]
    setJournal(suivant)
    modifier((data) => {
      data.enCours = { id: `${templateId}-${debut.current}`, templateId, venue: 'tapis', debut: debut.current, series: suivant }
    })
    viderLaFile()
  }

  useEffect(() => {
    if (!chrono || !demarre || enPause || fini || restant <= 0) return
    const id = setTimeout(() => {
      const suivant = restant - 1
      if (suivant === 5) biper(d.reglages.sons, 660, 0.08)
      setRestant(suivant)
      if (suivant <= 0) {
        biper(d.reglages.sons)
        vibrer(d.reglages.vibration, [80, 60, 80])
        etapeSuivante()
      }
    }, 1000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restant, enPause, demarre, chrono, fini])

  if (!t) return <Introuvable />
  if (fini) return <FinMobilite templateId={templateId} debut={debut.current} journal={journal} />
  if (!slot || !ex) return <Introuvable />

  const suivantEx = slots[i + 1] ? exerciceDuSlot(slots[i + 1]!, 'tapis') : undefined
  const avancement = chrono && duree > 0 ? ((duree - restant) / duree) * 100 : 0

  return (
    <div class="ecran" style={{ background: COULEUR_PROGRAMME.mobilite, color: 'var(--sur-couleur)' }}>
      <Entete
        surCouleur
        gauche={
          <button onClick={() => aller('/')} aria-label="Quitter" style={{ minHeight: 'var(--cible)', minWidth: 'var(--cible)', display: 'flex', alignItems: 'center' }}>
            <Croix />
          </button>
        }
        centre={`${t.nom} · ${i + 1} sur ${slots.length}`}
      />

      <div class="contenu" style={{ gap: 0 }}>
        {chrono ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div class="chiffre" style={{ fontSize: '150px', lineHeight: 0.9, letterSpacing: '-0.06em', marginLeft: '-8px' }}>
              {formatChrono(restant)}
            </div>
            <div style={{ height: '8px', background: 'rgba(243,245,242,0.45)', borderRadius: '1px' }}>
              <div style={{ width: `${avancement}%`, height: '8px', background: 'var(--encre)', borderRadius: '1px' }} />
            </div>
            <div class="etiquette" style={{ opacity: 0.8 }}>
              {cote ? `Côté ${cote} · ${duree} s${cote === 'droit' ? ' · puis côté gauche' : ''}` : `${duree} s`}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div class="chiffre" style={{ fontSize: '110px', lineHeight: 0.9, marginLeft: '-4px' }}>
              {slot.repsParCote ?? slot.reps?.[1] ?? 0}
            </div>
            <div class="etiquette" style={{ opacity: 0.8 }}>
              {cote ? `répétitions · côté ${cote}` : 'répétitions'}
              {slot.series > 1 ? ` · série ${serie + 1} sur ${slot.series}` : ''}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '28px', flex: 1 }}>
          <h2 style={{ fontSize: '34px' }}>{ex.nom}</h2>
          <p style={{ fontSize: '22px', lineHeight: 1.3, fontWeight: 500, maxWidth: '320px', textWrap: 'balance' }}>{ex.points[0]}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '2px' }}>
            <PointPreuve plein={ex.evidence === 'pleine'} />
            <span style={{ fontSize: '13px', opacity: 0.85 }}>{legendePreuve(ex)}</span>
          </div>
          <button onClick={() => aller(`/exercice/${ex.id}`)} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, minHeight: 'var(--cible)' }}>
            La fiche : étapes, erreurs, vidéo <Chevron taille={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: 'calc(20px + var(--barre-bas))' }}>
          {suivantEx && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px solid var(--encre)', padding: '14px 0 4px', fontSize: '15px' }}>
              <span>
                <span style={{ opacity: 0.7 }}>Ensuite</span> · {suivantEx.nom}
              </span>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 104px', gap: '12px' }}>
            {chrono ? (
              !demarre ? (
                <button class="principal" style={{ justifyContent: 'center' }} onClick={() => setDemarre(true)}>
                  <Lecture couleur="var(--papier)" />
                  <span>Démarrer</span>
                </button>
              ) : (
                <button class="principal" style={{ justifyContent: 'center' }} onClick={() => setEnPause(!enPause)}>
                  {enPause ? <Lecture couleur="var(--papier)" /> : <Pause couleur="var(--papier)" />}
                  <span>{enPause ? 'Reprendre' : 'Pause'}</span>
                </button>
              )
            ) : (
              <button class="principal" style={{ justifyContent: 'center' }} onClick={etapeSuivante}>
                <Coche couleur="var(--papier)" />
                <span>Fait</span>
              </button>
            )}
            <button class="secondaire" onClick={etapeSuivante}>
              Passer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Le lecteur de mobilité enregistre une entrée par côté. */
function creneaux(slots: Slot[]): CreneauReprise[] {
  return slots.map((s) => ({ id: s.id, series: s.series, etapesParSerie: s.mode.endsWith('par-cote') ? 2 : 1 }))
}

function estChrono(slot: Slot | undefined): boolean {
  return slot?.mode === 'temps-par-cote' || slot?.mode === 'temps'
}

function coteDe(slot: Slot | undefined, etape: number): Cote {
  if (!slot || !slot.mode.endsWith('par-cote')) return null
  return etape === 1 ? 'gauche' : 'droit'
}

function dureeDe(slot: Slot, maintienEnregistre?: number): number {
  return maintienEnregistre ?? slot.secondes ?? 30
}

function legendePreuve(ex: Exercise): string {
  return ex.evidence === 'pleine'
    ? 'Renforcement : un essai clinique soutient ce travail'
    : "Amplitude et confort : usage clinique, pas d'essai"
}

function FinMobilite({ templateId, debut, journal }: { templateId: string; debut: number; journal: SetLog[] }) {
  const d = useDonnees()
  const [enregistre, setEnregistre] = useState(false)

  const noter = (facile: boolean) => {
    modifier((data) => {
      data.seances.push({ id: `${templateId}-${debut}`, templateId, venue: 'tapis', debut, fin: Date.now(), series: journal })
      for (const s of journal) {
        if (!s.secondes) continue
        const faciles = facile ? (data.progression.faciles[s.exerciceId] ?? 0) + 1 : 0
        data.progression.faciles[s.exerciceId] = faciles
        if (faciles >= 2) {
          const paliers = [20, 30, 45, 60]
          const actuel = data.progression.maintiens[s.exerciceId] ?? s.secondes
          const idx = paliers.indexOf(actuel)
          if (idx >= 0 && idx < paliers.length - 1) {
            data.progression.maintiens[s.exerciceId] = paliers[idx + 1]!
            data.progression.faciles[s.exerciceId] = 0
          }
        }
      }
      delete data.enCours
    })
    viderLaFile()
    setEnregistre(true)
    setTimeout(() => aller('/'), 400)
  }

  const minutes = Math.max(1, Math.round((Date.now() - debut) / 60000))
  const pleines = new Set(journal.map((j) => j.exerciceId)).size

  return (
    <div class="ecran">
      <Entete centre="Séance terminée" />
      <div class="contenu">
        <h1>C'est fait</h1>
        <p style={{ fontSize: '17px' }}>
          {pleines} exercices, {minutes} minutes. {d.reglages.sons ? '' : ''}
        </p>
        <div style={{ borderTop: '1.5px solid var(--encre)', paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3>Les maintiens étaient comment ?</h3>
          <p class="discret" style={{ fontSize: '14px' }}>
            Deux séances de suite notées faciles et la durée passe au palier suivant.
          </p>
          <button class="principal" disabled={enregistre} onClick={() => noter(true)} style={{ justifyContent: 'center' }}>
            Faciles
          </button>
          <button class="secondaire" disabled={enregistre} onClick={() => noter(false)}>
            Difficiles, on garde cette durée
          </button>
        </div>
      </div>
    </div>
  )
}
