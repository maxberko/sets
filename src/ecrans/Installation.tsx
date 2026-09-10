import { useEffect, useState } from 'preact/hooks'
import { Fleche } from '../composants/icones'
import { modifier, useDonnees } from '../lib/etat'
import { aller } from '../lib/routeur'
import { exercice } from '../data'

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

  const pompes = exercice('pompes-lestees')
  const echelle = pompes?.echelle ?? []
  const echelonActuel = d.progression.echelons['pompes-lestees'] ?? 1

  const terminer = () => {
    modifier((data) => {
      data.reglages.onboarde = true
      data.reglages.debutBloc = new Date().toISOString().slice(0, 10)
    })
    aller('/')
  }

  return (
    <div class="ecran" style={{ paddingTop: 'calc(var(--barre-haut) + 44px)' }}>
      <div class="contenu" style={{ paddingBottom: 'calc(40px + var(--barre-bas))' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span class="etiquette discret">Étape {etape + 1} sur 2</span>
          <h1 style={{ fontSize: '44px', lineHeight: 0.95 }}>
            {etape === 0 ? 'Sets' : 'Ton niveau de pompes'}
          </h1>
        </div>

        {etape === 0 && (
          <>
            <p style={{ fontSize: '17px', lineHeight: 1.5 }}>
              Deux séances de force par semaine pour les pectoraux et les abdominaux, trois séances de mobilité pour les genoux et
              les hanches. Rien n'est calé sur tes sessions de surf : l'appli ne te demandera jamais quand tu vas à l'eau.
            </p>
            <p class="discret" style={{ fontSize: '15px', lineHeight: 1.5 }}>
              Chaque exercice porte ses sources, et les exercices de mobilité portent un point : plein quand un essai clinique le
              soutient, creux quand il ne repose que sur l'usage clinique. Rien ici n'est vendu comme de la prévention si la preuve
              n'existe pas.
            </p>
            <button class="principal" onClick={() => setEtape(1)}>
              <span>Commencer</span>
              <Fleche couleur="var(--papier)" />
            </button>
          </>
        )}

        {etape === 1 && (
          <>
            <p style={{ fontSize: '15px', lineHeight: 1.5 }}>
              Les jours sans salle, la séance tourne sur une échelle de pompes. Choisis l'échelon où tu tiens huit répétitions
              propres. L'appli montera toute seule à partir de là.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {echelle.map((e, i) => {
                const actuel = i === echelonActuel
                return (
                  <button
                    key={i}
                    onClick={() => modifier((data) => void (data.progression.echelons['pompes-lestees'] = i))}
                    class="rangee"
                    style={{ fontWeight: actuel ? 600 : 400 }}
                  >
                    <span>{e}</span>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: '1.5px solid var(--encre)',
                        background: actuel ? 'var(--encre)' : 'transparent',
                        flex: 'none',
                      }}
                    />
                  </button>
                )
              })}
            </div>

            {invite && (
              <button
                class="secondaire"
                onClick={async () => {
                  await invite.prompt()
                  await invite.userChoice
                  setInvite(null)
                }}
              >
                Ajouter Sets à l'écran d'accueil
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
