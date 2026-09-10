import { Fragment } from 'preact'
import type { ComponentChildren } from 'preact'
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { Entete } from '../composants/communs'
import { Chevron, Coche, Croix, Lecture, Moins, Plus } from '../composants/icones'
import { COULEUR_PROGRAMME, exerciceDuSlot, seance } from '../data'
import type { Slot, Venue } from '../data/types'
import { biper, garderEcranAllume, vibrer } from '../lib/appareil'
import type { SetLog } from '../lib/db'
import { modifier, useDonnees, viderLaFile } from '../lib/etat'
import { prochaineCharge, prochainEchelon, type SerieFaite } from '../lib/progression'
import { creneauDeReprise, type CreneauReprise } from '../lib/reprise'
import { aller } from '../lib/routeur'
import { formatChrono } from '../lib/semaine'
import { useFond } from '../lib/fond'
import { useHauteurFenetre } from '../lib/fenetre'
import { Introuvable } from './ChoixLieu'

/** Le lecteur de force enregistre une entrée par série, jamais par côté. */
function creneaux(slots: Slot[]): CreneauReprise[] {
  return slots.map((s) => ({ id: s.id, series: s.series, etapesParSerie: 1 }))
}

export function LecteurForce({ templateId, venue }: { templateId: string; venue: Venue }) {
  const d = useDonnees()
  const t = seance(templateId)

  // Une séance interrompue est reprise là où elle s'est arrêtée : téléphone verrouillé,
  // appli tuée, ou simple aller-retour vers une fiche d'exercice, qui démonte ce composant.
  const reprise = d.enCours?.templateId === templateId && d.enCours.venue === venue ? d.enCours : undefined
  const [journal, setJournal] = useState<SetLog[]>(reprise?.series ?? [])
  const [slotIndex, setSlotIndex] = useState(() =>
    creneauDeReprise(creneaux(t?.slots ?? []), reprise?.series ?? []),
  )
  const [repos, setRepos] = useState<number | null>(null)
  /** Durée totale du repos en cours : le compte à rebours seul ne suffit pas à
      remplir la barre, et le créneau peut avoir changé entre-temps. */
  const [reposTotal, setReposTotal] = useState(1)
  /** La série est lancée : on passe du bouton « Démarrer » à celui qui la clôt.
      État d'écran, pas une donnée : perdu à la reprise, sans conséquence. */
  const [demarree, setDemarree] = useState(false)
  const debut = useRef(reprise?.debut ?? Date.now())

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
    setDemarree(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotIndex])

  useEffect(() => {
    void garderEcranAllume(d.reglages.ecranAllume)
    return () => void garderEcranAllume(false)
  }, [d.reglages.ecranAllume])

  useHauteurFenetre()
  // La couleur suit le programme de l'EXERCICE, pas celui de la séance : une
  // séance « pecs » contient trois exercices d'abdos, et le champ affirmait
  // « pectoraux » pendant qu'on les faisait. La fiche se réglait déjà comme ça,
  // le lecteur et elle se contredisaient.
  //
  // La bascule tombe pendant le repos sans rien de plus : `slotIndex` avance
  // avant que le repos démarre, donc l'exercice affiché est déjà le suivant.
  useFond(ex ? (COULEUR_PROGRAMME[ex.programme] ?? 'var(--papier)') : 'var(--papier)')

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
  const couleur = COULEUR_PROGRAMME[ex.programme]
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
    setDemarree(false)
    vibrer(d.reglages.vibration)
    // Enregistré immédiatement : si le téléphone se verrouille ici, rien n'est perdu.
    modifier((data) => {
      data.enCours = { id: `${templateId}-${debut.current}`, templateId, venue, debut: debut.current, series: suivant }
    })
    viderLaFile()

    if (derniereSerie) {
      appliquerProgression(ex.id, slot, suivant, echelle, echelonInitial)
      if (dernierSlot) return terminer(suivant)
      setSlotIndex(slotIndex + 1)
      demarrerRepos(slot.reposSec)
      return
    }
    demarrerRepos(slot.reposSec)
  }

  const demarrerRepos = (secondes: number) => {
    setReposTotal(Math.max(1, secondes))
    setRepos(secondes)
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
    viderLaFile()
    aller('/')
  }

  // La séance est déjà enregistrée à chaque série validée : quitter la met en pause,
  // ça ne la perd pas. On propose donc les deux, reprendre plus tard ou clore maintenant.
  const abandonner = () => {
    if (journal.length === 0) return aller('/')
    if (confirm('Mettre la séance en pause ? Tu la retrouveras sur l\'écran Aujourd\'hui.\n\nAnnuler pour la clore définitivement avec les séries déjà faites.')) {
      viderLaFile()
      aller('/')
    } else {
      terminer(journal)
    }
  }

  return (
    <div class="ecran lecteur" style={{ background: couleur, color: 'var(--sur-couleur)' }}>
      <Entete
        surCouleur
        gauche={
          <button onClick={abandonner} aria-label="Quitter la séance" style={{ minHeight: 'var(--cible)', minWidth: 'var(--cible)', display: 'flex', alignItems: 'center' }}>
            <Croix />
          </button>
        }
        centre={`Exercice ${slotIndex + 1} sur ${t.slots.length}`}
      />

      <div class="contenu" style={{ gap: '0' }}>
        {/* Ancré en haut, et le titre réserve deux lignes : centré avec le journal,
            l'en-tête montait et descendait à chaque changement d'état, et un nom
            court faisait remonter la dose et « La fiche ». */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '26px', minHeight: '50px' }}>{ex.nom}</h2>
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

        {/* Ancré sous l'en-tête, à sa taille naturelle : le mou se ramasse en bas,
            au-dessus du bouton. Centré, il ouvrait un vide de 100 px juste sous
            « La fiche » ; réparti dans les compteurs, il les faisait enfler. */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', paddingTop: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {Array.from({ length: totalSeries }, (_, i) => {
              const faite = faitesDuSlot[i]
              const active = i === serieIndex && repos === null
              // Le bloc bracketé porte toujours « ce que tu fais maintenant ». Pendant
              // le repos, c'est le repos : il garde sa place et son cadre au lieu de se
              // replier en ligne, sinon toute la liste remontait d'un coup.
              if (i === serieIndex && repos !== null) {
                return (
                  <Fragment key={i}>
                    <BlocRepos restant={repos} total={reposTotal} prochaine={i + 1} sur={totalSeries} />
                  </Fragment>
                )
              }
              const rangee = faite ? (
                // Plus de valeurs : la coche seule. Chiffrée, la série passée était
                // l'élément le plus contrasté de l'écran et tirait l'œil en arrière.
                <div style={ligneVoisine(0.55)}>
                  <span style={{ fontSize: '14px' }}>Série {i + 1}</span>
                  <Coche taille={18} />
                </div>
              ) : !active ? (
                <div style={ligneVoisine(0.4)}>
                  <span style={{ fontSize: '14px' }}>Série {i + 1}</span>
                  <span style={{ fontSize: '14px' }}>à venir</span>
                </div>
              ) : null
              const bloc = rangee ?? (
                <div style={BLOC_ACTIF}>
                  <TitreSerie index={i + 1} total={totalSeries} derniereFois={derniereFois} />

                  {echelle ? (
                    <div style={{ border: '1.5px solid var(--encre)', borderRadius: 'var(--r)', padding: '12px 14px', fontSize: '15px', fontWeight: 600 }}>
                      {echelle[echelonInitial]}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <Legende>Charge</Legende>
                      <Compteur valeur={kg} unite="kg" pas={d.reglages.pasCharge} min={0} onChange={setKg} />
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Legende>{demarree ? 'Reps réalisées' : 'Reps prévues'}</Legende>
                    <Compteur valeur={reps} unite="reps" pas={1} min={1} onChange={setReps} />
                  </div>
                </div>
              )

              return <Fragment key={i}>{bloc}</Fragment>
            })}
          </div>
        </div>
      </div>

      <div class="pied-lecteur">
        {repos !== null ? (
          <button class="principal" style={{ justifyContent: 'center' }} onClick={() => setRepos(null)}>
            <span>Passer le repos</span>
          </button>
        ) : !demarree ? (
          <button
            class="principal"
            style={{ justifyContent: 'center' }}
            onClick={() => {
              setDemarree(true)
              vibrer(d.reglages.vibration)
            }}
          >
            <Lecture couleur="var(--papier)" />
            <span>Démarrer la série</span>
          </button>
        ) : (
          <button class="principal" style={{ justifyContent: 'center' }} onClick={valider}>
            <Coche couleur="var(--papier)" />
            <span>{dernierSlot && derniereSerie ? 'Valider et terminer' : `Valider la série ${serieIndex + 1}`}</span>
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Séries faites et à venir : sans filet, et estompées. Encadrées comme avant,
 * elles faisaient de la liste un tableau où la série en cours n'était qu'une
 * ligne parmi d'autres.
 */
function ligneVoisine(opacite: number) {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 0',
    fontSize: '15px',
    opacity: opacite,
  }
}

/**
 * La série en cours est le seul élément dessiné de la liste : deux filets épais
 * la bracketent, ses voisines n'en ont aucun. C'est ce qui porte le focus, sans
 * introduire ni surface ni couleur nouvelle.
 */
const BLOC_ACTIF = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '10px',
  padding: '14px 0 18px',
  borderTop: '3px solid var(--encre)',
  borderBottom: '3px solid var(--encre)',
  margin: '4px 0',
}

