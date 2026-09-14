import { useState } from 'preact/hooks'
import { BarreOnglets, Entete, Titre } from '../composants/communs'
import { Chevron, PointPreuve } from '../composants/icones'
import { sourcesFor } from '../data'

interface Chapitre {
  titre: string
  paragraphes: string[]
  /** Montre le point de preuve au lieu d'en parler : c'est un symbole, il se voit. */
  legendePoints?: boolean
  /** Ce que le chapitre change, concrètement, dans un écran que tu as déjà vu. */
  dansLappli: string
  sources: string[]
}

/**
 * Quatre chapitres courts, tenus par un fil : quelqu'un qui surfe déjà, et qui
 * s'entraîne à terre pour durer.
 *
 * Chaque titre dit à l'infinitif ce que le programme permet de faire, et se
 * termine par un point. « Ce qu'on ne promet pas » ou « ce que le surf use »
 * nommaient un sujet sans rien en dire ; on lisait une table des matières.
 *
 * Deux paragraphes par chapitre, phrases courtes : c'est un écran qu'on lit
 * debout, pas un article. Le sommaire remplace le paragraphe d'introduction, qui
 * annonçait le texte au lieu de le commencer.
 */
const CHAPITRES: Chapitre[] = [
  {
    titre: "T'entraîner à terre pour durer à l'eau.",
    paragraphes: [
      "L'eau te donne des heures de rame et de l'équilibre. Elle ne te charge jamais assez pour épaissir un muscle, et elle laisse des traces. Chez les surfeurs professionnels, le genou est la première articulation blessée. Les deux tiers des blessures de hanche viennent d'un conflit. L'épaule perd de la rotation externe.",
      "En face, l'entraînement en force divise les blessures par trois, sur 25 essais et 26 000 personnes. C'est ce qu'on vient chercher ici : des années de pratique en plus.",
    ],
    dansLappli:
      "Deux séances de force et trois de mobilité par semaine, parce que l'eau occupe déjà le reste. L'appli ne te demande jamais quand tu surfes.",
    sources: ['hohn2018', 'surf-genou-hanche', 'furness2018', 'lauersen2014'],
  },
  {
    titre: 'Renforcer ce que le surf use.',
    paragraphes: [
      "Près des trois quarts des blessures du membre inférieur touchent la jambe arrière, et la réception revient le plus souvent. Un genou se protège au-dessus et en dessous de lui : renforcer la hanche bat le travail du genou seul, et chaque tranche de 10 % de dorsiflexion non utilisée à la réception lui ajoute 3,2 degrés d'abduction.",
      "L'étirement, lui, n'a réduit aucune blessure dans les essais. Il sert à gagner de l'amplitude, ce qui demande cinq minutes par muscle et par semaine.",
    ],
    dansLappli:
      "La séance de mobilité est à moitié du renforcement : moyen fessier, descente latérale, Nordic, Copenhague, réception sur une jambe. L'épaule a l'open book et la rotation externe. Les maintiens s'allongent quand tu les trouves faciles.",
    sources: ['hanchard2021', 'halabchi2025', 'jospt2018', 'cheville-genou', 'langenberg2021', 'cochrane2011', 'thomas2018', 'behm2016'],
  },
  {
    titre: 'Progresser par le volume, pas par le matériel.',
    paragraphes: [
      "Dix séries par muscle et par semaine suffisent à progresser, douze à vingt chez quelqu'un d'entraîné. Au-delà, chaque série rapporte moins. La fréquence ne fait que répartir ce volume : deux séances servent à le caser.",
      "La charge compte moins que la proximité de l'échec. Léger et lourd donnent la même hypertrophie quand la série finit près de la limite. Un jour de tapis vaut un jour de salle.",
    ],
    dansLappli:
      "La jauge de l'accueil compte tes séries contre la fourchette 12–20. Sur tapis, la progression passe par une échelle de difficulté au lieu des kilos.",
    sources: ['acsm2026', 'bazvalle2022', 'schoenfeld2019freq', 'schoenfeld2017charge', 'robinson2024'],
  },
  {
    titre: "Savoir ce qui est prouvé, et ce qui ne l'est pas.",
    paragraphes: [
      "Aucun exercice ne fait fondre le ventre. Six semaines d'abdominaux quotidiens n'ont rien changé au tour de taille, et treize études réunies donnent un effet nul. L'alimentation découvre les abdominaux ; l'entraînement les épaissit.",
      "La plupart des exercices de mobilité courants n'ont jamais été testés. Chaque fiche te le dit par un point :",
    ],
    legendePoints: true,
    dansLappli:
      "Aucun exercice à point creux n'est présenté comme de la prévention. Tu sais, exercice par exercice, sur quoi tu t'appuies.",
    sources: ['vispute2011', 'ramirez2022', 'delphi2025', 'fifa11plus', 'pep', 'nordic'],
  },
]

