import type { Exercise } from '../data/types'

/**
 * Dessins de position repris de workout-guide (CC BY-SA 4.0).
 * Les fichiers restent dans `public/illustrations/`, rangés sous leur nom
 * d'origine ; la couleur est posée à l'affichage par masque CSS — voir
 * `public/illustrations/ATTRIBUTION.txt`.
 *
 * Trois choix valent explication, tirés d'une relecture image par image :
 *
 * 1. On n'utilise jamais l'image 2 : dans presque toute la bibliothèque elle est
 *    tracée plus épais que les images 1 et 3, et sur le Pallof elle est carrément
 *    abîmée. Mais les images 1 et 3 ne vont pas toujours ensemble non plus. En
 *    mesurant la largeur de trait (2 × aire d'encre / longueur de contour, rendu
 *    à 512 px), quatre paires s'écartent de plus de 20 % : pompes archer 1,89×,
 *    Pallof 1,47×, touches d'épaule 1,30×, psoas 1,26×. C'est un
 *    défaut du dessin d'origine, pas de l'affichage — et on l'assume : la boucle
 *    reste partout où les deux poses sont les deux bouts d'un même mouvement.
 *    Amincir le trait épais a été essayé (feMorphology erode) et écarté : le
 *    rayon se quantifie au pixel entier, donc tout ce qui était déjà fin
 *    disparaît — sur les pompes archer l'encre tombait de 8005 à 2993 px et le
 *    dessin partait en morceaux.
 * 1 bis. Une boucle ne se lit que si les deux poses diffèrent assez. Mesuré en
 *    encre commune (intersection / union des pixels, rendu à 256 px), la
 *    bibliothèque se sépare nettement : quatorze paires partagent 3 à 18 % de
 *    leur encre et se lisent comme un mouvement ; trois en partagent plus de
 *    40 % — abduction 44 %, Pallof 49 %, relevé de jambes 58 % — et leur boucle
 *    clignote au lieu de bouger. Celles-là gardent la paire fixe. C'est un
 *    défaut des dessins, pas du fondu.
 *
 * 2. Deux dessins partout où les deux bouts du mouvement se distinguent, un seul
 *    partout ailleurs : le gainage latéral et le copenhague, dont les deux images
 *    montrent la même chose, et le bird dog, dont elles montrent la même pose
 *    retournée. Une paire y ferait croire à un mouvement qui n'existe pas.
 * 3. `coteDessine` dit de quel côté de l'image se trouve le membre qui travaille.
 *    Quand le lecteur annonce un côté, le dessin est retourné pour que ce membre
 *    tombe du côté annoncé — comme dans un miroir de salle. Absent là où « côté »
 *    ne désigne pas un membre : sur le bird dog, c'est une diagonale bras-jambe.
 *
 * Les huit exercices absents de cette table n'ont pas de dessin juste dans la
 * bibliothèque : roulade sur les avant-bras, cheville au mur, hanche 90/90,
 * rotation thoracique, réception sur une jambe, rotation externe, le curl sur
 * serviette — dont le dessin le plus proche montre un banc à chevilles — et les
 * dips entre deux chaises : les trois images de `chair-dip` montrent un homme
 * assis sur une seule chaise, une main sur le dossier, alors que l'exercice se
 * fait entre deux chaises dos à dos, mains sur les assises et buste penché en
 * avant. Ce n'est pas le même geste, et aucune paire de ces images ne le montre.
 * Les dessins voisins montrent un autre mouvement, mieux vaut rien qu'à peu près.
 */
