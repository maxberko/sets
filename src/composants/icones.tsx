import type { JSX } from 'preact'

interface Props {
  taille?: number
  couleur?: string
  epaisseur?: number
}

function base(taille: number, couleur: string, epaisseur: number, enfants: JSX.Element): JSX.Element {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke={couleur}
      stroke-width={epaisseur}
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      style={{ flex: 'none' }}
    >
      {enfants}
    </svg>
  )
}

export const Fleche = ({ taille = 24, couleur = 'currentColor', epaisseur = 2 }: Props) =>
  base(taille, couleur, epaisseur, <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>)

export const Chevron = ({ taille = 20, couleur = 'currentColor', epaisseur = 2 }: Props) =>
  base(taille, couleur, epaisseur, <path d="M9 6l6 6-6 6" />)

export const Retour = ({ taille = 22, couleur = 'currentColor', epaisseur = 2 }: Props) =>
  base(taille, couleur, epaisseur, <><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></>)

export const Croix = ({ taille = 24, couleur = 'currentColor', epaisseur = 2 }: Props) =>
  base(taille, couleur, epaisseur, <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>)

export const Coche = ({ taille = 22, couleur = 'currentColor', epaisseur = 2.4 }: Props) =>
  base(taille, couleur, epaisseur, <path d="M5 12l5 5L19 7" />)

export const Plus = ({ taille = 24, couleur = 'currentColor', epaisseur = 2.4 }: Props) =>
  base(taille, couleur, epaisseur, <><path d="M5 12h14" /><path d="M12 5v14" /></>)

export const Moins = ({ taille = 24, couleur = 'currentColor', epaisseur = 2.4 }: Props) =>
  base(taille, couleur, epaisseur, <path d="M5 12h14" />)

/** Trois curseurs : plus lisible qu'un engrenage a cette taille, et coherent
    avec un systeme de traits droits. */
export const Reglages = ({ taille = 22, couleur = 'currentColor', epaisseur = 2 }: Props) =>
  base(
    taille,
    couleur,
    epaisseur,
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
      <circle cx="9" cy="7" r="1.9" fill={couleur} stroke="none" />
      <circle cx="15" cy="12" r="1.9" fill={couleur} stroke="none" />
      <circle cx="7" cy="17" r="1.9" fill={couleur} stroke="none" />
    </>,
  )

export const Pause = ({ taille = 18, couleur = 'currentColor' }: Props) => (
  <svg width={taille} height={taille} viewBox="0 0 24 24" fill={couleur} aria-hidden="true" style={{ flex: 'none' }}>
    <rect x="6" y="5" width="4" height="14" rx="0.5" />
    <rect x="14" y="5" width="4" height="14" rx="0.5" />
  </svg>
)

export const Lecture = ({ taille = 18, couleur = 'currentColor' }: Props) => (
  <svg width={taille} height={taille} viewBox="0 0 24 24" fill={couleur} aria-hidden="true" style={{ flex: 'none' }}>
    <path d="M7 4l13 8-13 8z" />
  </svg>
)

/** Plein = un essai clinique soutient le fait de faire ça. Creux = usage clinique seulement. */
export function PointPreuve({ plein, taille = 9 }: { plein: boolean; taille?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: `${taille}px`,
        height: `${taille}px`,
        borderRadius: '50%',
        flex: 'none',
        background: plein ? 'currentColor' : 'transparent',
        border: plein ? 'none' : '1.5px solid currentColor',
      }}
    />
  )
}
