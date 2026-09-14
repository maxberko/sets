import { useState } from 'preact/hooks'
import { BarreOnglets, Entete, Titre } from '../composants/communs'
import { Chevron, PointPreuve } from '../composants/icones'
import { sourcesFor } from '../data'

interface Chapitre {
  titre: string
  paragraphes: string[]
  /** Ce que le chapitre change, concrètement, dans un écran que tu as déjà vu. */
  dansLappli: string
  sources: string[]
}

/**
 * L'écran alignait neuf faits isolés, chacun avec ses sources, dans un ordre qui
 * mêlait abdominaux, pectoraux et mobilité : tout était vrai, rien ne se tenait,
 * et aucun ne disait ce qu'il changeait dans l'appli.
 *
 * Cinq chapitres courts, tenus par un fil : quelqu'un qui surfe déjà, et qui
 * s'entraîne à terre pour durer. D'où il vient, ce que le surf use, comment un
 * muscle pousse, pourquoi ces exercices-là, et ce qu'on ne promet pas. Chacun se
 * termine sur ce qu'il change dans l'appli, puis sur ses sources.
 *
 * Deux paragraphes par chapitre au maximum : c'est un écran qu'on lit debout,
 * pas un article.
 */
const CHAPITRES: Chapitre[] = [
  {
    titre: 'Tu surfes déjà — ce programme sert à tenir dans la durée',
    paragraphes: [
      "L'eau te donne le cardio, l'équilibre et les heures de rame. Elle ne te charge pas assez pour épaissir un muscle, et elle laisse une dette : chez les surfeurs professionnels, le genou est la première articulation blessée, les deux tiers des blessures de hanche viennent d'un conflit, et l'épaule montre un déficit de rotation externe.",
      "Ce qu'on met en face n'est pas un programme de plage : sur 25 essais et 26 000 personnes, l'entraînement en force divise les blessures par trois. Un corps plus solide, c'est d'abord plus d'années de pratique.",
    ],
    dansLappli:
      "Deux séances de force par semaine, parce que l'eau occupe déjà ta semaine, et trois séances de mobilité de quatorze minutes. L'appli ne te demande jamais quand tu surfes : elle s'ajoute à ta pratique, elle ne la réorganise pas.",
    sources: ['hohn2018', 'surf-genou-hanche', 'furness2018', 'lauersen2014'],
  },
  {
    titre: 'Le genou, la hanche, l\'épaule : ce que le surf use',
    paragraphes: [
      "Près des trois quarts des blessures du membre inférieur touchent la jambe arrière, et la réception est le mécanisme le plus cité. Ce qui protège un genou se travaille au-dessus et en dessous de lui : renforcer les abducteurs et rotateurs de hanche bat le travail du genou seul, et à la cheville, chaque tranche de 10 % de dorsiflexion non utilisée ajoute 3,2 degrés d'abduction au genou.",
      "L'étirement, lui, n'a réduit aucune blessure dans les essais. Il garde son rôle — l'amplitude se gagne par le temps cumulé, au moins cinq minutes par muscle et par semaine — mais ce n'est pas lui qui te protège.",
    ],
    dansLappli:
      "La séance de mobilité est à moitié du renforcement : moyen fessier, descente latérale, Nordic, Copenhague, réception sur une jambe. L'épaule a ses deux exercices, l'open book et la rotation externe. Les maintiens montent d'un palier quand tu les trouves faciles.",
    sources: ['hanchard2021', 'halabchi2025', 'jospt2018', 'cheville-genou', 'langenberg2021', 'cochrane2011', 'thomas2018', 'behm2016'],
  },
  {
    titre: 'Un muscle pousse au volume, pas au matériel',
    paragraphes: [
      "La prise de position de l'ACSM parue en 2026, bâtie sur 137 revues systématiques, situe la cible autour de dix séries par muscle et par semaine, douze à vingt chez un homme entraîné. Une fois ce volume atteint, la fréquence n'ajoute rien par elle-même : deux séances servent à le caser, pas à faire mieux.",
      "Et ce n'est pas la charge qui décide, c'est la proximité de l'échec : charges légères et lourdes donnent la même hypertrophie quand la série finit près de la limite. Un jour de tapis vaut donc un jour de salle.",
    ],
    dansLappli:
      "La jauge de l'accueil compte tes séries efficaces contre la fourchette 12–20. Chaque créneau annonce les répétitions à garder en réserve, et sur tapis la progression passe par une échelle de difficulté au lieu des kilos.",
    sources: ['acsm2026', 'bazvalle2022', 'schoenfeld2019freq', 'schoenfeld2017charge', 'robinson2024'],
  },
  {
    titre: 'Pourquoi ces exercices-là',
    paragraphes: [
      "L'activation du haut du pectoral culmine à trente degrés d'inclinaison et glisse vers l'épaule au-delà ; la seule étude comparant la croissance selon l'angle donne l'avantage à l'incliné. Côté tronc, le recrutement se fait près de la charge : un crunch sollicite les segments hauts, un relevé de jambes les segments bas. C'est une orientation, pas une isolation.",
      "Les squats et les soulevés de terre laissent l'activation abdominale loin du maximum : un tronc solide demande du travail direct et chargé, pas seulement des exercices globaux.",
    ],
    dansLappli:
      "Le banc se règle à 30°, et la fiche te le redit à l'étape 1. Chaque séance associe un mouvement qui amène les côtes vers le bassin à un mouvement qui amène le bassin vers les côtes.",
    sources: ['rodriguez2020', 'chaves2020', 'gomirato2023', 'ace2001abdos', 'escamilla2006', 'sbs-core'],
  },
  {
    titre: 'Ce qu\'on ne promet pas',
    paragraphes: [
      "Aucun exercice ne fait fondre le ventre. Six semaines d'abdominaux quotidiens n'ont rien changé au tour de taille dans un essai contrôlé, et une méta-analyse de treize études conclut à un effet nul. Ce qui découvre les abdominaux, c'est l'alimentation ; l'entraînement, lui, épaissit le muscle dessous.",
      "Et les exercices de mobilité les plus répandus n'ont, pour la plupart, jamais été testés dans un essai. Plutôt que de gommer la différence, chaque fiche porte un point : plein quand un essai soutient l'exercice, creux quand il ne repose que sur la convention clinique.",
    ],
    dansLappli:
      "Aucun exercice à point creux n'est présenté comme de la prévention, et l'appli ne suit ni ton poids ni ton tour de taille.",
    sources: ['vispute2011', 'ramirez2022', 'delphi2025', 'fifa11plus', 'pep', 'nordic'],
  },
]

