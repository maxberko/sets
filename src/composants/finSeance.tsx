import type { ComponentChildren } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { FIN_SURF } from '../data/surf'
import { lienBoucleMuette } from './demonstration'

/**
 * La fin de séance : une vague de Teahupo'o en plein écran, sans son, et le bilan
 * par-dessus. Commune aux deux lecteurs — côté force elle crée l'écran de fin qui
 * manquait, côté mobilité elle porte la question qui fait monter les durées.
 *
 * Le texte repose sur un aplat d'encre translucide, pas sur un dégradé : le
 * système n'en a aucun ailleurs. Au pire, de l'écume blanche sous l'aplat, le
 * papier garde un contraste de 8:1.
 *
 * Le fond du document reste à la charge du lecteur qui l'affiche, qui doit passer
 * à l'encre : deux `useFond` imbriqués se démontent ensemble, et le dernier à
 * restaurer remettait la couleur de l'exercice sur l'accueil.
 */
export function FinSeance({
  bilan,
  children,
  revenir,
}: {
  bilan: string
  children?: ComponentChildren
  /** Absent quand c'est la réponse à une question qui clôt l'écran. */
  revenir?: () => void
}) {
  // Pas de vidéo qui démarre seule chez qui a demandé moins de mouvement :
  // l'image fixe de la même vague la remplace.
  const calme = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const v = FIN_SURF.video

  // L'image fixe reste posée sur l'iframe tant que la lecture n'a pas démarré :
  // sinon on voit d'abord l'habillage de YouTube, gros bouton « play » au milieu,
  // le temps que la vidéo se lance. On ne la retire pas sur un simple délai mais
  // sur l'état du lecteur — si l'autoplay est refusé par le navigateur, l'écran
  // garde la photo de la vague plutôt que d'afficher ce bouton.
  const cadre = useRef<HTMLIFrameElement>(null)
  const [joue, setJoue] = useState(false)

  useEffect(() => {
    if (calme || joue) return
    let minuterie: ReturnType<typeof setTimeout> | undefined
    const recoit = (e: MessageEvent) => {
      if (!e.origin.endsWith('youtube-nocookie.com') && !e.origin.endsWith('youtube.com')) return
      try {
        const d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        // 1 = en lecture, dans la convention du lecteur YouTube. On attend une
        // seconde de plus : au démarrage, YouTube pose son titre et ses commandes
        // par-dessus l'image, puis les efface. Lever le voile pile à cet instant
        // revenait à troquer le bouton « play » contre le reste de l'habillage.
        // Armée une seule fois : le lecteur répète son état plusieurs fois par
        // seconde, et réarmer à chaque message repoussait le voile indéfiniment.
        if ((d?.info?.playerState === 1 || d?.info === 1) && minuterie === undefined) {
          minuterie = setTimeout(() => setJoue(true), 1100)
        }
      } catch {
        /* message qui ne nous concerne pas */
      }
    }
    addEventListener('message', recoit)

    // Le lecteur n'envoie rien tant qu'on ne s'est pas annoncé. On réessaie
    // jusqu'à ce qu'il réponde : l'appli peut être en arrière-plan au moment où
    // l'écran s'ouvre, et la lecture ne démarre qu'au retour.
    let essais = 0
    const id = setInterval(() => {
      essais += 1
      if (essais > 240) return clearInterval(id)
      cadre.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }),
        '*',
      )
    }, 250)

    return () => {
      removeEventListener('message', recoit)
      clearInterval(id)
      clearTimeout(minuterie)
    }
  }, [calme, joue])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--encre)', color: 'var(--papier)', overflow: 'hidden' }}>
      {calme ? (
        <img
          src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        // Recouvrement façon « cover » : une iframe ne connaît pas object-fit, donc
        // on la dimensionne pour déborder l'écran dans les deux sens et on la
        // centre. En portrait, les bords coupés emportent le titre et le logo que
        // YouTube pose dans les coins au chargement.
        <iframe
          ref={cadre}
          src={lienBoucleMuette(v, true)}
          title={`Surf à ${FIN_SURF.lieu}`}
          aria-hidden="true"
          tabIndex={-1}
          allow="autoplay; encrypted-media; picture-in-picture"
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 'max(100vw, calc(var(--hauteur-fenetre, 100dvh) * 16 / 9))',
            height: 'max(var(--hauteur-fenetre, 100dvh), calc(100vw * 9 / 16))',
            transform: 'translate(-50%, -50%)',
            border: 'none',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Un aplat d'encre, pas la vignette de la vidéo : celle-ci porte un « 4K »
          jaune en travers de l'image, et de toute façon la vague qu'on montre est
          à dix-sept minutes du début. */}
      {!calme && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--encre)',
            opacity: joue ? 0 : 1,
            transition: 'opacity 600ms ease',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          maxWidth: '480px',
          margin: '0 auto',
          padding: `26px var(--gouttiere) calc(24px + var(--barre-bas))`,
          background: 'rgba(20, 24, 26, 0.78)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <span style={{ fontSize: '12px', opacity: 0.75 }}>
          {FIN_SURF.lieu} · {v.videoCreator}
        </span>
        <h1 style={{ fontSize: '48px', lineHeight: 0.95, color: 'var(--papier)' }}>C'est fait</h1>
        <p style={{ fontSize: '17px' }}>{bilan}</p>
        {children}
        {revenir && (
          <button onClick={revenir} style={BOUTON_PLEIN}>
            Revenir à l'accueil
          </button>
        )}
      </div>
    </div>
  )
}

/** Les boutons de l'écran de fin sont posés sur l'encre : pleins de papier, ou cernés. */
export const BOUTON_PLEIN = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '56px',
  width: '100%',
  borderRadius: 'var(--r)',
  background: 'var(--papier)',
  color: 'var(--encre)',
  fontWeight: 600,
  fontSize: '17px',
}

export const BOUTON_CERNE = {
  ...BOUTON_PLEIN,
  minHeight: 'var(--cible)',
  background: 'transparent',
  color: 'var(--papier)',
  border: '1.5px solid var(--papier)',
  fontSize: '15px',
}

/** « 6 exercices · 38 minutes », au singulier quand il le faut. */
export function bilanDeSeance(exercices: number, minutes: number): string {
  return `${exercices} exercice${exercices > 1 ? 's' : ''} · ${minutes} minute${minutes > 1 ? 's' : ''}`
}
