import { useEffect, useState } from 'preact/hooks'
import { seance } from './data'
import type { Venue } from './data/types'
import { initEtat, useDonnees } from './lib/etat'
import { segments, useChemin } from './lib/routeur'
import { Aujourdhui } from './ecrans/Aujourdhui'
import { ChoixLieu, Introuvable } from './ecrans/ChoixLieu'
import { Fiche } from './ecrans/Fiche'
import { Installation } from './ecrans/Installation'
import { LecteurForce } from './ecrans/LecteurForce'
import { LecteurMobilite } from './ecrans/LecteurMobilite'
import { Programme } from './ecrans/Programme'
import { Reglages } from './ecrans/Reglages'
import { Science } from './ecrans/Science'
import { Suivi } from './ecrans/Suivi'

export function App() {
  const [pret, setPret] = useState(false)
  const chemin = useChemin()
  const d = useDonnees()

  useEffect(() => {
    void initEtat().then(() => setPret(true))
  }, [])

  if (!pret) return <Chargement />
  if (!d.reglages.onboarde) return <Installation />

  const s = segments(chemin)

  if (s.length === 0) return <Aujourdhui />

  switch (s[0]) {
    case 'programme':
      return <Programme />
    case 'suivi':
      return <Suivi />
    case 'science':
      return <Science />
    case 'reglages':
      return <Reglages />
    case 'exercice':
      return s[1] ? <Fiche id={s[1]} /> : <Introuvable />
    case 'seance': {
      const id = s[1]
      if (!id || !seance(id)) return <Introuvable />
      const venue = s[2]
      if (!venue) return <ChoixLieu templateId={id} />
      if (venue !== 'salle' && venue !== 'tapis') return <Introuvable />
      const t = seance(id)!
      return t.programme === 'mobilite' ? (
        <LecteurMobilite templateId={id} />
      ) : (
        <LecteurForce templateId={id} venue={venue as Venue} />
      )
    }
    default:
      return <Introuvable />
  }
}

function Chargement() {
  return (
    <div class="ecran" style={{ placeContent: 'center', paddingTop: 0 }}>
      <div class="contenu" style={{ flex: 'none', alignItems: 'flex-start' }}>
        <h1 style={{ fontSize: '44px' }}>Sets</h1>
      </div>
    </div>
  )
}
