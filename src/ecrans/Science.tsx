import { useState } from 'preact/hooks'
import { BarreOnglets, Entete, Titre } from '../composants/communs'
import { Chevron, PointPreuve } from '../composants/icones'
import { COULEUR_PROGRAMME, sourcesFor } from '../data'

interface Principe {
  programme: 'pecs' | 'abdos' | 'mobilite'
  titre: string
  texte: string
  sources: string[]
}

const PRINCIPES: Principe[] = [
  {
    programme: 'abdos',
    titre: 'On ne perd pas de gras là où on travaille',
    texte:
      "Six semaines d'abdominaux quotidiens n'ont rien changé au tour de taille ni au pli cutané dans un essai contrôlé, douze semaines de travail sur une seule jambe ont fait perdre du gras au tronc et aux bras mais pas à la jambe entraînée, et une méta-analyse de treize études donne un effet nul. L'appli ne prétendra jamais qu'un exercice brûle le gras du ventre : c'est le déficit calorique qui le fait.",
    sources: ['vispute2011', 'ramirez2013', 'ramirez2022'],
  },
  {
    programme: 'abdos',
    titre: "L'abdominal est un muscle comme un autre",
    texte:
      "Il n'existe pas de recherche sur le volume propre aux abdominaux, donc on applique ce qui vaut ailleurs : plus de séries hebdomadaires, plus de croissance jusqu'à un plateau, et deux séances par semaine valent mieux qu'une quand elles ajoutent du volume. Les squats et les soulevés de terre laissent l'activation abdominale bien en dessous du maximum, donc le travail direct et chargé reste nécessaire.",
    sources: ['schoenfeld2017vol', 'schoenfeld2016freq', 'sbs-core'],
  },
  {
    programme: 'abdos',
    titre: 'Haut et bas des abdominaux : on oriente, on n\'isole pas',
    texte:
      "Le recrutement se fait près de la charge : un crunch sollicite davantage les segments hauts, un relevé de jambes les segments bas. C'est une orientation, pas une isolation, et c'est pour ça que chaque séance associe un mouvement qui amène les côtes vers le bassin et un mouvement qui amène le bassin vers les côtes.",
    sources: ['gomirato2023', 'ace2001abdos', 'escamilla2006'],
  },
  {
    programme: 'pecs',
    titre: 'Le volume fait le travail, la fréquence le répartit',
    texte:
      "La prise de position ACSM de 2026, bâtie sur 137 revues systématiques, situe la cible autour de dix séries par muscle et par semaine, avec au moins deux séances. Chez l'homme entraîné, la fourchette utile monte à 12–20 séries. Une fois le volume égalisé, la fréquence n'apporte plus rien par elle-même : deux séances sont un moyen de caser le volume, pas une recette magique.",
    sources: ['acsm2026', 'bazvalle2022', 'schoenfeld2019freq'],
  },
  {
    programme: 'pecs',
    titre: 'Trente degrés, pas quarante-cinq',
    texte:
      "L'activation du haut du pectoral culmine à 30 degrés d'inclinaison et se déplace vers le deltoïde antérieur au-delà. La seule étude qui a comparé la croissance selon l'angle a trouvé que l'entraînement incliné épaissit davantage le haut du pectoral que le banc plat. C'est le haut du pectoral qui donne sa ligne supérieure au muscle.",
    sources: ['rodriguez2020', 'chaves2020'],
  },
  {
    programme: 'pecs',
    titre: 'La charge compte moins que la proximité de l\'échec',
    texte:
      "Charges légères et lourdes produisent une hypertrophie comparable quand les séries finissent près de l'échec, et la croissance augmente à mesure que la série s'en approche. C'est ce qui rend les jours de tapis aussi valables que les jours de salle : ce n'est pas le matériel qui compte, c'est l'effort réel de la dernière répétition.",
    sources: ['schoenfeld2017charge', 'robinson2024', 'acsm2026'],
  },
  {
    programme: 'mobilite',
    titre: 'Le genou est la surprise du surf',
    texte:
      "Chez les professionnels suivis par un même centre orthopédique, le genou est la première articulation blessée, devant la cheville et l'épaule, avec une moitié d'entorses du ligament collatéral médial et un tiers de lésions méniscales. Près des trois quarts des blessures du membre inférieur touchent la jambe arrière, et la réception est le mécanisme le plus souvent cité.",
    sources: ['hohn2018', 'surf-genou-hanche', 'hanchard2021'],
  },
  {
    programme: 'mobilite',
    titre: 'Ce qui protège un genou, c\'est la force de hanche',
    texte:
      "Les méta-analyses sur la douleur fémoro-patellaire montrent qu'ajouter du renforcement des abducteurs et rotateurs externes de hanche au travail du genou bat le travail du genou seul. La cheville compte aussi : pour chaque tranche de 10 % de dorsiflexion non utilisée à la réception, l'abduction du genou augmente de 3,2 degrés.",
    sources: ['halabchi2025', 'jospt2018', 'cheville-genou'],
  },
  {
    programme: 'mobilite',
    titre: "L'étirement ne prévient pas les blessures. La force, si.",
    texte:
      "Sur 25 essais et 26 000 personnes, l'étirement n'a réduit les blessures en rien, tandis que l'entraînement en force les a divisées par trois. Les étirements après l'effort ne réduisent pas non plus les courbatures. C'est pourquoi la séance de mobilité est à moitié du renforcement, et pourquoi chaque exercice porte un point : plein quand un essai le soutient, creux quand il ne repose que sur l'usage clinique.",
    sources: ['lauersen2014', 'cochrane2011', 'delphi2025'],
  },
  {
    programme: 'mobilite',
    titre: "L'amplitude, elle, demande du volume hebdomadaire",
    texte:
      "Ce qui prédit les gains d'amplitude durables, c'est le temps total par muscle et par semaine, au moins cinq minutes, réparti sur plusieurs séances, en maintiens de 30 à 60 secondes. Trois séances par semaine suffisent à atteindre ce total sans jamais empiéter sur le temps passé à l'eau.",
    sources: ['thomas2018', 'delphi2025', 'behm2016'],
  },
]

