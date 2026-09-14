import type { Exercise } from '../data/types'

/**
 * Dessins de position repris de workout-guide (CC BY-SA 4.0).
 * Les fichiers restent dans `public/illustrations/`, rangés sous leur nom
 * d'origine ; la couleur est posée à l'affichage par masque CSS — voir
 * `public/illustrations/ATTRIBUTION.txt`.
 *
 * Trois choix valent explication, tirés d'une relecture image par image :
 *
 * 1. On n'utilise jamais l'image 2. Dans presque toute la bibliothèque elle est
 *    tracée plus épais que les images 1 et 3 — et sur le Pallof elle est
 *    carrément abîmée. Les images 1 et 3 vont ensemble.
 * 2. Deux dessins partout où les deux bouts du mouvement se distinguent. Seul le
 *    gainage latéral n'en garde qu'un : ses deux images montrent la même chose,
 *    une paire y ferait croire à un mouvement qui n'existe pas.
 * 3. `coteDessine` dit de quel côté de l'image se trouve le membre qui travaille.
 *    Quand le lecteur annonce un côté, le dessin est retourné pour que ce membre
 *    tombe du côté annoncé — comme dans un miroir de salle. Absent là où « côté »
 *    ne désigne pas un membre : sur le bird dog, c'est une diagonale bras-jambe.
 *
 * Les six exercices absents de cette table n'ont pas de dessin juste dans la
 * bibliothèque : roulade sur les avant-bras, cheville au mur, hanche 90/90,
 * rotation thoracique, réception sur une jambe, rotation externe. Les dessins
 * voisins montrent un autre mouvement, mieux vaut rien qu'à peu près.
 */
type Image = { n: number; legende: string }
type Cote = 'gauche' | 'droit'
type Dessin = { dossier: string; images: Image[]; coteDessine?: Cote }

const DESSINS: Record<string, Dessin> = {
  // Pecs
  'developpe-incline-halteres': {
    dossier: 'incline-dumbbell-press',
    images: [{ n: 3, legende: 'En bas' }, { n: 1, legende: 'En haut' }],
  },
  'developpe-couche-halteres': {
    dossier: 'dumbbell-bench-press',
    images: [{ n: 3, legende: 'En bas' }, { n: 1, legende: 'En haut' }],
  },
  'ecarte-poulie': {
    dossier: 'cable-fly',
    images: [{ n: 3, legende: 'Ouvert' }, { n: 1, legende: 'Fermé' }],
  },
  'dips-assistes': {
    dossier: 'assisted-dip',
    images: [{ n: 1, legende: 'En bas' }, { n: 3, legende: 'En haut' }],
  },
  'pompes-pieds-sureleves': {
    dossier: 'decline-push-up',
    images: [{ n: 3, legende: 'En bas' }, { n: 1, legende: 'En haut' }],
  },
  'pompes-lestees': {
    dossier: 'weighted-push-up',
    images: [{ n: 3, legende: 'En bas' }, { n: 1, legende: 'En haut' }],
  },
  'pompes-lentes': {
    dossier: 'push-up',
    images: [{ n: 3, legende: 'En bas' }, { n: 1, legende: 'En haut' }],
  },
  'dips-chaises': {
    dossier: 'chair-dip',
    images: [{ n: 3, legende: 'En bas' }, { n: 1, legende: 'En haut' }],
  },

  // Abdos
  'releve-jambes-suspendu': {
    dossier: 'hanging-leg-raise',
    images: [{ n: 3, legende: 'Suspendu' }, { n: 1, legende: 'Jambes levées' }],
  },
  'crunch-poulie': {
    dossier: 'cable-crunch',
    images: [{ n: 1, legende: 'À genoux' }, { n: 3, legende: 'Enroulé' }],
  },
  'roulette-abdominale': {
    dossier: 'ab-wheel',
    images: [{ n: 3, legende: 'Départ' }, { n: 1, legende: 'Étendu' }],
  },
  'pallof-poulie': {
    dossier: 'pallof-press',
    images: [{ n: 1, legende: 'Au buste' }, { n: 3, legende: 'Bras tendus' }],
  },
  'gainage-lateral-leste': { dossier: 'side-plank', images: [{ n: 1, legende: 'La position' }] },
  'crunch-inverse': {
    dossier: 'reverse-crunch',
    images: [{ n: 3, legende: 'Jambes basses' }, { n: 1, legende: 'Hanches décollées' }],
  },
  'gainage-touches-epaule': {
    dossier: 'plank-shoulder-tap',
    images: [{ n: 1, legende: 'Gainage' }, { n: 3, legende: 'Touche' }],
  },
  'gainage-lateral': { dossier: 'side-plank', images: [{ n: 1, legende: 'La position' }] },

  // Mobilité
  'psoas-demi-genou': {
    dossier: 'kneeling-hip-flexor-stretch',
    coteDessine: 'gauche', // genou au sol à gauche de l'image
    images: [{ n: 1, legende: 'En fente' }, { n: 3, legende: 'Bassin en avant' }],
  },
  'abduction-hanche': {
    dossier: 'side-lying-hip-abduction',
    coteDessine: 'droit', // jambe du dessus vers la droite de l'image
    images: [{ n: 3, legende: 'Jambe basse' }, { n: 1, legende: 'Jambe levée' }],
  },
  'descente-laterale': {
    dossier: 'step-down',
    coteDessine: 'droit', // jambe d'appui sur la marche, à droite de l'image
    images: [{ n: 3, legende: 'Sur la marche' }, { n: 1, legende: 'En descente' }],
  },
  'nordic-ischios': {
    dossier: 'nordic-hamstring-curl',
    images: [{ n: 3, legende: 'À genoux' }, { n: 1, legende: 'Descente' }],
  },
  copenhague: {
    dossier: 'copenhagen-plank',
    coteDessine: 'gauche', // jambe du dessus, celle qui travaille, vers la gauche
    images: [{ n: 1, legende: 'Jambe pliée' }, { n: 3, legende: 'Jambe tendue' }],
  },
  'bird-dog-gainage': {
    dossier: 'bird-dog',
    images: [{ n: 1, legende: 'Un côté' }, { n: 3, legende: "L'autre côté" }],
  },
}

