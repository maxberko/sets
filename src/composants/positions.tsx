import type { Exercise } from '../data/types'

/**
 * Dessins de position repris de workout-guide (CC BY-SA 4.0).
 * Les fichiers restent tels quels dans `public/illustrations/`, rangés sous leur
 * nom d'origine ; la couleur est posée à l'affichage par masque CSS, ce qui évite
 * de toucher au tracé — voir `public/illustrations/ATTRIBUTION.txt`.
 *
 * Deux choix valent explication, tirés d'une relecture image par image :
 *
 * 1. On n'utilise jamais l'image 2. Dans presque toute la bibliothèque elle est
 *    tracée plus épais que les images 1 et 3 — et sur le Pallof elle est
 *    carrément abîmée. Les images 1 et 3 vont ensemble.
 * 2. Les exercices tenus (gainages, étirements) n'ont qu'une image : leurs trois
 *    dessins sont quasi identiques, une paire ne montrerait aucun mouvement.
 *
 * Les six exercices absents de cette table n'ont pas de dessin juste dans la
 * bibliothèque : roulade sur les avant-bras, cheville au mur, hanche 90/90,
 * rotation thoracique, réception sur une jambe, rotation externe. Les dessins
 * voisins montrent un autre mouvement, mieux vaut rien qu'à peu près.
 */
type Dessin = { dossier: string; images: [number, string][] }

const DESSINS: Record<string, Dessin> = {
  // Pecs
  'developpe-incline-halteres': {
    dossier: 'incline-dumbbell-press',
    images: [[3, 'En bas'], [1, 'En haut']],
  },
  'developpe-couche-halteres': {
    dossier: 'dumbbell-bench-press',
    images: [[3, 'En bas'], [1, 'En haut']],
  },
  'ecarte-poulie': {
    dossier: 'cable-fly',
    images: [[3, 'Ouvert'], [1, 'Fermé']],
  },
  'dips-assistes': { dossier: 'assisted-dip', images: [[1, 'Sur la machine']] },
  'pompes-pieds-sureleves': { dossier: 'decline-push-up', images: [[1, 'Pieds sur le banc']] },
  'pompes-lestees': { dossier: 'weighted-push-up', images: [[1, 'Disque sur le dos']] },
  'pompes-lentes': { dossier: 'push-up', images: [[1, 'En haut']] },
  'dips-chaises': { dossier: 'chair-dip', images: [[1, 'Entre deux appuis']] },

  // Abdos
  'releve-jambes-suspendu': {
    dossier: 'hanging-leg-raise',
    images: [[3, 'Suspendu'], [1, 'Jambes levées']],
  },
  'crunch-poulie': {
    dossier: 'cable-crunch',
    images: [[1, 'À genoux'], [3, 'Enroulé']],
  },
  'roulette-abdominale': {
    dossier: 'ab-wheel',
    images: [[3, 'Départ'], [1, 'Étendu']],
  },
  'pallof-poulie': {
    dossier: 'pallof-press',
    images: [[1, 'Au buste'], [3, 'Bras tendus']],
  },
  'gainage-lateral-leste': { dossier: 'side-plank', images: [[1, 'La position']] },
  'crunch-inverse': {
    dossier: 'reverse-crunch',
    images: [[3, 'Jambes basses'], [1, 'Hanches décollées']],
  },
  'gainage-touches-epaule': {
    dossier: 'plank-shoulder-tap',
    images: [[1, 'Gainage'], [3, 'Touche']],
  },
  'gainage-lateral': { dossier: 'side-plank', images: [[1, 'La position']] },

  // Mobilité
  'psoas-demi-genou': { dossier: 'kneeling-hip-flexor-stretch', images: [[1, 'La position']] },
  'abduction-hanche': {
    dossier: 'side-lying-hip-abduction',
    images: [[3, 'Jambe basse'], [1, 'Jambe levée']],
  },
  'descente-laterale': {
    dossier: 'step-down',
    images: [[3, 'Sur la marche'], [1, 'En descente']],
  },
  'nordic-ischios': {
    dossier: 'nordic-hamstring-curl',
    images: [[3, 'À genoux'], [1, 'Descente']],
  },
  copenhague: { dossier: 'copenhagen-plank', images: [[1, 'La position']] },
  'bird-dog-gainage': { dossier: 'bird-dog', images: [[1, 'Bras et jambe tendus']] },
}

export function aDesDessins(id: string) {
  return id in DESSINS
}

export function Positions({ ex, couleur }: { ex: Exercise; couleur?: string }) {
  const d = DESSINS[ex.id]
  if (!d) return null
  const base = import.meta.env.BASE_URL
  const seul = d.images.length === 1

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      {d.images.map(([n, legende], i) => {
        const url = `url(${base}illustrations/${d.dossier}/frame-${n}.svg)`
        // La couleur du programme marque la fin du mouvement ; une image seule
        // reste à l'encre, elle n'a pas d'arrivée à signaler.
        const teinte = !seul && i === d.images.length - 1 ? (couleur ?? 'var(--encre)') : 'var(--encre)'
        return (
          <figure key={n} style={{ margin: 0, flex: seul ? '0 1 60%' : 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              role="img"
              aria-label={`${ex.nom}, ${legende.toLowerCase()}`}
              style={{
                aspectRatio: '1',
                background: teinte,
                maskImage: url,
                WebkitMaskImage: url,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
              }}
            />
            <figcaption class="discret" style={{ fontSize: '13px' }}>{legende}</figcaption>
          </figure>
        )
      })}
    </div>
  )
}
