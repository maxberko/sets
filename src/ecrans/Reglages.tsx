import { useState } from 'preact/hooks'
import { BoutonRetour, Entete } from '../composants/communs'
import { Coche } from '../composants/icones'
import { EQUIPEMENTS, DEFAUT, exporterJSON, importerJSON } from '../lib/db'
import { FORMULES } from '../data'
import { modifier, remplacer, useDonnees } from '../lib/etat'
import { aller } from '../lib/routeur'
import { Champ } from './Suivi'

export function Reglages() {
  const d = useDonnees()
  const [message, setMessage] = useState<string | null>(null)

  const exporter = async () => {
    const texte = exporterJSON(d)
    const nom = `sets-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`
    const fichier = new File([texte], nom, { type: 'application/json' })
    try {
      if (navigator.canShare?.({ files: [fichier] })) {
        await navigator.share({ files: [fichier], title: 'Sauvegarde Sets' })
        return
      }
    } catch {
      /* l'utilisateur a annulé, on retombe sur le téléchargement */
    }
    const url = URL.createObjectURL(fichier)
    const a = document.createElement('a')
    a.href = url
    a.download = nom
    a.click()
    URL.revokeObjectURL(url)
  }

  const importer = (e: Event) => {
    const f = (e.target as HTMLInputElement).files?.[0]
    if (!f) return
    const lecteur = new FileReader()
    lecteur.onload = () => {
      const donnees = importerJSON(String(lecteur.result))
      if (!donnees) {
        setMessage("Ce fichier n'est pas une sauvegarde Sets.")
        return
      }
      remplacer(donnees)
      setMessage('Sauvegarde restaurée.')
    }
    lecteur.readAsText(f)
  }

  return (
    <div class="ecran">
      <Entete gauche={<BoutonRetour label="Aujourd'hui" />} />
      <div class="contenu" style={{ paddingBottom: 'calc(40px + var(--barre-bas))' }}>
        <h1>Réglages</h1>

        <Groupe titre="Ta formule">
          <p class="discret" style={{ fontSize: '14px', lineHeight: 1.45 }}>
            Le nombre de séances par semaine. Le contenu des séances ne change pas.
          </p>
          {FORMULES.map((f) => {
            const choisie = d.reglages.formule === f.id
            return (
              <button
                key={f.id}
                onClick={() => modifier((data) => void (data.reglages.formule = f.id))}
                aria-pressed={choisie}
                class="rangee"
                style={{ alignItems: 'flex-start' }}
              >
                <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left', minWidth: 0 }}>
                  <span style={{ fontWeight: choisie ? 600 : 500 }}>
                    {f.nom} · {f.seances} séances
                  </span>
                  <span class="discret" style={{ fontSize: '13px', lineHeight: 1.4 }}>{f.resume}</span>
                </span>
                <span
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--encre)',
                    background: choisie ? 'var(--encre)' : 'transparent',
                    flex: 'none',
                    marginTop: '2px',
                  }}
                />
              </button>
            )
          })}
        </Groupe>

        <Groupe titre="Ta salle">
          <p class="discret" style={{ fontSize: '14px', lineHeight: 1.45 }}>
            L'équipement varie d'un club Basic-Fit à l'autre. Décoche ce que ton club n'a pas : l'exercice bascule sur sa version tapis
            et la séance continue.
          </p>
          {EQUIPEMENTS.map((e) => (
            <Bascule
              key={e.id}
              label={e.label}
              aide={e.aide}
              actif={d.reglages.equipement[e.id] ?? true}
              onChange={(v) => modifier((data) => void (data.reglages.equipement[e.id] = v))}
            />
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', paddingTop: '6px' }}>
            <Champ
              label="Plus petit incrément, en kg"
              valeur={String(d.reglages.pasCharge)}
              onChange={(v) => {
                const n = Number.parseFloat(v.replace(',', '.'))
                if (Number.isFinite(n) && n > 0) modifier((data) => void (data.reglages.pasCharge = n))
              }}
            />
            <Champ
              label="Haltère le plus lourd"
              valeur={String(d.reglages.halteresMax)}
              onChange={(v) => {
                const n = Number.parseFloat(v.replace(',', '.'))
                if (Number.isFinite(n) && n > 0) modifier((data) => void (data.reglages.halteresMax = n))
              }}
            />
          </div>
        </Groupe>

        <Groupe titre="Pendant la séance">
          <Bascule label="Sons" aide="Un bip à la fin du repos et des maintiens." actif={d.reglages.sons} onChange={(v) => modifier((data) => void (data.reglages.sons = v))} />
          <Bascule label="Vibration" aide="Une vibration à chaque série validée." actif={d.reglages.vibration} onChange={(v) => modifier((data) => void (data.reglages.vibration = v))} />
          <Bascule label="Garder l'écran allumé" aide="Pendant les séances uniquement." actif={d.reglages.ecranAllume} onChange={(v) => modifier((data) => void (data.reglages.ecranAllume = v))} />
        </Groupe>

        <Groupe titre="Tes données">
          <p class="discret" style={{ fontSize: '14px', lineHeight: 1.45 }}>
            Tout reste sur ce téléphone. Aucun compte, aucun serveur, rien n'est envoyé nulle part. C'est aussi pour ça qu'une
            sauvegarde vaut le coup.
          </p>
          <button class="secondaire" onClick={exporter} style={{ justifyContent: 'space-between' }}>
            <span>Exporter une sauvegarde</span>
          </button>
          <label class="secondaire" style={{ justifyContent: 'space-between', cursor: 'pointer' }}>
            <span>Restaurer une sauvegarde</span>
            <input type="file" accept="application/json,.json" onChange={importer} style={{ display: 'none' }} />
          </label>
          {message && <p style={{ fontSize: '14px' }}>{message}</p>}
        </Groupe>

        <Groupe titre="Le bloc">
          <p class="discret" style={{ fontSize: '14px', lineHeight: 1.45 }}>
            Le bloc dure 8 semaines, avec un allègement en semaine 5. Il a commencé le{' '}
            {new Date(`${d.reglages.debutBloc}T00:00:00`).toLocaleDateString('fr-FR')}.
          </p>
          <button
            class="secondaire"
            onClick={() => {
              if (confirm('Repartir sur un nouveau bloc de 8 semaines ? Les charges et les échelons sont conservés.')) {
                modifier((data) => void (data.reglages.debutBloc = new Date().toISOString().slice(0, 10)))
                setMessage('Nouveau bloc démarré.')
              }
            }}
          >
            Démarrer un nouveau bloc
          </button>
          <button
            class="secondaire"
            style={{ borderColor: 'var(--pecs)', color: 'var(--pecs)' }}
            onClick={() => {
              if (confirm('Effacer toutes les séances, les charges et les points du corps ? Cette action est définitive.')) {
                remplacer({ ...structuredClone(DEFAUT), reglages: { ...structuredClone(DEFAUT).reglages, onboarde: true } })
                aller('/')
              }
            }}
          >
            Tout effacer
          </button>
        </Groupe>
      </div>
    </div>
  )
}

function Groupe({ titre, children }: { titre: string; children: preact.ComponentChildren }) {
  return (
    <section style={{ borderTop: '1.5px solid var(--encre)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3>{titre}</h3>
      {children}
    </section>
  )
}

export function Bascule({
  label,
  aide,
  actif,
  onChange,
}: {
  label: string
  aide?: string
  actif: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!actif)}
      role="switch"
      aria-checked={actif}
      class="rangee"
      style={{ alignItems: 'flex-start' }}
    >
      <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left', minWidth: 0 }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        {aide && <span class="discret" style={{ fontSize: '13px', lineHeight: 1.4 }}>{aide}</span>}
      </span>
      <span
        style={{
          width: '26px',
          height: '26px',
          border: '1.5px solid var(--encre)',
          borderRadius: 'var(--r)',
          display: 'grid',
          placeItems: 'center',
          flex: 'none',
          background: actif ? 'var(--encre)' : 'transparent',
          marginTop: '2px',
        }}
      >
        {actif && <Coche taille={16} couleur="var(--papier)" />}
      </span>
    </button>
  )
}
