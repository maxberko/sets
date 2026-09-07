/**
 * Génère les icônes PNG sans dépendance : on écrit les pixels à la main et on
 * assemble les blocs PNG avec zlib, qui est dans Node.
 *
 * Le mot-repère : trois barres, une par programme, sur fond encre.
 * C'est la bande de la semaine de l'écran « Aujourd'hui », réduite à un signe.
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ICI = dirname(fileURLToPath(import.meta.url))
const SORTIE = join(ICI, '..', 'public', 'icons')

const ENCRE = [0x14, 0x18, 0x1a]
const PECS = [0xe0, 0x56, 0x3f]
const ABDOS = [0x2e, 0x9d, 0x6b]
const MOBILITE = [0x2f, 0x86, 0xbe]

function crc32(buf) {
  let c
  const table = crc32.table ?? (crc32.table = (() => {
    const t = new Int32Array(256)
    for (let n = 0; n < 256; n++) {
      c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      t[n] = c
    }
    return t
  })())
  let crc = -1
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff]
  return (crc ^ -1) >>> 0
}

function bloc(type, donnees) {
  const longueur = Buffer.alloc(4)
  longueur.writeUInt32BE(donnees.length)
  const corps = Buffer.concat([Buffer.from(type, 'ascii'), donnees])
  const somme = Buffer.alloc(4)
  somme.writeUInt32BE(crc32(corps))
  return Buffer.concat([longueur, corps, somme])
}

function png(largeur, hauteur, pixels) {
  const entete = Buffer.alloc(13)
  entete.writeUInt32BE(largeur, 0)
  entete.writeUInt32BE(hauteur, 4)
  entete[8] = 8 // profondeur
  entete[9] = 6 // RGBA
  const brut = Buffer.alloc((largeur * 4 + 1) * hauteur)
  for (let y = 0; y < hauteur; y++) {
    brut[y * (largeur * 4 + 1)] = 0 // pas de filtre
    pixels.copy(brut, y * (largeur * 4 + 1) + 1, y * largeur * 4, (y + 1) * largeur * 4)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloc('IHDR', entete),
    bloc('IDAT', deflateSync(brut, { level: 9 })),
    bloc('IEND', Buffer.alloc(0)),
  ])
}

function dessiner(taille, marge) {
  const px = Buffer.alloc(taille * taille * 4)
  const mettre = (x, y, [r, v, b]) => {
    if (x < 0 || y < 0 || x >= taille || y >= taille) return
    const i = (y * taille + x) * 4
    px[i] = r
    px[i + 1] = v
    px[i + 2] = b
    px[i + 3] = 255
  }

  for (let y = 0; y < taille; y++) for (let x = 0; x < taille; x++) mettre(x, y, ENCRE)

  // Trois barres, épaisses, avec un vide entre elles. Proportions calées sur la bande de semaine.
  const zone = taille - marge * 2
  const hauteurBarre = Math.round(zone * 0.2)
  const vide = Math.round(zone * 0.1)
  const total = hauteurBarre * 3 + vide * 2
  const departY = Math.round((taille - total) / 2)
  const couleurs = [PECS, ABDOS, MOBILITE]
  const largeurs = [1, 0.72, 0.44]

  for (let n = 0; n < 3; n++) {
    const y0 = departY + n * (hauteurBarre + vide)
    const largeur = Math.round(zone * largeurs[n])
    for (let y = y0; y < y0 + hauteurBarre; y++) {
      for (let x = marge; x < marge + largeur; x++) mettre(x, y, couleurs[n])
    }
  }
  return px
}

mkdirSync(SORTIE, { recursive: true })

const rendus = [
  ['icon-192.png', 192, Math.round(192 * 0.16)],
  ['icon-512.png', 512, Math.round(512 * 0.16)],
  // Maskable : la zone sûre est le cercle central, donc on rentre le dessin.
  ['icon-maskable-512.png', 512, Math.round(512 * 0.26)],
]

for (const [nom, taille, marge] of rendus) {
  writeFileSync(join(SORTIE, nom), png(taille, taille, dessiner(taille, marge)))
  console.log(`écrit ${nom} (${taille}px)`)
}

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#14181A"/>
  <rect x="10" y="17" width="44" height="9" fill="#E0563F"/>
  <rect x="10" y="30" width="32" height="9" fill="#2E9D6B"/>
  <rect x="10" y="43" width="20" height="9" fill="#2F86BE"/>
</svg>
`
writeFileSync(join(ICI, '..', 'public', 'favicon.svg'), favicon)
writeFileSync(join(SORTIE, '..', 'apple-touch-icon.png'), png(180, 180, dessiner(180, Math.round(180 * 0.16))))
console.log('écrit favicon.svg et apple-touch-icon.png')
