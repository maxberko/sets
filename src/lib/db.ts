import { get, set, del } from 'idb-keyval'
import type { Venue } from '../data/types'
import type { Formule } from '../data/seances'

export interface SetLog {
  slotId: string
  exerciceId: string
  index: number
  reps?: number
  kg?: number
  echelon?: number
  secondes?: number
  rir?: number
  at: number
}

export interface SessionLog {
  id: string
  templateId: string
  venue: Venue
  debut: number
  fin?: number
  series: SetLog[]
}

export interface CheckIn {
  /** AAAA-MM-JJ */
  date: string
  kg?: number
  tailleCm?: number
}

export interface Reglages {
  onboarde: boolean
  /** Combien de séances par semaine. Ne change pas leur contenu. */
  formule: Formule
  /** Plus petit incrément disponible dans la salle, par haltère. */
  pasCharge: number
  /** Haltère le plus lourd du club. Sert à prévenir quand la progression le dépasse. */
  halteresMax: number
  sons: boolean
  vibration: boolean
  ecranAllume: boolean
  /** Début du bloc de 8 semaines, AAAA-MM-JJ. */
  debutBloc: string
  /** Ce que le club a vraiment, répondu à l'installation. */
  equipement: Record<string, boolean>
}

export interface Progression {
  /** exerciceId -> kilos */
  charges: Record<string, number>
  /** exerciceId -> indice d'échelon */
  echelons: Record<string, number>
  /** exerciceId -> séances consécutives sous la fourchette */
  echecs: Record<string, number>
  /** exerciceId -> secondes de maintien */
  maintiens: Record<string, number>
  /** exerciceId -> séances consécutives notées faciles */
  faciles: Record<string, number>
}

export interface Donnees {
  version: 1
  reglages: Reglages
  progression: Progression
  seances: SessionLog[]
  checkins: CheckIn[]
  enCours?: SessionLog
}

export const EQUIPEMENTS: { id: string; label: string; aide: string }[] = [
  { id: 'banc30', label: 'Banc réglable à 30°', aide: 'Sinon les pompes pieds surélevés prennent le relais.' },
  { id: 'poulie', label: 'Poulie libre', aide: 'Sinon la presse à pectoraux assise.' },
  { id: 'barreTraction', label: 'Barre de traction', aide: 'Sinon le crunch inversé au sol.' },
  { id: 'machineAssistee', label: 'Machine à dips assistés', aide: 'Sinon les dips entre deux chaises.' },
  { id: 'roulette', label: 'Roulette abdominale', aide: 'Sinon la roulade sur les avant-bras.' },
]

export const DEFAUT: Donnees = {
  version: 1,
  reglages: {
    onboarde: false,
    formule: 'standard',
    pasCharge: 2,
    halteresMax: 30,
    sons: true,
    vibration: true,
    ecranAllume: true,
    debutBloc: new Date().toISOString().slice(0, 10),
    equipement: { banc30: true, poulie: true, barreTraction: true, machineAssistee: true, roulette: true },
  },
  progression: { charges: {}, echelons: {}, echecs: {}, maintiens: {}, faciles: {} },
  seances: [],
  checkins: [],
}

// La version dev partage le domaine de la principale, donc son stockage : sans clé
// à part, tester une séance sur dev l'aurait inscrite dans le vrai historique.
const CLE = import.meta.env.VITE_CANAL === 'dev' ? 'sets-dev:donnees' : 'sets:donnees'

export async function charger(): Promise<Donnees> {
  try {
    const brut = await get<Donnees>(CLE)
    if (!brut || brut.version !== 1) return structuredClone(DEFAUT)
    // Fusion défensive : une version installée avant l'ajout d'un réglage doit rester lisible.
    return {
      ...structuredClone(DEFAUT),
      ...brut,
      reglages: { ...DEFAUT.reglages, ...brut.reglages, equipement: { ...DEFAUT.reglages.equipement, ...brut.reglages?.equipement } },
      progression: { ...DEFAUT.progression, ...brut.progression },
    }
  } catch {
    return structuredClone(DEFAUT)
  }
}

export async function sauver(d: Donnees): Promise<void> {
  await set(CLE, d)
}

export async function effacer(): Promise<void> {
  await del(CLE)
}

export function exporterJSON(d: Donnees): string {
  return JSON.stringify(d, null, 2)
}

export function importerJSON(texte: string): Donnees | null {
  try {
    const parse = JSON.parse(texte) as Donnees
    if (!parse || parse.version !== 1 || !Array.isArray(parse.seances)) return null
    return parse
  } catch {
    return null
  }
}