export function Science() {
  return (
    <div class="ecran">
      <Entete />
      <div class="contenu">
        <Titre titre="Science" apres={`${CHAPITRES.length} chapitres`} />
        <p style={{ fontSize: '15px', lineHeight: 1.5 }}>
          S'entraîner à terre pour durer à l'eau. Chaque chapitre finit par ce qu'il change dans l'appli, puis par ses sources.
        </p>

        {CHAPITRES.map((c, i) => (
          <Section key={i} chapitre={c} numero={i + 1} />
        ))}

        <div style={{ height: '12px' }} />
      </div>
      <BarreOnglets />
    </div>
  )
}

function Section({ chapitre, numero }: { chapitre: Chapitre; numero: number }) {
  const [ouvert, setOuvert] = useState(false)
  const sources = sourcesFor(chapitre.sources)

  return (
    <section style={{ borderTop: '1.5px solid var(--encre)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}>
        <span class="discret num" style={{ fontSize: '13px' }}>{numero}</span>
        <h3 style={{ fontSize: '20px', fontFamily: 'var(--titre)', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
          {chapitre.titre}
        </h3>
      </div>

      {chapitre.paragraphes.map((p, i) => (
        <p key={i} style={{ fontSize: '15px', lineHeight: 1.55 }}>{p}</p>
      ))}

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
