import { useState } from 'preact/hooks'
import type { ComponentChildren } from 'preact'
import { BoutonRetour, Entete } from '../composants/communs'
import { Chevron, PointPreuve } from '../composants/icones'
import { COULEUR_PROGRAMME, NOM_PROGRAMME, exercice, sourcesFor } from '../data'
import type { Exercise } from '../data/types'
import { useDonnees } from '../lib/etat'
import { Introuvable } from './ChoixLieu'

/**
 * Carte de référence, pas document. On ouvre cette fiche pour vérifier un point
 * pendant une séance, donc ne reste visible que ce qui sert à ce moment-là :
 * la vidéo, les trois points clés, et le ressenti — seule chose qu'une vidéo ne
 * peut pas transmettre. Les étapes écrites doublaient la vidéo, les erreurs
 * disaient les points clés à l'envers, et le pourquoi se lit une fois : replié.
 */
export function Fiche({ id }: { id: string }) {
  const d = useDonnees()
  const ex = exercice(id)
  if (!ex) return <Introuvable />

  const couleur = COULEUR_PROGRAMME[ex.programme]
  const sources = sourcesFor(ex.sources)
  const echelon = ex.echelle ? Math.min(d.progression.echelons[ex.id] ?? 1, ex.echelle.length - 1) : null

  return (
    <div class="ecran" style={{ paddingTop: 0 }}>
      <div style={{ background: couleur, color: 'var(--sur-couleur)', padding: `calc(var(--barre-haut) + 14px) var(--gouttiere) 20px` }}>
        <Entete statique surCouleur gauche={<BoutonRetour label={NOM_PROGRAMME[ex.programme]} />} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px' }}>
          <h1 style={{ fontSize: '36px', lineHeight: 0.95 }}>{ex.nom}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '14px' }}>
            <span>{ex.resume}</span>
            {ex.evidence && (
              <>
                <span style={{ opacity: 0.5 }}>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <PointPreuve plein={ex.evidence === 'pleine'} />
                  {ex.evidence === 'pleine' ? 'essai clinique' : 'usage clinique'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div class="contenu" style={{ paddingTop: '16px', paddingBottom: 'calc(40px + var(--barre-bas))', gap: '22px' }}>
        <Video ex={ex} />

        <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ex.points.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'baseline', fontSize: '17px', lineHeight: 1.4 }}>
              <span style={{ width: '8px', height: '8px', background: couleur, borderRadius: '1px', flex: 'none', position: 'relative', top: '-1px' }} />
              <span>{p}</span>
            </div>
          ))}
        </section>

        <section style={{ borderTop: '1.5px solid var(--encre)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span class="etiquette discret">Ce que tu dois sentir</span>
          <p style={{ fontSize: '15px', lineHeight: 1.5 }}>{ex.ressenti}</p>
        </section>

        {ex.echelle && echelon !== null && (
          <section style={{ borderTop: '1.5px solid var(--encre)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span class="etiquette discret">Ton échelon</span>
            <p style={{ fontSize: '15px', lineHeight: 1.5 }}>
              <strong>{ex.echelle[echelon]}</strong>
              {echelon < ex.echelle.length - 1 ? ` · ensuite : ${ex.echelle[echelon + 1]?.toLowerCase()}` : ' · dernier échelon'}
            </p>
          </section>
        )}

        <Repliable titre="Les erreurs fréquentes">
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: 0, padding: 0, listStyle: 'none', fontSize: '15px', lineHeight: 1.45 }}>
            {ex.erreurs.map((e, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style={{ flex: 'none', position: 'relative', top: '2px' }} aria-hidden="true">
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </svg>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </Repliable>

        <Repliable titre="Les étapes, en texte">
          <ol style={{ display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr)', rowGap: '12px', columnGap: '10px', margin: 0, padding: 0, listStyle: 'none', fontSize: '15px', lineHeight: 1.5 }}>
            {ex.etapes.map((e, i) => (
              <li key={i} style={{ display: 'contents' }}>
                <span class="discret num">{i + 1}</span>
                <span>{e}</span>
              </li>
            ))}
          </ol>
          {ex.verifierEnSalle && (
            <p class="discret" style={{ fontSize: '14px', lineHeight: 1.5, paddingTop: '12px' }}>{ex.verifierEnSalle}</p>
          )}
        </Repliable>

        <Repliable titre="Pourquoi cet exercice">
          <p style={{ fontSize: '15px', lineHeight: 1.5 }}>{ex.pourquoi}</p>
          {sources.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr)', rowGap: '8px', columnGap: '8px', paddingTop: '12px', fontSize: '13px', lineHeight: 1.45 }}>
              {sources.map((s, i) => (
                <div key={s.id} style={{ display: 'contents' }}>
                  <span class="discret num">{i + 1}</span>
                  <span>{s.texte}</span>
                </div>
              ))}
            </div>
          )}
        </Repliable>
      </div>
    </div>
  )
}

/**
 * La vidéo est là dès l'ouverture, plus rien à charger d'abord. Pas d'autoplay :
 * c'est le bouton de lecture de YouTube qui la démarre. Le prix est réel — le
 * lecteur de Google est tiré à chaque ouverture de fiche — et c'est le choix assumé
 * puisque l'appli s'utilise connectée.
 */
function Video({ ex }: { ex: Exercise }) {
  if (!ex.video) return null
  const v = ex.video

  if (!v.youtubeId) {
    return (
      <div style={{ border: '1.5px solid var(--filet)', borderRadius: 'var(--r)', padding: '14px', fontSize: '14px', lineHeight: 1.45 }}>
        <span style={{ fontWeight: 600 }}>Pas encore de vidéo.</span>{' '}
        <span class="discret">Les étapes ont été vérifiées contre une page de {v.creator}.</span>
      </div>
    )
  }

  const p = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1', iv_load_policy: '3' })
  if (v.start !== undefined) p.set('start', String(v.start))
  if (v.end !== undefined) p.set('end', String(v.end))

  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: '#14181a', borderRadius: 'var(--r)', overflow: 'hidden' }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?${p.toString()}`}
          title={`Démonstration : ${ex.nom}`}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', display: 'block' }}
        />
      </div>
      <figcaption class="discret" style={{ fontSize: '13px', lineHeight: 1.4 }}>
        {v.videoCreator ?? v.creator}
        {v.start !== undefined ? " · l'extrait démarre au passage utile" : ''}
      </figcaption>
    </figure>
  )
}

function Repliable({ titre, children }: { titre: string; children: ComponentChildren }) {
  const [ouvert, setOuvert] = useState(false)
  return (
    <section style={{ borderTop: '1.5px solid var(--encre)' }}>
      <button
        onClick={() => setOuvert(!ouvert)}
        aria-expanded={ouvert}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', width: '100%', minHeight: 'var(--cible)', padding: '12px 0', textAlign: 'left' }}
      >
        <span style={{ fontSize: '16px', fontWeight: 600 }}>{titre}</span>
        <span style={{ display: 'inline-flex', transform: ouvert ? 'rotate(90deg)' : 'none', transition: 'transform 120ms' }}>
          <Chevron taille={18} />
        </span>
      </button>
      {ouvert && <div style={{ paddingBottom: '14px' }}>{children}</div>}
    </section>
  )
}
