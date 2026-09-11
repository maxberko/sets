import type { ComponentChildren } from 'preact'
import { aller, useChemin } from '../lib/routeur'
import { Retour } from './icones'

/**
 * Trois onglets depuis que le suivi a rejoint l'accueil. À quatre colonnes égales,
 * « Aujourd'hui » et « Programme » se touchaient pendant que « Suivi » et
 * « Science » flottaient ; à trois, les libellés ont la place qu'il leur faut.
 */
const ONGLETS: { vers: string; nom: string }[] = [
  { vers: '/', nom: "Aujourd'hui" },
  { vers: '/programme', nom: 'Programme' },
  { vers: '/science', nom: 'Science' },
]

export function BarreOnglets() {
  const c = useChemin()
  return (
    <nav
      style={{
        background: 'var(--papier)',
        position: 'sticky',
        bottom: 0,
        padding: `0 var(--gouttiere) calc(18px + var(--barre-bas))`,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${ONGLETS.length}, minmax(0, 1fr))`, borderTop: '1.5px solid var(--encre)' }}>
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
                padding: '14px 0 4px',
                textAlign: 'center',
                color: 'var(--encre)',
                opacity: actif ? 1 : 0.45,
                borderTop: actif ? '3px solid var(--encre)' : '3px solid transparent',
                marginTop: '-1.5px',
                minHeight: 'var(--cible)',
              }}
            >
              {o.nom}
            </button>
          )
        })}
      </div>
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

export function Titre({ titre, apres, action }: { titre: string; apres?: ComponentChildren; action?: ComponentChildren }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <h1>{titre}</h1>
        {action}
      </div>
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
