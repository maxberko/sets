import { useEffect, useState } from 'preact/hooks'
import { Fleche, PointPreuve } from '../composants/icones'
import { modifier } from '../lib/etat'
import { aller } from '../lib/routeur'

interface EvenementInstall extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Un seul écran. Aucune question : l'échelle de pompes part d'un échelon moyen et le
 * moteur la corrige en deux séances, l'équipement du club vit dans les réglages.
 * Ce qui reste ici, c'est ce qu'on ne devinerait pas en utilisant l'appli.
 */
export function Installation() {
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h1 style={{ fontSize: '52px', lineHeight: 0.95 }}>Sets</h1>
          <p style={{ fontSize: '17px', lineHeight: 1.5 }}>
            Deux séances de force par semaine pour les pectoraux et les abdominaux, trois séances de mobilité de quatorze minutes
            pour les genoux et les hanches. Huit semaines, puis ça recommence avec tes charges.
          </p>
        </div>

        <Point couleur="var(--mobilite)" titre="Rien n'est calé sur le surf">
          L'appli ne te demandera jamais quand tu vas à l'eau. La mobilité se fait hors de l'eau, quand tu veux dans la journée.
          C'est aussi le choix le mieux étayé : l'échauffement avant l'effort n'a presque rien démontré, le renforcement des
          hanches et des genoux, si.
        </Point>

        <Point couleur="var(--pecs)" titre="Salle ou tapis, au choix du jour">
          Chaque séance de force pose la question au départ. Les deux réponses donnent la même séance : mêmes créneaux, même
          nombre de séries, même volume compté dans ton suivi. En salle la charge monte en kilos, sur le tapis elle monte d'un
          échelon de pompes, et les deux progressent séparément.
        </Point>

        <Point couleur="var(--pecs)" titre="C'est l'appli qui décide la charge">
          Tu valides tes séries, elle calcule la suite. Toutes les séries au sommet de la fourchette et la prochaine fois est plus
          lourde. Deux séances sous le bas de la fourchette et elle allège. Tu n'as jamais à trancher.
        </Point>

        <Point couleur="var(--abdos)" titre="Le point de preuve">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <PointPreuve plein taille={8} /> plein
          </span>{' '}
          : un essai clinique soutient le fait de faire cet exercice.{' '}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <PointPreuve plein={false} taille={8} /> creux
          </span>{' '}
          : ça repose sur l'anatomie et l'usage clinique, sans essai. Rien de creux n'est présenté comme de la prévention. Chaque
          fiche porte ses sources, et l'onglet Science explique le programme.
        </Point>

        <Point couleur="var(--sourdine)" titre="Tout reste sur ce téléphone">
          Aucun compte, aucun serveur, rien n'est envoyé nulle part. C'est pour ça qu'une sauvegarde vaut le coup : l'export est
          dans les réglages.
        </Point>

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
      </div>
    </div>
  )
}

function Point({
  couleur,
  titre,
  children,
}: {
  couleur: string
  titre: string
  children: preact.ComponentChildren
}) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1.5px solid var(--encre)', paddingTop: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span class="pastille" style={{ background: couleur }} />
        <h3 style={{ fontFamily: 'var(--titre)', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.01em' }}>{titre}</h3>
      </div>
      <p style={{ fontSize: '15px', lineHeight: 1.5 }}>{children}</p>
    </section>
  )
}
