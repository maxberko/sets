/**
 * Vérifie que chaque `youtubeId` du catalogue pointe sur une vraie vidéo, publique
 * et intégrable. Sans ça, une seule référence inventée ou une vidéo supprimée
 * donne un cadre noir dans l'appli, sans le moindre message d'erreur.
 *
 *   node scripts/verifier-videos.mjs
 *
 * Sort en code 1 si une vidéo manque, est privée, ou refuse l'intégration.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ICI = dirname(fileURLToPath(import.meta.url))
const FICHIERS = ['src/data/exercices.ts', 'src/data/mobilite.ts']

/** Associe chaque youtubeId à l'exercice qui le déclare, en remontant au dernier `id:`. */
function extraire(chemin) {
  const texte = readFileSync(join(ICI, '..', chemin), 'utf8')
  const trouves = []
  let dernierId = null
  for (const ligne of texte.split('\n')) {
    const id = ligne.match(/^\s*id: '([^']+)'/)
    if (id) dernierId = id[1]
    const yt = ligne.match(/youtubeId: '([^']+)'/)
    if (yt) {
      // La chaîne à comparer est celle de la VIDÉO. `creator` désigne la page de
      // référence contre laquelle les étapes écrites ont été vérifiées, souvent
      // une autre source : les confondre produit un avertissement à chaque ligne.
      const videoCreator = ligne.match(/videoCreator: '([^']+)'/)
      const creator = ligne.match(/creator: '([^']+)'/)
      trouves.push({
        exercice: dernierId,
        youtubeId: yt[1],
        chaineAttendue: videoCreator?.[1] ?? creator?.[1] ?? '?',
        fichier: chemin,
      })
    }
  }
  return trouves
}

async function oembed(id) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`
  const r = await fetch(url)
  if (r.status === 404) return { ok: false, raison: 'introuvable ou supprimée' }
  if (r.status === 401) return { ok: false, raison: 'privée' }
  if (!r.ok) return { ok: false, raison: `HTTP ${r.status}` }
  const j = await r.json()
  return { ok: true, titre: j.title, chaine: j.author_name }
}

/** La page d'intégration dit si le propriétaire autorise la lecture hors de YouTube. */
async function integrable(id) {
  const r = await fetch(`https://www.youtube-nocookie.com/embed/${id}`, {
    headers: { 'user-agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36' },
  })
  if (!r.ok) return { ok: false, raison: `page d'intégration HTTP ${r.status}` }
  const html = await r.text()
  if (/"status":"UNPLAYABLE"/.test(html)) return { ok: false, raison: 'lecture bloquée hors YouTube' }
  if (/"status":"LOGIN_REQUIRED"/.test(html)) return { ok: false, raison: 'connexion exigée' }
  if (/"status":"ERROR"/.test(html)) return { ok: false, raison: 'erreur de lecture' }
  return { ok: true }
}

const entrees = FICHIERS.flatMap(extraire)
if (entrees.length === 0) {
  console.log('Aucun youtubeId dans le catalogue.')
  process.exit(0)
}

console.log(`${entrees.length} vidéo(s) à vérifier\n`)
let echecs = 0

for (const e of entrees) {
  const meta = await oembed(e.youtubeId)
  if (!meta.ok) {
    console.log(`✗ ${e.exercice} (${e.youtubeId}) — ${meta.raison}`)
    echecs++
    continue
  }
  const emb = await integrable(e.youtubeId)
  if (!emb.ok) {
    console.log(`✗ ${e.exercice} (${e.youtubeId}) — ${emb.raison}`)
    console.log(`    « ${meta.titre} » — ${meta.chaine}`)
    echecs++
    continue
  }
  const normalise = (s) => (s ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
  const attendue = normalise(e.chaineAttendue)
  const reelle = normalise(meta.chaine)
  const concordance = reelle.includes(attendue) || attendue.includes(reelle)
  console.log(`✓ ${e.exercice} — « ${meta.titre} » — ${meta.chaine}${concordance ? '' : `  ⚠ chaîne annoncée : ${e.chaineAttendue}`}`)
}

console.log(`\n${entrees.length - echecs}/${entrees.length} valides`)
if (echecs > 0) {
  console.log(`${echecs} à corriger.`)
  process.exit(1)
}
