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
    // `theme-color` n'accepte pas les variables CSS : posé tel quel, `var(--pecs)`
    // était ignoré et la barre d'état du téléphone restait sur la couleur d'avant.
    // On relit donc la valeur résolue sur le corps, qui sort en rgb().
    meta?.setAttribute('content', getComputedStyle(document.body).backgroundColor || couleur)
    return () => {
      document.body.style.background = avant
      if (themeAvant) meta?.setAttribute('content', themeAvant)
    }
  }, [couleur])
}
