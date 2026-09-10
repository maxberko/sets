import { useState } from 'preact/hooks'
import { BoutonRetour, Entete } from '../composants/communs'
import { Lecture, PointPreuve } from '../composants/icones'
import { COULEUR_PROGRAMME, NOM_PROGRAMME, exercice, sourcesFor } from '../data'
import type { Exercise } from '../data/types'
import { useDonnees } from '../lib/etat'
import { Introuvable } from './ChoixLieu'

export function Fiche({ id }: { id: string }) {
  const d = useDonnees()
  const ex = exercice(id)
  if (!ex) return <Introuvable />

  const couleur = COULEUR_PROGRAMME[ex.programme]
  const sources = sourcesFor(ex.sources)
  const echelon = ex.echelle ? Math.min(d.progression.echelons[ex.id] ?? 1, ex.echelle.length - 1) : null

  return (
    <div class="ecran" style={{ paddingTop: 0 }}>
      <div style={{ background: couleur, color: 'var(--sur-couleur)', padding: `calc(var(--barre-haut) + 14px) var(--gouttiere) 24px` }}>
        <Entete statique surCouleur gauche={<BoutonRetour label={NOM_PROGRAMME[ex.programme]} />} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '10px' }}>
          <h1 style={{ fontSize: '40px', lineHeight: 0.95 }}>{ex.nom}</h1>
          <p style={{ fontSize: '15px', lineHeight: 1.4 }}>{ex.resume}</p>
          {ex.evidence && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <PointPreuve plein={ex.evidence === 'pleine'} />
              <span>
                {ex.evidence === 'pleine'
                  ? "Un essai clinique soutient ce travail"
                  : "Usage clinique, pas d'essai clinique"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div class="contenu" style={{ paddingTop: '24px', paddingBottom: 'calc(40px + var(--barre-bas))', gap: '26px' }}>
        <Bloc titre="Comment faire">
          <ol style={{ display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr)', rowGap: '12px', columnGap: '10px', margin: 0, padding: 0, listStyle: 'none', fontSize: '15px', lineHeight: 1.5 }}>
            {ex.etapes.map((e, i) => (
              <li key={i} style={{ display: 'contents' }}>
                <span class="discret num">{i + 1}</span>
                <span>{e}</span>
              </li>
            ))}
          </ol>
        </Bloc>

        <Bloc titre="Les points qui comptent">
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: 0, padding: 0, listStyle: 'none', fontSize: '15px', lineHeight: 1.45 }}>
            {ex.points.map((p, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}>
                <span style={{ width: '8px', height: '8px', background: couleur, borderRadius: '1px', flex: 'none', position: 'relative', top: '-1px' }} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Bloc>

        <Bloc titre="Ce que tu dois sentir">
          <p style={{ fontSize: '15px', lineHeight: 1.5 }}>{ex.ressenti}</p>
        </Bloc>

        <BlocVideo ex={ex} />

        <Bloc titre="Les erreurs fréquentes" separateur>
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
        </Bloc>

        {ex.echelle && (
          <Bloc titre="Ton échelle de difficulté" separateur>
            <ol style={{ display: 'flex', flexDirection: 'column', gap: '0', margin: 0, padding: 0, listStyle: 'none' }}>
              {ex.echelle.map((e, i) => {
                const actuel = i === echelon
                return (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '12px 0',
                      borderTop: i === 0 ? 'none' : '1px solid var(--filet)',
                      fontSize: '15px',
                      fontWeight: actuel ? 600 : 400,
                      color: actuel ? 'var(--encre)' : 'var(--sourdine)',
                    }}
                  >
                    <span>{e}</span>
                    {actuel && <span class="etiquette">tu es ici</span>}
                  </li>
                )
              })}
            </ol>
          </Bloc>
        )}

        <Bloc titre="Pourquoi il est dans ton programme" separateur>
          <p style={{ fontSize: '15px', lineHeight: 1.5 }}>{ex.pourquoi}</p>
          {sources.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr)', rowGap: '8px', columnGap: '8px', paddingTop: '10px', fontSize: '13px', lineHeight: 1.45 }}>
              {sources.map((s, i) => (
                <>
                  <span key={`n${s.id}`} class="discret num">{i + 1}</span>
                  <span key={s.id}>{s.texte}</span>
                </>
              ))}
            </div>
          )}
        </Bloc>

        {ex.verifierEnSalle && (
          <Bloc titre="À vérifier dans ton club" separateur>
            <p style={{ fontSize: '15px', lineHeight: 1.5 }}>{ex.verifierEnSalle}</p>
          </Bloc>
        )}
      </div>
    </div>
  )
}

