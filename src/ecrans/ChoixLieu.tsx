import { BoutonRetour, Entete } from '../composants/communs'
import { Fleche } from '../composants/icones'
import { COULEUR_PROGRAMME, exerciceDuSlot, seance } from '../data'
import { useDonnees } from '../lib/etat'
import { aller } from '../lib/routeur'
import type { Venue } from '../data/types'

export function ChoixLieu({ templateId }: { templateId: string }) {
  const d = useDonnees()
  const t = seance(templateId)
  if (!t) return <Introuvable />

  const liste = (venue: Venue) =>
    t.slots
      .map((s) => exerciceDuSlot(s, venue)?.nom)
      .filter(Boolean)
      .join(' · ')

  const echelonExemple = (() => {
    const slot = t.slots.find((s) => exerciceDuSlot(s, 'tapis')?.echelle)
    if (!slot) return null
    const ex = exerciceDuSlot(slot, 'tapis')
    if (!ex?.echelle) return null
    const i = d.progression.echelons[ex.id] ?? 1
    return ex.echelle[Math.min(i, ex.echelle.length - 1)]
  })()

  return (
    <div class="ecran">
      <Entete gauche={<BoutonRetour label={t.sousTitre} />} />
      <div class="contenu">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{ fontSize: '40px', lineHeight: 0.95 }}>Tu t'entraînes où aujourd'hui ?</h1>
          <p class="discret" style={{ fontSize: '15px' }}>
            Même séance, même volume, mêmes séries comptées dans ton suivi. Seuls les exercices changent.
          </p>
        </div>

        <button class="bloc-couleur" style={{ background: COULEUR_PROGRAMME[t.programme] }} onClick={() => aller(`/seance/${t.id}/salle`)}>
          <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%' }}>
            <span style={{ fontFamily: 'var(--titre)', fontWeight: 800, fontSize: '30px', lineHeight: 1 }}>Salle</span>
            <span class="etiquette">Basic-Fit · {t.minutes.salle} min</span>
          </span>
          <span style={{ fontSize: '14px', lineHeight: 1.5 }}>{liste('salle')}</span>
          <span class="bloc-pied">
            <span>Commencer en salle</span>
            <Fleche />
          </span>
        </button>

        <button
          onClick={() => aller(`/seance/${t.id}/tapis`)}
          class="bloc-couleur"
          style={{ background: 'transparent', border: '1.5px solid var(--encre)' }}
        >
          <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%' }}>
            <span style={{ fontFamily: 'var(--titre)', fontWeight: 800, fontSize: '30px', lineHeight: 1 }}>Tapis</span>
            <span class="etiquette discret">Rien d'autre · {t.minutes.tapis} min</span>
          </span>
          <span style={{ fontSize: '14px', lineHeight: 1.5 }}>{liste('tapis')}</span>
          <span class="bloc-pied" style={{ borderTop: '1px solid var(--filet)' }}>
            <span>Commencer sur tapis</span>
            <Fleche />
          </span>
        </button>

        <p class="discret" style={{ fontSize: '14px', lineHeight: 1.45 }}>
          Sur tapis, la charge monte par l'échelle de difficulté.
          {echelonExemple ? ` Ton dernier échelon : ${echelonExemple.toLowerCase()}.` : ''} Une machine manque en salle ? L'exercice bascule
          tout seul, la séance continue.
        </p>
        <div style={{ height: '12px' }} />
      </div>
    </div>
  )
}

export function Introuvable() {
  return (
    <div class="ecran">
      <Entete gauche={<BoutonRetour />} />
      <div class="contenu">
        <h1>Page introuvable</h1>
        <button class="secondaire" onClick={() => aller('/')}>
          Revenir à aujourd'hui
        </button>
      </div>
    </div>
  )
}