const ancre = (i: number) => `chapitre-${i + 1}`

export function Science() {
  return (
    <div class="ecran">
      <Entete />
      <div class="contenu">
        <Titre titre="Science" apres="Ce que le programme fait pour toi, et sur quoi il s'appuie" />

        {/* Le sommaire remplace le paragraphe qui annonçait le texte : il montre
            les quatre titres et mène droit au chapitre cherché. */}
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {CHAPITRES.map((c, i) => (
            <button
              key={i}
              onClick={() => {
                // Glissé, sauf chez qui a demandé moins de mouvement : un saut
                // sec fait perdre le fil autant qu'un changement d'écran.
                const calme = matchMedia('(prefers-reduced-motion: reduce)').matches
                document.getElementById(ancre(i))?.scrollIntoView({ behavior: calme ? 'auto' : 'smooth', block: 'start' })
              }}
              class="rangee"
              style={{ borderBottom: '1px solid var(--filet)', gap: '12px' }}
            >
              <span style={{ display: 'flex', gap: '10px', alignItems: 'baseline', minWidth: 0, textAlign: 'left' }}>
                <span class="discret num" style={{ fontSize: '13px' }}>{i + 1}</span>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>{c.titre}</span>
              </span>
              <Chevron taille={14} />
            </button>
          ))}
        </nav>

        {CHAPITRES.map((c, i) => (
          <Section key={i} chapitre={c} numero={i + 1} id={ancre(i)} />
        ))}

        <div style={{ height: '12px' }} />
      </div>
      <BarreOnglets />
    </div>
  )
}

function Section({ chapitre, numero, id }: { chapitre: Chapitre; numero: number; id: string }) {
  const [ouvert, setOuvert] = useState(false)
  const sources = sourcesFor(chapitre.sources)

  return (
    <section
      id={id}
      style={{ borderTop: '1.5px solid var(--encre)', paddingTop: '16px', scrollMarginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}
    >
      <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}>
        <span class="discret num" style={{ fontSize: '13px' }}>{numero}</span>
        <h3 style={{ fontSize: '20px', fontFamily: 'var(--titre)', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
          {chapitre.titre}
        </h3>
      </div>

      {chapitre.paragraphes.map((p, i) => (
        <p key={i} style={{ fontSize: '15px', lineHeight: 1.55 }}>{p}</p>
      ))}

      {/* Le point se montre : décrit en mots, « plein » et « creux » ne voulaient
          rien dire tant qu'on ne les avait pas vus sur une fiche. */}
      {chapitre.legendePoints && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', lineHeight: 1.45 }}>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <PointPreuve plein />
            <span>Un essai clinique soutient cet exercice.</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <PointPreuve plein={false} />
            <span>Personne ne l'a testé. Il repose sur l'anatomie et l'usage en cabinet.</span>
          </span>
        </div>
      )}

      {/* Le chapitre se termine sur la décision qu'il a produite : c'est là que
          l'explication devient vérifiable, puisqu'on peut aller voir l'écran. */}
      <p style={{ fontSize: '15px', lineHeight: 1.55, paddingLeft: '12px', borderLeft: '2px solid var(--encre)' }}>
        <strong>Dans l'appli</strong> · {chapitre.dansLappli}
      </p>

      <button
        onClick={() => setOuvert(!ouvert)}
        aria-expanded={ouvert}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, minHeight: 'var(--cible)' }}
      >
        <span>{ouvert ? 'Masquer les sources' : `${sources.length} sources`}</span>
        <span style={{ display: 'inline-flex', transform: ouvert ? 'rotate(90deg)' : 'none' }}>
          <Chevron taille={14} />
        </span>
      </button>

      {ouvert && (
        <div style={{ display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr)', rowGap: '10px', columnGap: '8px', fontSize: '13px', lineHeight: 1.45, paddingBottom: '6px' }}>
          {sources.map((s, i) => (
            <>
              <span key={`n${s.id}`} class="discret num">{i + 1}</span>
              <span key={s.id}>{s.texte}</span>
            </>
          ))}
        </div>
      )}
    </section>
  )
}

export { PointPreuve }
