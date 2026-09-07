/** Petits accès matériel : écran allumé, vibration, bip. Tous silencieusement optionnels. */

let verrou: WakeLockSentinel | null = null

export async function garderEcranAllume(actif: boolean): Promise<void> {
  try {
    if (!actif) {
      await verrou?.release()
      verrou = null
      return
    }
    if (!('wakeLock' in navigator) || verrou) return
    verrou = await navigator.wakeLock.request('screen')
    verrou.addEventListener('release', () => {
      verrou = null
    })
  } catch {
    // Refusé ou non supporté : l'appli marche pareil, l'écran s'éteindra tout seul.
  }
}

export function vibrer(actif: boolean, motif: number | number[] = 60): void {
  try {
    if (actif && 'vibrate' in navigator) navigator.vibrate(motif)
  } catch {
    /* rien */
  }
}

let audio: AudioContext | undefined

export function biper(actif: boolean, hauteur = 880, duree = 0.12): void {
  if (!actif) return
  try {
    audio ??= new AudioContext()
    if (audio.state === 'suspended') void audio.resume()
    const o = audio.createOscillator()
    const g = audio.createGain()
    o.frequency.value = hauteur
    o.type = 'sine'
    g.gain.setValueAtTime(0.0001, audio.currentTime)
    g.gain.exponentialRampToValueAtTime(0.2, audio.currentTime + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duree)
    o.connect(g).connect(audio.destination)
    o.start()
    o.stop(audio.currentTime + duree + 0.02)
  } catch {
    /* rien */
  }
}
