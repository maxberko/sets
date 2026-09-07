import { useEffect, useState } from 'preact/hooks'
import { charger, sauver, DEFAUT, type Donnees } from './db'

type Ecouteur = (d: Donnees) => void

let etat: Donnees = structuredClone(DEFAUT)
let pret = false
const ecouteurs = new Set<Ecouteur>()

let enAttente: ReturnType<typeof setTimeout> | undefined
function persister() {
  clearTimeout(enAttente)
  enAttente = setTimeout(() => void sauver(etat), 200)
}

function diffuser() {
  for (const e of ecouteurs) e(etat)
}

export async function initEtat(): Promise<void> {
  etat = await charger()
  pret = true
  diffuser()
}

export function lire(): Donnees {
  return etat
}

export function etatPret(): boolean {
  return pret
}

/** Modifie l'état, notifie l'interface et enregistre sur le téléphone. */
export function modifier(f: (d: Donnees) => void): void {
  const copie = structuredClone(etat)
  f(copie)
  etat = copie
  diffuser()
  persister()
}

export function remplacer(d: Donnees): void {
  etat = d
  diffuser()
  persister()
}

export function useDonnees(): Donnees {
  const [v, setV] = useState(etat)
  useEffect(() => {
    const e: Ecouteur = (d) => setV(d)
    ecouteurs.add(e)
    setV(etat)
    return () => {
      ecouteurs.delete(e)
    }
  }, [])
  return v
}