/**
 * Le repos, dans le cadre qui portait les compteurs. Le temps est devenu l'objet
 * principal de l'écran au lieu d'un libellé glissé dans le bouton, et la barre
 * se vide pour qu'il se lise sans lire les chiffres.
 */
function BlocRepos({ restant, total, prochaine, sur }: { restant: number; total: number; prochaine: number; sur: number }) {
  const part = Math.max(0, Math.min(1, restant / total))
  return (
    <div style={BLOC_ACTIF} role="timer" aria-live="off" aria-label={`Repos, ${restant} secondes restantes`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
        <strong class="etiquette" style={{ fontSize: '13px' }}>
          Repos
        </strong>
        <span style={{ fontSize: '13px' }}>plus que</span>
      </div>

      <span
        class="chiffre"
        style={{ fontSize: 'clamp(48px, calc(var(--hauteur-fenetre, 100dvh) * 0.095), 76px)', lineHeight: 0.9 }}
      >
        {formatChrono(restant)}
      </span>

      {/* 6 px : à 4 px, et pleine au démarrage, la barre se confondait avec les
          filets de 3 px qui encadrent le bloc. */}
      <div style={{ height: '6px', background: 'rgba(20,24,26,0.22)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${part * 100}%`, background: 'var(--encre)' }} />
      </div>

      <span style={{ fontSize: '14px' }}>
        À venir · série {prochaine} sur {sur}
      </span>
    </div>
  )
}

function TitreSerie({ index, total, derniereFois }: { index: number; total: number; derniereFois: string | null }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
      <span
        style={{
          fontFamily: 'var(--titre)',
          fontWeight: 800,
          fontSize: 'clamp(26px, calc(var(--hauteur-fenetre, 100dvh) * 0.048), 40px)',
          letterSpacing: '-0.02em',
          lineHeight: 0.95,
        }}
      >
        Série {index} <span style={{ fontSize: '14px', fontWeight: 500, letterSpacing: 0 }}>sur {total}</span>
      </span>
      {derniereFois && <span style={{ fontSize: '13px', textAlign: 'right' }}>dernière fois {derniereFois}</span>}
    </div>
  )
}

/** Première fois sur un exercice chargé : faute de mieux, 35 % de l'haltère le plus
    lourd du club, arrondi au pas. Ce n'est pas une recommandation, juste un point
    de départ pour ne pas commencer à zéro — l'écran le dit explicitement. */
function chargeDeDepart(enregistree: number | undefined, halteresMax: number, pas: number): number {
  if (enregistree !== undefined && enregistree > 0) return enregistree
  const estimation = Math.round((halteresMax * 0.35) / pas) * pas
  return Math.max(pas, estimation)
}

function Legende({ children }: { children: ComponentChildren }) {
  return <span style={{ fontSize: '13px', fontWeight: 600 }}>{children}</span>
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
        // 52 px : à 68 les deux commandes pesaient autant que le chiffre, qui doit
        // rester l'objet principal. La cible tactile reste large, la cellule est
        // haute de 58 à 148 px.
        gridTemplateColumns: '52px minmax(0, 1fr) 52px',
        border: '1.5px solid var(--encre)',
        borderRadius: 'var(--r)',
        // Le compteur prend le mou du bloc plutôt que de le laisser en marge, avec
        // un plancher tactile et un plafond pour ne pas devenir un panneau.
        // Taille mesurée sur la fenêtre, pas sur le mou disponible : le bloc
        // qu'on regarde n'a pas à enfler parce que l'écran est grand.
        height: 'clamp(58px, calc(var(--hauteur-fenetre, 100dvh) * 0.118), 148px)',
        // Le chiffre suit la boîte, ce qui le garde proportionné à toute hauteur.
        containerType: 'size',
        overflow: 'hidden',
      }}
    >
      <button onClick={() => ajuste(-pas)} aria-label={`Moins ${pas} ${unite}`} style={{ borderRight: '1.5px solid var(--encre)', display: 'grid', placeItems: 'center' }}>
        <Moins taille={20} />
      </button>
      {saisie === null ? (
        <button
          onClick={() => setSaisie(String(valeur))}
          aria-label={`${valeur} ${unite}, appuie pour saisir au clavier`}
          /* L'unité est empilée sous le chiffre, pas accrochée à sa droite : elle
             partage le même axe vertical, donc le chiffre reste exactement centré
             tout en restant lisible. Accrochée en ligne, elle faisait pencher
             l'ensemble quel que soit l'axe retenu. */
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1px' }}
        >
          <span class="chiffre" style={{ fontSize: 'clamp(28px, 52cqh, 76px)', lineHeight: 0.9 }}>
            {valeur}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 500, opacity: 0.8, lineHeight: 1.1 }}>{unite}</span>
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
            fontSize: 'clamp(28px, 52cqh, 76px)',
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
        <Plus taille={20} />
      </button>
    </div>
  )
}

/**
 * Chaque morceau est écrit en mots. « 3 × 8–12 · 2 reps en réserve » était de la
 * sténo de salle : le « × » et le tiret de fourchette se décodent, et « reps en
 * réserve » est une traduction littérale de RIR qui ne dit pas quoi faire.
 */
function doseLisible(slot: Slot, echelle: string[] | undefined, echelon: number): string {
  const series = `${slot.series} série${slot.series > 1 ? 's' : ''}`
  if (slot.reps) return `${series} · ${slot.reps[0]} à ${slot.reps[1]} reps`
  if (slot.repsParCote) return `${series} · ${slot.repsParCote} reps par côté`
  if (slot.secondes) return `${series} · ${slot.secondes} s${echelle ? ` · ${echelle[echelon]}` : ''}`
  return series
}

function dernierePerf(seances: { series: SetLog[] }[], exerciceId: string): string | null {
  for (let i = seances.length - 1; i >= 0; i--) {
    const s = seances[i]!
    const derniere = [...s.series].reverse().find((x) => x.exerciceId === exerciceId)
    if (derniere) return derniere.kg ? `${derniere.kg} kg × ${derniere.reps}` : `${derniere.reps} reps`
  }
  return null
}

