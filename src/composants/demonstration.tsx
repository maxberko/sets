import { useRef, useState } from 'preact/hooks'
import { Lecture } from './icones'
import type { Exercise } from '../data/types'

/**
 * Vignette cliquable qui laisse place à une boucle muette et sans habillage.
 * Utilisée par le lecteur de mobilité et par la fiche d'exercice : la vidéo ne
 * quitte jamais l'application, aucun onglet tiers ne s'ouvre.
 *
 * `cle` remet la vignette en place quand on change d'exercice.
 * Le composant remplit son conteneur : c'est à l'appelant de lui donner une
 * hauteur.
 */
export function Demonstration({ ex, cle }: { ex: Exercise; cle: string }) {
  const [joue, setJoue] = useState(false)
  const vue = useRef(cle)
  if (vue.current !== cle) {
    vue.current = cle
    if (joue) setJoue(false)
  }
  const v = ex.video
  if (!v?.youtubeId) return null

  const cadre = {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    minHeight: '150px',
    background: '#14181a',
    borderRadius: 'var(--r)',
    overflow: 'hidden',
  }

  if (!joue) {
    return (
      <button
        onClick={() => setJoue(true)}
        aria-label={`Voir la démonstration de ${ex.nom}`}
        style={cadre}
      >
        <img
          src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: 'scale(1.34)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '12px 14px',
            background: 'linear-gradient(to top, rgba(20,24,26,0.85) 0%, rgba(20,24,26,0.35) 45%, rgba(20,24,26,0.1) 100%)',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--papier)' }}>{v.videoCreator ?? v.creator}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: 600, color: 'var(--papier)' }}>
            <Lecture taille={14} couleur="var(--papier)" />
            Voir le mouvement
          </span>
        </span>
      </button>
    )
  }

  // Boucle muette sans habillage : c'est une référence visuelle, pas une vidéo à
  // regarder. cc_load_policy=0 coupe les sous-titres automatiques — ils s'affichaient
  // en anglais approximatif par-dessus l'image dans une appli française. control=0
  // retire au passage le bouton « Watch on YouTube », donc plus rien qui sorte d'ici.
  const p = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: v.youtubeId,
    controls: '0',
    cc_load_policy: '0',
    disablekb: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    iv_load_policy: '3',
  })
  if (v.start !== undefined) p.set('start', String(v.start))
  if (v.end !== undefined) p.set('end', String(v.end))

  return (
    <div style={cadre}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?${p.toString()}`}
        title={`Démonstration : ${ex.nom}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', display: 'block' }}
      />
    </div>
  )
}