export function Science() {
  return (
    <div class="ecran">
      <Entete />
      <div class="contenu">
        <Titre titre="Science" apres={`${PRINCIPES.length} principes`} />
        <p class="discret" style={{ fontSize: '15px', lineHeight: 1.5 }}>
          Ce sur quoi le programme est bâti, et ce qu'il refuse de promettre. Chaque principe est déplié avec ses sources.
        </p>
        {PRINCIPES.map((p, i) => (
          <Depliant key={i} principe={p} />
        ))}
        <p class="discret" style={{ fontSize: '13px', lineHeight: 1.5, paddingTop: '8px', borderTop: '1px solid var(--filet)' }}>
          Le point plein signifie qu'au moins un essai clinique soutient le fait de faire l'exercice. Le point creux signifie que
          l'exercice repose sur l'anatomie et l'usage clinique, sans essai. Aucun exercice à point creux n'est présenté comme de la
          prévention.
        </p>
        <div style={{ height: '12px' }} />
      </div>
      <BarreOnglets />
    </div>
  )
}

function Depliant({ principe }: { principe: Principe }) {
  const [ouvert, setOuvert] = useState(false)
  const sources = sourcesFor(principe.sources)
  return (
    <section style={{ borderTop: '1.5px solid var(--encre)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span class="pastille" style={{ background: COULEUR_PROGRAMME[principe.programme] }} />
        <h3 style={{ fontSize: '18px', fontFamily: 'var(--titre)', fontWeight: 700, letterSpacing: '-0.01em' }}>{principe.titre}</h3>
      </div>
      <p style={{ fontSize: '15px', lineHeight: 1.5 }}>{principe.texte}</p>
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
