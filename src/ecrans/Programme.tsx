import { useState } from 'preact/hooks'
import { BarreOnglets, Entete, Titre } from '../composants/communs'
import { Chevron, Coche, PointPreuve } from '../composants/icones'
import { COULEUR_PROGRAMME, NOM_PROGRAMME, SEANCES, TOUS_EXERCICES, exerciceDuSlot, planDe } from '../data'
import { JOURS, NOM_JOUR, descriptionFormule, type Jour } from '../data/seances'
import { useDonnees } from '../lib/etat'
import { aller } from '../lib/routeur'
import { jourDe, lundiDe } from '../lib/semaine'

const FILTRES = ['tous', 'pecs', 'abdos', 'mobilite'] as const
type Filtre = (typeof FILTRES)[number]

export function Programme() {
  const d = useDonnees()
  const [filtre, setFiltre] = useState<Filtre>('tous')
  const liste = TOUS_EXERCICES.filter((e) => filtre === 'tous' || e.programme === filtre)

  // L'écran parlait de séances sans jamais dire quand : trois modèles listés hors
  // du temps, pendant que l'accueil raisonnait en jours. Le plan de la formule
  // fournit les deux, et le journal dit ce qui est déjà fait cette semaine.
  const formule = descriptionFormule(d.reglages.formule)
  const plan = planDe(d.reglages.formule)
  const maintenant = new Date()
  const jourActuel = jourDe(maintenant)
  const lundi = lundiDe(maintenant)
  const faites = d.seances.filter((s) => s.fin && lundiDe(new Date(s.debut)) === lundi)

  const joursDe = (templateId: string): Jour[] => JOURS.filter((j) => (plan[j] ?? []).includes(templateId))
  const compte = (ids: string[]) => JOURS.reduce((n, j) => n + (plan[j] ?? []).filter((x) => ids.includes(x)).length, 0)
  const force = compte(SEANCES.filter((t) => t.programme !== 'mobilite').map((t) => t.id))
  const mobilite = compte(['mobilite'])

  return (
    <div class="ecran">
      <Entete />
      <div class="contenu">
        <Titre
          titre="Programme"
          apres={`Formule ${formule.nom.toLowerCase()} · ${force} séances de force, ${mobilite} de mobilité`}
        />

        <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SEANCES.map((t) => {
            const jours = joursDe(t.id)
            const prevues = jours.length
            const faitesIci = faites.filter((s) => s.templateId === t.id).length
            const aujourdhui = jours.includes(jourActuel) && faitesIci < prevues
            const toutFait = prevues > 0 && faitesIci >= prevues

            // L'état se dit dans les mots de l'accueil : ce qui reste à faire
            // aujourd'hui, ce qui est fait, ce qui vient. Une séance répétée dans
            // la semaine compte ses passages plutôt que de se dire « faite ».
            const etat = prevues === 0
              ? 'hors formule'
              : aujourdhui
                ? "aujourd'hui"
                : toutFait
                  ? prevues > 1 ? `${faitesIci} sur ${prevues} cette semaine` : 'faite cette semaine'
                  : prevues > 1
                    ? `${faitesIci} sur ${prevues} cette semaine`
                    : 'à venir'

            return (
              <button
                key={t.id}
                onClick={() => aller(t.demandeLieu ? `/seance/${t.id}` : `/seance/${t.id}/tapis`)}
                class="rangee"
                style={{ borderBottom: '1px solid var(--filet)', opacity: toutFait ? 0.55 : 1 }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <span class="pastille" style={{ background: COULEUR_PROGRAMME[t.programme] }} />
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                    <span style={{ fontWeight: 600 }}>{t.nom}</span>
                    <span style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: aujourdhui ? 600 : 400, color: aujourdhui ? 'var(--encre)' : 'var(--sourdine)' }}>
                        {prevues === 0 ? 'hors formule' : jours.map((j) => NOM_JOUR[j]).join(' · ')}
                      </span>
                      {toutFait && <Coche taille={13} />}
                    </span>
                    <span class="discret" style={{ fontSize: '13px' }}>
                      {etat} · {t.slots.length} exercices · {t.minutes.salle} min
                    </span>
                  </span>
                </span>
                <Chevron />
              </button>
            )
          })}
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px', borderTop: '1.5px solid var(--encre)' }}>
          <h3>Tous les exercices</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {FILTRES.map((f) => {
              // Chaque filtre porte la couleur de son programme, selon la même règle
              // que la bande de semaine : contour quand il est libre, plein quand il
              // est choisi. « Tous » n'est pas un programme, il reste à l'encre.
              const actif = filtre === f
              const teinte = f === 'tous' ? 'var(--encre)' : COULEUR_PROGRAMME[f]
              return (
                <button
                  key={f}
                  onClick={() => setFiltre(f)}
                  aria-pressed={actif}
                  style={{
                    border: `1.5px solid ${teinte}`,
                    borderRadius: 'var(--r)',
                    padding: '9px 13px',
                    fontSize: '13px',
                    fontWeight: 600,
                    background: actif ? teinte : 'transparent',
                    // Encre sur les trois couleurs de programme, vérifiée en
                    // contraste ; seul « Tous », plein d'encre, passe au papier.
                    color: actif && f === 'tous' ? 'var(--papier)' : 'var(--encre)',
                    minHeight: 'var(--cible)',
                  }}
                >
                  {f === 'tous' ? 'Tous' : NOM_PROGRAMME[f]}
                </button>
              )
            })}
          </div>

          {liste.map((e) => (
            <button key={e.id} onClick={() => aller(`/exercice/${e.id}`)} class="rangee">
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <span class="pastille" style={{ background: COULEUR_PROGRAMME[e.programme] }} />
                <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                  <span style={{ fontWeight: 500 }}>{e.nom}</span>
                  <span class="discret" style={{ fontSize: '13px' }}>{e.resume}</span>
                </span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {e.evidence && <PointPreuve plein={e.evidence === 'pleine'} />}
                <Chevron />
              </span>
            </button>
          ))}
        </section>
        <div style={{ height: '12px' }} />
      </div>
      <BarreOnglets />
    </div>
  )
}

export function creneauxLisibles(templateId: string): string {
  const t = SEANCES.find((s) => s.id === templateId)
  if (!t) return ''
  return t.slots.map((s) => exerciceDuSlot(s, 'salle')?.nom ?? '').filter(Boolean).join(' · ')
}
