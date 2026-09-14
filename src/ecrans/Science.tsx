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
 * Six chapitres, dans l'ordre où le programme se conçoit : ce qu'on ne promet
 * pas, comment la semaine est bâtie, pourquoi ces exercices-là, ce qui compte
 * vraiment dans une série, pourquoi la mobilité vise les genoux, et ce qu'on ne
 * sait pas. Chacun se termine sur ce qu'il change, puis ses sources.
 */
const CHAPITRES: Chapitre[] = [
  {
    titre: 'Aucun exercice ne fait fondre le ventre',
    paragraphes: [
      "C'est la promesse la plus répandue de la salle de sport, et c'est la mieux réfutée. Six semaines d'abdominaux quotidiens n'ont rien changé au tour de taille ni au pli cutané dans un essai contrôlé. Douze semaines de travail sur une seule jambe ont fait perdre du gras au tronc et aux bras, mais pas à la jambe entraînée. Une méta-analyse de treize études conclut à un effet nul.",
      "Travailler un muscle le fait grossir et l'endurcit ; ça ne vide pas la graisse posée dessus. Ce qui découvre les abdominaux, c'est le déficit calorique — une affaire d'alimentation, pas de répétitions.",
      "Ce n'est pas une raison pour s'en passer : un abdominal entraîné est plus épais, donc plus visible à niveau de gras égal, et c'est lui qui tient le tronc pendant le reste.",
    ],
    dansLappli:
      "Tu ne trouveras ici ni programme minceur, ni exercice vendu comme brûleur. L'appli compte des séries, pas des calories, et ne te demande ni ton poids ni ton tour de taille.",
    sources: ['vispute2011', 'ramirez2013', 'ramirez2022'],
  },
  {
    titre: 'Le volume fait le travail, la fréquence le répartit',
    paragraphes: [
      "La prise de position de l'ACSM parue en 2026, bâtie sur 137 revues systématiques, situe la cible autour de dix séries par muscle et par semaine, avec au moins deux séances. Chez un homme déjà entraîné, la fourchette utile monte à douze à vingt séries.",
      "Une fois ce volume atteint, la fréquence n'apporte plus rien par elle-même : deux séances ne valent pas mieux qu'une par magie, elles servent à caser le volume sans faire des séances interminables. C'est la quantité de travail qui décide, la répartition n'est qu'un moyen.",
      "Au-delà de vingt séries, chaque série supplémentaire rapporte un peu moins, sans jamais nuire. Tu le paies surtout en temps et en récupération.",
    ],
    dansLappli:
      "Deux séances de force par semaine, et la jauge de l'accueil compte tes séries efficaces contre la fourchette 12–20. La formule Soutenue passe volontairement au-dessus, et l'écran Programme le dit.",
    sources: ['acsm2026', 'bazvalle2022', 'schoenfeld2019freq', 'schoenfeld2017vol'],
  },
  {
    titre: "L'abdominal est un muscle comme un autre — on l'oriente, on ne l'isole pas",
    paragraphes: [
      "Il n'existe pas de recherche sur le volume propre aux abdominaux, donc on leur applique ce qui vaut pour les autres muscles : plus de séries hebdomadaires, plus de croissance jusqu'à un plateau. Les squats et les soulevés de terre laissent l'activation abdominale bien en dessous du maximum : le travail direct et chargé reste nécessaire.",
      "Le recrutement se fait près de la charge. Un crunch sollicite davantage les segments hauts, un relevé de jambes les segments bas. C'est une orientation, pas une isolation : personne ne contracte la moitié d'un muscle à volonté.",
      "Côté pectoraux, le même raisonnement mène aux trente degrés. L'activation du haut du pectoral culmine à cette inclinaison et glisse vers le deltoïde antérieur au-delà ; la seule étude qui a comparé la croissance selon l'angle a trouvé que l'incliné épaissit davantage le haut du pectoral que le banc plat.",
    ],
    dansLappli:
      "Chaque séance de force porte autant de séries d'abdominaux que de pectoraux, et associe un mouvement qui amène les côtes vers le bassin à un mouvement qui amène le bassin vers les côtes. Le banc se règle à 30°, et la fiche te le redit à l'étape 1.",
    sources: ['schoenfeld2016freq', 'sbs-core', 'gomirato2023', 'ace2001abdos', 'escamilla2006', 'rodriguez2020', 'chaves2020'],
  },
  {
    titre: 'Ce qui compte, c\'est la dernière répétition',
    paragraphes: [
      "Charges légères et charges lourdes produisent une hypertrophie comparable quand les séries finissent près de l'échec, et la croissance augmente à mesure qu'on s'en approche. Le poids sur la barre n'est pas le signal : l'effort réel des dernières répétitions l'est.",
      "C'est ce qui rend un jour de tapis aussi valable qu'un jour de salle. Sans haltères, on charge autrement — en ralentissant la descente, en creusant l'amplitude, en rapprochant les appuis — et la série finit au même endroit.",
    ],
    dansLappli:
      "Chaque créneau annonce combien de répétitions tu dois garder en réserve. Les jours de tapis, la progression passe par une échelle de difficulté au lieu des kilos, et les deux comptent pareil dans ta semaine.",
    sources: ['schoenfeld2017charge', 'robinson2024', 'acsm2026'],
  },
  {
    titre: 'En surf, le genou se blesse avant le reste — et c\'est la force qui le protège',
    paragraphes: [
      "Chez les professionnels suivis par un même centre orthopédique, le genou est la première articulation blessée, devant la cheville et l'épaule : une moitié d'entorses du ligament collatéral médial, un tiers de lésions méniscales. Près des trois quarts des blessures du membre inférieur touchent la jambe arrière, et la réception est le mécanisme le plus souvent cité.",
      "Sur 25 essais et 26 000 personnes, l'étirement n'a réduit les blessures en rien. L'entraînement en force les a divisées par trois. Les étirements après l'effort ne réduisent pas non plus les courbatures — ils ne sont pas inutiles, ils ne servent simplement pas à ça.",
      "Ce qui protège un genou se travaille au-dessus et en dessous de lui : ajouter du renforcement des abducteurs et rotateurs externes de hanche bat le travail du genou seul, et à la cheville, chaque tranche de 10 % de dorsiflexion non utilisée à la réception ajoute 3,2 degrés d'abduction au genou.",
      "L'amplitude, elle, se gagne autrement : ce qui la prédit, c'est le temps cumulé par muscle et par semaine — au moins cinq minutes, réparties sur plusieurs séances, en maintiens de trente à soixante secondes.",
    ],
    dansLappli:
      "La séance de mobilité est à moitié du renforcement — moyen fessier, descente latérale, Nordic, Copenhague, réception sur une jambe. Trois séances de quatorze minutes suffisent au total hebdomadaire, et les maintiens montent d'un palier quand tu les trouves faciles.",
    sources: ['hohn2018', 'surf-genou-hanche', 'hanchard2021', 'lauersen2014', 'cochrane2011', 'halabchi2025', 'jospt2018', 'cheville-genou', 'thomas2018', 'behm2016'],
  },
  {
    titre: 'Ce qu\'on ne sait pas, l\'appli le dit',
    paragraphes: [
      "Les exercices de mobilité les plus répandus n'ont, pour la plupart, jamais été testés dans un essai clinique. Ils reposent sur l'anatomie et sur l'usage en cabinet, ce qui n'est pas rien, mais ce n'est pas une preuve. Le renforcement, lui, a des essais derrière lui.",
      "Plutôt que de gommer la différence, chaque fiche la porte : un point plein quand au moins un essai clinique soutient le fait de faire cet exercice, un point creux quand il ne repose que sur la convention clinique. Aucun exercice à point creux n'est présenté comme de la prévention.",
    ],
    dansLappli:
      "Le point est sur chaque fiche de mobilité, et le même code se retrouve dans le lecteur. Tu peux donc savoir, exercice par exercice, sur quoi tu t'appuies.",
    sources: ['delphi2025', 'fifa11plus', 'pep', 'nordic', 'mcgill'],
  },
]

export function Science() {
  return (
    <div class="ecran">
      <Entete />
      <div class="contenu">
        <Titre titre="Science" apres={`${CHAPITRES.length} chapitres`} />
        <p style={{ fontSize: '15px', lineHeight: 1.5 }}>
          Pourquoi le programme est fait comme ça, dans l'ordre où il se conçoit. Chaque chapitre finit par ce qu'il change dans
          l'appli, puis par ses sources — tu peux vérifier chaque affirmation.
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
