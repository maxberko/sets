import { useEffect, useState } from 'preact/hooks'
import type { ComponentChildren } from 'preact'
import { Coche, Fleche } from '../composants/icones'
import { BandeSemaine } from '../composants/bandeSemaine'
import { COULEUR_PROGRAMME, FORMULES, NOM_PROGRAMME, planDe, seance, seriesParProgramme } from '../data'
import { JOURS, type Formule } from '../data/seances'
import { jourDe } from '../lib/semaine'
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
            <SemaineFormule formule={d.reglages.formule} />

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
      {/* Sur sa propre ligne : la mettre à côté du nom débordait l'en-tête sur un
          téléphone étroit, et rognait la durée. En bandeau, elle donne en plus à la
          formule conseillée la hauteur qui la distingue des deux autres. */}
      {f.conseillee && (
        <span
          class="etiquette"
          style={{
            alignSelf: 'flex-start',
            border: '1px solid currentColor',
            borderRadius: '999px',
            padding: '2px 8px 1px',
            fontSize: '10px',
            letterSpacing: '0.06em',
            opacity: 0.75,
            whiteSpace: 'nowrap',
          }}
        >
          Conseillée
        </span>
      )}

      <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '4px 12px', width: '100%', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--titre)', fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>{f.nom}</span>
          {choisie && <Coche taille={18} couleur="var(--papier)" />}
        </span>
        <span class="num" style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
          {f.seances} séances · {minutes ? `${heures} h ${minutes}` : `${heures} h`}
        </span>
      </span>
      <span style={{ fontSize: '15px' }}>{f.resume}</span>
      {/* Une ligne, pas un paragraphe : de quoi comparer trois choix d'un coup
          d'œil. Le détail chiffré reste dans `compromis`, pour un écran qui a la
          place de le porter. */}
      <span style={{ fontSize: '13px', lineHeight: 1.4, opacity: choisie ? 0.8 : 0.62 }}>{f.impact}</span>
    </button>
  )
}

/**
 * La semaine de la formule choisie, du lundi au samedi. Le dimanche est écarté :
 * il est vide dans les trois formules, et une colonne toujours grise n'apprend
 * rien à quelqu'un qui découvre l'appli.
 *
 * C'est la seule chose de cet écran qui bouge quand on change de formule. Les
 * trois cartes disent un nombre de séances ; le calendrier montre à quoi
 * ressemble la semaine, ce qui est la vraie question qu'on se pose là.
 *
 * Elle ouvre l'écran, avant les trois cartes : on vient y choisir un rythme, et
 * une semaine dessinée répond à ça plus vite qu'une phrase.
 */
function SemaineFormule({ formule }: { formule: Formule }) {
  const plan = planDe(formule)
  const jours = JOURS.slice(0, 6)

  // Une séance de force travaille deux programmes : le haut des pectoraux compte
  // aussi ses abdominaux. La légende les liste tous, sinon la bande montre deux
  // traits le lundi sans dire que le second est l'abdo.
  const programmes: string[] = []
  for (const j of jours) {
    for (const id of plan[j] ?? []) {
      const t = seance(id)
      if (!t) continue
      for (const p of Object.keys(seriesParProgramme(t, 'salle'))) if (!programmes.includes(p)) programmes.push(p)
    }
  }

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* La même bande que l'accueil : un trait fin par programme. Des pastilles
          nommées, essayées d'abord, écrasaient l'écran — à trois formules et deux
          programmes par séance de force, ça faisait un mur de couleur. */}
      <BandeSemaine plan={plan} jourActuel={jourDe(new Date())} faites={[]} jours={jours} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px' }}>
        {programmes.map((p) => (
          <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '1px', background: COULEUR_PROGRAMME[p], flex: 'none' }} />
            {NOM_PROGRAMME[p]}
          </span>
        ))}
      </div>

    </section>
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