function Bloc({ titre, children, separateur }: { titre: string; children: preact.ComponentChildren; separateur?: boolean }) {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        borderTop: separateur ? '1.5px solid var(--encre)' : 'none',
        paddingTop: separateur ? '20px' : 0,
      }}
    >
      <h3 style={{ fontSize: '17px' }}>{titre}</h3>
      {children}
    </section>
  )
}

/**
 * La vidéo se lit dans la page, dans une iframe : appuyer sur lecture ne quitte pas
 * l'appli. Rien n'est chargé avant l'appui, sinon chaque ouverture de fiche irait
 * chercher le lecteur de Google, ce qui pèse plus lourd que toute l'appli.
 *
 * Sans identifiant intégrable, on affiche la source et on le dit. Un cadre vide qui
 * ne joue rien serait pire que l'absence annoncée.
 */
function BlocVideo({ ex }: { ex: Exercise }) {
  const [joue, setJoue] = useState(false)
  if (!ex.video) return null
  const v = ex.video

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1.5px solid var(--encre)', paddingTop: '20px' }}>
      <h3 style={{ fontSize: '17px' }}>Le mouvement</h3>

      {v.youtubeId ? (
        <>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: '#14181a', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            {joue ? (
              <iframe
                src={lienIntegre(v.youtubeId, v.start, v.end)}
                title={`Technique : ${ex.nom}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', display: 'block' }}
              />
            ) : (
              <button
                onClick={() => setJoue(true)}
                aria-label={`Lire la démonstration de ${ex.nom}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  display: 'grid',
                  placeItems: 'center',
                  background: 'linear-gradient(160deg, #333b3e 0%, #191e20 60%, #14181a 100%)',
                }}
              >
                <span
                  style={{
                    width: '64px',
                    height: '64px',
                    border: '2px solid var(--papier)',
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    paddingLeft: '4px',
                  }}
                >
                  <Lecture taille={24} couleur="var(--papier)" />
                </span>
              </button>
            )}
          </div>
          <p class="discret" style={{ fontSize: '13px', lineHeight: 1.45 }}>
            {v.creator}
            {v.start !== undefined ? ` · l'extrait démarre au passage utile` : ''} · la lecture reste dans l'appli
          </p>
        </>
      ) : (
        <>
          <div
            style={{
              border: '1.5px solid var(--filet)',
              borderRadius: 'var(--r)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Pas encore de vidéo pour cet exercice</span>
            <span class="discret" style={{ fontSize: '14px', lineHeight: 1.45 }}>
              La référence enregistrée est une page de {v.creator}, pas une vidéo intégrable. Les étapes et les erreurs ci-dessus
              ont été vérifiées contre elle.
            </span>
          </div>
        </>
      )}
    </section>
  )
}

/** youtube-nocookie, sans vidéos suggérées, lecture en ligne et non en plein écran forcé. */
function lienIntegre(id: string, debut?: number, fin?: number): string {
  const p = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1', autoplay: '1', iv_load_policy: '3' })
  if (debut !== undefined) p.set('start', String(debut))
  if (fin !== undefined) p.set('end', String(fin))
  return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`
}
