import { useEffect, useState } from 'preact/hooks'
import type { ComponentChildren } from 'preact'
import { Coche, Fleche } from '../composants/icones'
import { FORMULES } from '../data'
import type { Formule } from '../data/seances'
import { modifier, useDonnees } from '../lib/etat'
import { aller } from '../lib/routeur'

interface EvenementInstall extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function Installation() {
  const d = useDonnees()
  const [etape, setEtape] = useState(0)
  const [invite, setInvite] = useState<EvenementInstall | null>(null)

  useEffect(() => {
    const f = (e: Event) => {
      e.preventDefault()
      setInvite(e as EvenementInstall)
    }
    addEventListener('beforeinstallprompt', f)
    return () => removeEventListener('beforeinstallprompt', f)
  }, [])

  const terminer = () => {
    modifier((data) => {
      data.reglages.onboarde = true
      data.reglages.debutBloc = new Date().toISOString().slice(0, 10)
    })
    aller('/')
  }

  return (
    <div class="ecran" style={{ paddingTop: 'calc(var(--barre-haut) + 44px)' }}>
      <div class="contenu" style={{ paddingBottom: 'calc(40px + var(--barre-bas))', gap: '22px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span class="etiquette discret">{etape === 0 ? '1 sur 2' : '2 sur 2'}</span>
          <h1 style={{ fontSize: etape === 0 ? '52px' : '40px', lineHeight: 0.95 }}>
            {etape === 0 ? 'Sets' : 'À ton rythme'}
          </h1>
        </div>

        {etape === 0 ? (
          <>
            <Bloc couleur="var(--mobilite)" titre="Des exercices adaptés au surf">
              <Liste
                items={[
                  'Mobilité, pour les genoux et les hanches',
                  'Renforcement du haut du corps, pour la rame, le take-off et l’engagement',
                  'Renforcement du bas du corps : abdominaux, genoux, hanches, lombaires',
                ]}
              />
            </Bloc>

            <Bloc couleur="var(--pecs)" titre="Adossé à la science">
              <p style={{ fontSize: '15px', lineHeight: 1.5 }}>
                Chaque exercice est tiré de la littérature scientifique, appliquée au surf et au renforcement musculaire naturel.
                Chaque fiche porte ses sources, et l’onglet Science explique le raisonnement derrière le programme.
              </p>
            </Bloc>

            <Bloc couleur="var(--abdos)" titre="À ton rythme">
              <p style={{ fontSize: '15px', lineHeight: 1.5 }}>
                Trois formules, de la plus légère à la plus soutenue, selon le temps que tu peux y mettre. Tu choisis à l’écran
                suivant et tu peux changer quand tu veux.
              </p>
            </Bloc>

            <button class="principal" onClick={() => setEtape(1)}>
              <span>Choisir ma formule</span>
              <Fleche couleur="var(--papier)" />
            </button>
          </>
        ) : (
          <>
            <p style={{ fontSize: '15px', lineHeight: 1.5 }}>
              Elles ne changent pas le contenu des séances, seulement combien tu en fais par semaine. Un plan qu’on ne tient pas
              ne vaut rien, donc prends la plus honnête.
            </p>

            {FORMULES.map((f) => (
              <ChoixFormule key={f.id} id={f.id} choisie={d.reglages.formule === f.id} />
            ))}

            {invite && (
              <button
                class="secondaire"
                onClick={async () => {
                  await invite.prompt()
                  await invite.userChoice
                  setInvite(null)
                }}
              >
                Ajouter Sets à l’écran d’accueil
              </button>
            )}

            <button class="principal" onClick={terminer}>
              <span>Démarrer la semaine 1</span>
              <Fleche couleur="var(--papier)" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function ChoixFormule({ id, choisie }: { id: Formule; choisie: boolean }) {
  const f = FORMULES.find((x) => x.id === id)!
  const heures = Math.floor(f.minutes / 60)
  const minutes = f.minutes % 60
  return (
    <button
      onClick={() => modifier((data) => void (data.reglages.formule = id))}
      aria-pressed={choisie}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
        textAlign: 'left',
        border: '1.5px solid var(--encre)',
        borderRadius: 'var(--r)',
        padding: '16px',
        background: choisie ? 'var(--encre)' : 'transparent',
        color: choisie ? 'var(--papier)' : 'var(--encre)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', width: '100%' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--titre)', fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>{f.nom}</span>
          {choisie && <Coche taille={18} couleur="var(--papier)" />}
        </span>
        <span class="num" style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
          {f.seances} séances · {minutes ? `${heures} h ${minutes}` : `${heures} h`}
        </span>
      </span>
      <span style={{ fontSize: '15px' }}>{f.resume}</span>
      <span style={{ fontSize: '13px', lineHeight: 1.45, opacity: choisie ? 0.85 : 0.7 }}>{f.compromis}</span>
    </button>
  )
}

function Bloc({ couleur, titre, children }: { couleur: string; titre: string; children: ComponentChildren }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1.5px solid var(--encre)', paddingTop: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span class="pastille" style={{ background: couleur }} />
        <h3 style={{ fontFamily: 'var(--titre)', fontWeight: 700, fontSize: '19px', letterSpacing: '-0.01em' }}>{titre}</h3>
      </div>
      {children}
    </section>
  )
}

function Liste({ items }: { items: string[] }) {
  return (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: 0, padding: 0, listStyle: 'none', fontSize: '15px', lineHeight: 1.45 }}>
      {items.map((t, i) => (
        <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}>
          <span style={{ width: '6px', height: '6px', background: 'var(--encre)', borderRadius: '1px', flex: 'none', position: 'relative', top: '-2px' }} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}
