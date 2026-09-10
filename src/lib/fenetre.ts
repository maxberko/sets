import { useEffect } from 'preact/hooks'

/**
 * Publie la hauteur réelle de la fenêtre dans `--hauteur-fenetre`.
 *
 * `100dvh` ne suffit pas : sur mobile il résout souvent la fenêtre « large »,
 * barres d'interface exclues, et rend donc un écran plus haut que la zone
 * réellement visible. Mesuré ici : dvh donnait 751 px pour une fenêtre de 689,
 * et la barre d'action des lecteurs passait sous la ligne de flottaison.
 *
 * `visualViewport` est la seule mesure fiable, et elle a un bonus : quand le
 * clavier s'ouvre pour saisir une charge, l'écran se resserre au lieu de pousser
 * le bouton de validation hors de vue.
 */
export function useHauteurFenetre(): void {
  useEffect(() => {
    const appliquer = () => {
      const h = window.visualViewport?.height ?? window.innerHeight
      if (h > 0) document.documentElement.style.setProperty('--hauteur-fenetre', `${Math.round(h)}px`)
    }
    appliquer()
    const vv = window.visualViewport
    vv?.addEventListener('resize', appliquer)
    addEventListener('resize', appliquer)
    addEventListener('orientationchange', appliquer)
    return () => {
      vv?.removeEventListener('resize', appliquer)
      removeEventListener('resize', appliquer)
      removeEventListener('orientationchange', appliquer)
    }
  }, [])
}
