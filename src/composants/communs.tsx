import type { ComponentChildren } from 'preact'
import { aller, useChemin } from '../lib/routeur'
import { Retour } from './icones'

const ONGLETS: { vers: string; nom: string }[] = [
  { vers: '/', nom: "Aujourd'hui" },
  { vers: '/programme', nom: 'Programme' },
  { vers: '/suivi', nom: 'Suivi' },
  { vers: '/science', nom: 'Science' },
]

export function BarreOnglets() {
  const c = useChemin()
  return (
    <nav
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        borderTop: '1.5px solid var(--encre)',
        padding: `0 20px calc(20px + var(--barre-bas))`,
        background: 'var(--papier)',
        position: 'sticky',
        bottom: 0,
      }}
    >
      {ONGLETS.map((o) => {
        const actif = o.vers === '/' ? c === '/' : c.startsWith(o.vers)
        return (
          <button
            key={o.vers}
            onClick={() => aller(o.vers)}
            aria-current={actif ? 'page' : undefined}
            style={{
              fontFamily: 'var(--titre)',
              fontWeight: 600,
              fontSize: '14px',
              padding: '16px 0 6px',
              textAlign: 'center',
              color: actif ? 'var(--encre)' : 'var(--sourdine)',
              borderTop: actif ? '3px solid var(--encre)' : '3px solid transparent',
              marginTop: '-1.5px',
              minHeight: 'var(--cible)',
            }}
          >
            {o.nom}
          </button>
        )
      })}
    </nav>
  )
}

export function Entete({
  gauche,
  centre,
  droite,
  surCouleur,
  statique,
}: {
  gauche?: ComponentChildren
  centre?: ComponentChildren
  droite?: ComponentChildren
  surCouleur?: boolean
  /** Pour les pages qui défilent sous un bandeau coloré : sinon le bouton reste
      collé en haut et flotte au-dessus du texte blanc. */
  statique?: boolean
}) {
  const classes = ['entete', surCouleur ? 'sur-couleur' : '', statique ? 'statique' : ''].filter(Boolean).join(' ')
  return (
    <header class={classes}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '24px' }}>{gauche}</div>
      <div class="etiquette" style={{ textAlign: 'center', flex: 1 }}>
        {centre}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', minWidth: '24px' }}>{droite}</div>
    </header>
  )
}

export function BoutonRetour({ label = 'Retour' }: { label?: string }) {
  return (
    <button
      onClick={() => history.length > 1 ? history.back() : aller('/')}
      aria-label={label}
      style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: 'var(--cible)', fontSize: '14px', fontWeight: 500 }}
    >
      <Retour />
      <span>{label}</span>
    </button>
  )
}

export function Titre({ titre, apres }: { titre: string; apres?: ComponentChildren }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
      <h1>{titre}</h1>
      {apres && <div class="etiquette discret">{apres}</div>}
    </div>
  )
}

export function Section({ titre, children }: { titre: string; children: ComponentChildren }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h3>{titre}</h3>
      {children}
    </section>
  )
}
