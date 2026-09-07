import { useEffect, useState } from 'preact/hooks'

export function chemin(): string {
  const h = location.hash.replace(/^#/, '')
  return h.startsWith('/') ? h : '/'
}

export function aller(vers: string): void {
  if (chemin() === vers) return
  location.hash = vers
}

export function retour(): void {
  if (history.length > 1) history.back()
  else aller('/')
}

export function useChemin(): string {
  const [c, setC] = useState(chemin())
  useEffect(() => {
    const f = () => {
      setC(chemin())
      window.scrollTo(0, 0)
    }
    addEventListener('hashchange', f)
    return () => removeEventListener('hashchange', f)
  }, [])
  return c
}

/** Découpe « /seance/pecs-a/salle » en ['seance', 'pecs-a', 'salle']. */
export function segments(c: string): string[] {
  return c.split('/').filter(Boolean)
}