export function aDesDessins(id: string) {
  return id in DESSINS
}

/**
 * Le masque, toujours carré et posé de la même façon. Les fichiers ont été
 * recadrés sur un carré centré autour du dessin, donc `contain` leur donne à
 * tous la même échelle apparente : un corps allongé et un corps debout occupent
 * la même largeur d'écran.
 */
function masque(url: string, teinte: string, retourne = false) {
  return {
    aspectRatio: '1',
    background: teinte,
    transform: retourne ? 'scaleX(-1)' : undefined,
    maskImage: `url(${url})`,
    WebkitMaskImage: `url(${url})`,
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
  }
}

export function Positions({ ex, couleur, cote }: { ex: Exercise; couleur?: string; cote?: Cote | null }) {
  const d = DESSINS[ex.id]
  if (!d) return null
  const base = import.meta.env.BASE_URL
  const seul = d.images.length === 1
  const retourne = !!cote && !!d.coteDessine && cote !== d.coteDessine

  return (
    // Un dessin seul est centré, à la largeur qu'il aurait dans une paire : d'une
    // fiche à l'autre, les dessins gardent la même taille.
    <div style={{ display: 'flex', gap: '12px', justifyContent: seul ? 'center' : 'stretch' }}>
      {d.images.map(({ n, legende }, i) => {
        // La couleur du programme marque la fin du mouvement ; un dessin seul
        // reste à l'encre, il n'a pas d'arrivée à signaler.
        const teinte = !seul && i === d.images.length - 1 ? (couleur ?? 'var(--encre)') : 'var(--encre)'
        return (
          <figure
            key={n}
            style={{ margin: 0, flex: seul ? '0 0 calc(50% - 6px)' : 1, display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <div
              role="img"
              aria-label={`${ex.nom}, ${legende.toLowerCase()}`}
              style={masque(`${base}illustrations/${d.dossier}/frame-${n}.svg`, teinte, retourne)}
            />
            <figcaption class="discret" style={{ fontSize: '13px', textAlign: seul ? 'center' : 'left' }}>
              {legende}
            </figcaption>
          </figure>
        )
      })}
    </div>
  )
}

/**
 * La même paire, réduite en bandeau pour le lecteur de force : pas de légendes
 * (illisibles à cette hauteur), et la teinte suit le texte de l'écran, donc
 * l'encre sur le fond coloré. Le bandeau remplace la vignette YouTube, qui
 * posait un rectangle noir en travers de la couleur — et allait chercher son
 * image chez i.ytimg.com avant le moindre appui.
 */
export function BandeauPositions({ ex, cote }: { ex: Exercise; cote?: Cote | null }) {
  const d = DESSINS[ex.id]
  if (!d) return null
  const base = import.meta.env.BASE_URL
  const retourne = !!cote && !!d.coteDessine && cote !== d.coteDessine

  return (
    // Chaque case fait la moitié de la largeur et toute la hauteur ; le dessin
    // se pose dedans en `contain`, donc il tient toujours, que la place manque en
    // hauteur (lecteur de force) ou en largeur (lecteur de mobilité). Une case
    // carrée débordait des gouttières dès que la zone était haute.
    <div style={{ display: 'flex', gap: '10px', height: '100%', width: '100%', alignItems: 'stretch', justifyContent: 'center' }}>
      {d.images.map(({ n, legende }) => (
        <div
          key={n}
          role="img"
          aria-label={`${ex.nom}, ${legende.toLowerCase()}`}
          style={{
            ...masque(`${base}illustrations/${d.dossier}/frame-${n}.svg`, 'currentColor', retourne),
            aspectRatio: undefined,
            flex: '0 1 calc(50% - 5px)',
            height: '100%',
          }}
        />
      ))}
    </div>
  )
}