type Image = { n: number; legende: string }
type Cote = 'gauche' | 'droit'
type Dessin = { dossier: string; images: Image[]; coteDessine?: Cote; sansBoucle?: string }

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
  'pompes-archer': {
    dossier: 'archer-push-up',
    images: [{ n: 3, legende: 'En bas' }, { n: 1, legende: 'En haut' }],
  },
  'pompes-lentes': {
    dossier: 'push-up',
    images: [{ n: 3, legende: 'En bas' }, { n: 1, legende: 'En haut' }],
  },

  // Abdos
  'releve-jambes-suspendu': {
    dossier: 'hanging-leg-raise',
    sansBoucle: "les deux poses partagent 58 % de leur encre : la boucle clignote au lieu de montrer un geste",
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
    sansBoucle: "les deux poses partagent 49 % de leur encre : la boucle clignote au lieu de montrer un geste",
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
    sansBoucle: "les deux poses partagent 44 % de leur encre : la boucle clignote au lieu de montrer un geste",
    coteDessine: 'droit', // jambe du dessus vers la droite de l'image
    images: [{ n: 3, legende: 'Jambe basse' }, { n: 1, legende: 'Jambe levée' }],
  },
  'descente-laterale': {
    dossier: 'step-down',
    coteDessine: 'droit', // jambe d'appui sur la marche, à droite de l'image
    images: [{ n: 3, legende: 'Sur la marche' }, { n: 1, legende: 'En descente' }],
  },
  copenhague: {
    dossier: 'copenhagen-plank',
    coteDessine: 'gauche', // jambe du dessus, celle qui travaille, vers la gauche
    // Un seul dessin : les images 1 et 3 montrent la même position jambe tendue —
    // la légende « jambe pliée » de l'image 1 ne correspondait à rien de dessiné.
    // Et le copenhague est un maintien, pas un aller-retour : une paire promettait
    // un mouvement que l'exercice n'a pas. On garde l'image 3, la seule dont la
    // légende disait vrai.
    images: [{ n: 3, legende: 'La position' }],
  },
  'bird-dog-gainage': {
    dossier: 'bird-dog',
    // Un seul dessin : les deux images sont la même pose retournée (23 % d'encre
    // commune une fois l'une miroitée, contre 11 % telles quelles). Côte à côte
    // sans légende — c'est le cas dans les lecteurs — ça donnait deux bonshommes
    // face à face. Le lecteur annonce déjà le côté travaillé.
    images: [{ n: 1, legende: 'La position' }],
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

/**
 * La boucle entre les deux bouts du mouvement : c'est ce qu'on affiche partout
 * où les deux poses se distinguent, la paire fixe ne restant que pour les
 * exercices marqués `sansBoucle`.
 *
 * L'image 2 a été essayée comme pose intermédiaire et écartée pour la raison
 * déjà donnée en tête de fichier : son trait est plus épais, et en boucle ça
 * devient un battement d'épaisseur à chaque cycle. Deux poses, un seul trait.
 *
 * Les dessins sont empilés et leur opacité enchaînée : le masque reste
 * vectoriel, donc la teinte suit toujours le thème et rien ne s'alourdit.
 * `recouvrement` est la part du cycle où deux poses se croisent — à 0 on aurait
 * un diaporama, trop haut le dessin devient flou. Le réglage se sent surtout
 * quand les deux poses se recouvrent peu (la roulette abdominale : 3 % d'encre
 * commune), où un fondu long laisse voir deux corps au lieu d'un.
 */
function Boucle({
  ex,
  dossier,
  sequence,
  retourne,
  duree = 2.4,
  recouvrement = 6,
}: {
  ex: Exercise
  dossier: string
  sequence: number[]
  retourne: boolean
  duree?: number
  recouvrement?: number
}) {
  const base = import.meta.env.BASE_URL
  const cadres = [...new Set(sequence)]
  const n = sequence.length
  const pas = 100 / n
  const nom = (f: number) => `boucle-${dossier}-${f}`

  // À chaque frontière de pas, la pose sortante vaut encore 1 et l'entrante 0 ;
  // `recouvrement` plus loin, l'inverse. Entre les deux, CSS interpole — c'est
  // tout le fondu.
  const css =
    cadres
      .map((f) => {
        const v = (i: number) => (sequence[i] === f ? 1 : 0)
        const arrets = [`0%{opacity:${v(n - 1)}}`]
        for (let i = 0; i < n; i++) {
          arrets.push(`${(i * pas + recouvrement).toFixed(2)}%{opacity:${v(i)}}`)
          arrets.push(`${((i + 1) * pas).toFixed(2)}%{opacity:${v(i)}}`)
        }
        return `@keyframes ${nom(f)}{${arrets.join('')}}`
      })
      .join('') +
    // Mouvement réduit : on s'arrête sur la première pose de la séquence.
    `@media (prefers-reduced-motion:reduce){.boucle-${dossier}>*{animation:none!important;opacity:0}` +
    `.boucle-${dossier}>:first-child{opacity:1}}`

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <style>{css}</style>
      <figure style={{ margin: 0, flex: '0 0 calc(50% - 6px)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div
          class={`boucle-${dossier}`}
          role="img"
          aria-label={`${ex.nom}, le mouvement`}
          style={{ position: 'relative', aspectRatio: '1' }}
        >
          {cadres.map((f) => (
            <div
              key={f}
              style={{
                ...masque(`${base}illustrations/${dossier}/frame-${f}.svg`, 'var(--encre)', retourne),
                position: 'absolute',
                inset: 0,
                aspectRatio: undefined,
                animation: `${nom(f)} ${duree}s infinite`,
              }}
            />
          ))}
        </div>
        <figcaption class="discret" style={{ fontSize: '13px', textAlign: 'center' }}>
          Le mouvement
        </figcaption>
      </figure>
    </div>
  )
}

export function Positions({ ex, couleur, cote }: { ex: Exercise; couleur?: string; cote?: Cote | null }) {
  const d = DESSINS[ex.id]
  if (!d) return null
  const base = import.meta.env.BASE_URL
  const seul = d.images.length === 1
  const retourne = !!cote && !!d.coteDessine && cote !== d.coteDessine

  // La boucle est la règle dès qu'il y a deux poses : `sansBoucle` dit pourquoi
  // un exercice y échappe. L'ordre des poses est celui de `images`, qui va déjà
  // du début à la fin du mouvement.
  if (!seul && !d.sansBoucle)
    return <Boucle ex={ex} dossier={d.dossier} sequence={d.images.map((i) => i.n)} retourne={retourne} />

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
