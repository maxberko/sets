import { useEffect } from 'preact/hooks'

/**
 * Peint le fond du document, pas seulement celui de l'écran.
 * Sans ça, un écran plus court que la fenêtre laisse une bande blanche sous le pli,
 * et le rebond de défilement montre du blanc au lieu de la couleur du programme.
 */
export function useFond(couleur: string): void {
  useEffect(() => {
    const avant = document.body.style.background
    const meta = document.querySelector('meta[name="theme-color"]')
    const themeAvant = meta?.getAttribute('content') ?? null
    document.body.style.background = couleur
    meta?.setAttribute('content', couleur)
    return () => {
      document.body.style.background = avant
      if (themeAvant) meta?.setAttribute('content', themeAvant)
    }
  }, [couleur])
}
