import type { VideoRef } from './types'

/**
 * La vidéo qui clôt chaque séance, en plein écran, sans son. Choisie parmi douze
 * extraits intégrables pour une raison simple : c'était la seule dont les trois
 * images repères (au quart, à la moitié, aux trois quarts) montraient toutes des
 * tubes nets, sans titre incrusté, sans plage ni spectateurs. Les autres
 * alternaient gros plans, logos et bords de plage — mauvais fond pour un texte.
 *
 * Le départ tombe au premier quart, sur l'image repère vérifiée, pour sauter
 * l'introduction. Le format de ligne est celui que lit `scripts/verifier-videos.mjs`,
 * qui la contrôle avec les démonstrations.
 */
export const FIN_SURF = {
  id: 'fin-surf',
  video: { url: 'https://www.youtube.com/watch?v=m-IYI7G4biM', creator: 'Waves of the World', youtubeId: 'm-IYI7G4biM', videoCreator: 'Waves of the World', start: 1035 } satisfies VideoRef,
  lieu: "Teahupo'o",
}
