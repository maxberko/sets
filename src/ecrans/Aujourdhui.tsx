import { BarreOnglets, Entete, Titre } from '../composants/communs'
import { Chevron, Fleche, Reglages as IconeReglages } from '../composants/icones'
import { COULEUR_PROGRAMME, INITIALE_JOUR, JOURS, NOM_JOUR, PLAN, SEMAINES_BLOC, seance, seriesParProgramme } from '../data'
import { useDonnees } from '../lib/etat'
import { aller } from '../lib/routeur'
import { formatDateCourte, jourDe, lundiDe, semaineDuBloc } from '../lib/semaine'
import type { Jour } from '../data/seances'

export function Aujourdhui() {
  const d = useDonnees()
  const maintenant = new Date()
  const jour = jourDe(maintenant)
  const semaine = semaineDuBloc(d.reglages.debutBloc, maintenant)
  const lundi = lundiDe(maintenant)

  const faitesCetteSemaine = d.seances.filter((s) => s.fin && lundiDe(new Date(s.debut)) === lundi)
  const faitesAujourdhui = faitesCetteSemaine.filter(
    (s) => new Date(s.debut).toDateString() === maintenant.toDateString(),
  )

  const prevues = PLAN[jour] ?? []
  const restantes = prevues.filter((id) => !faitesAujourdhui.some((s) => s.templateId === id))
  const mobiliteFaites = faitesCetteSemaine.filter((s) => s.templateId === 'mobilite').length
  const mobilitePrevues = JOURS.reduce((n, j) => n + (PLAN[j] ?? []).filter((x) => x === 'mobilite').length, 0)

  return (
    <div class="ecran">
      <Entete
        droite={
          <button onClick={() => aller('/reglages')} aria-label="Réglages" style={{ minHeight: 'var(--cible)', minWidth: 'var(--cible)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <IconeReglages />
          </button>
        }
      />
      <div class="contenu">
        <Titre titre={NOM_JOUR[jour]} apres={`${formatDateCourte(maintenant)} · semaine ${semaine} sur ${SEMAINES_BLOC}`} />

        <BandeSemaine jourActuel={jour} faites={faitesCetteSemaine.map((s) => ({ jour: jourDe(new Date(s.debut)), id: s.templateId }))} />

        {restantes.length === 0 && prevues.length > 0 && (
          <p style={{ padding: '18px 0', borderTop: '1.5px solid var(--encre)' }}>
            Tout est fait pour aujourd'hui. Prochaine séance {prochainJourAvecSeance(jour)}.
          </p>
        )}

        {prevues.length === 0 && (
          <div style={{ padding: '18px 0', borderTop: '1.5px solid var(--encre)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p>Jour de repos. Rien de prévu, et c'est voulu.</p>
            <button class="secondaire" onClick={() => aller('/programme')}>
              Lancer une séance quand même
            </button>
          </div>
        )}

        {restantes.map((id, i) => (
          <CarteSeance key={id} templateId={id} principale={i === 0} mobiliteFaites={mobiliteFaites} mobilitePrevues={mobilitePrevues} />
        ))}

        {faitesAujourdhui.length > 0 && (
          <p class="discret" style={{ fontSize: '14px', paddingTop: '4px' }}>
            {faitesAujourdhui.length === 1 ? 'Une séance déjà faite aujourd\'hui.' : `${faitesAujourdhui.length} séances déjà faites aujourd'hui.`}
          </p>
        )}

        <p class="discret" style={{ fontSize: '14px', paddingTop: '4px' }}>
          Tu surfes aujourd'hui ? Rien à faire, ça ne change pas le plan.
        </p>

        <div style={{ height: '12px' }} />
      </div>
      <BarreOnglets />
    </div>
  )
}

function prochainJourAvecSeance(jour: Jour): string {
  const i = JOURS.indexOf(jour)
  for (let n = 1; n <= 7; n++) {
    const j = JOURS[(i + n) % 7]!
    if ((PLAN[j] ?? []).length > 0) return NOM_JOUR[j].toLowerCase()
  }
  return 'bientôt'
}

function CarteSeance({
  templateId,
  principale,
  mobiliteFaites,
  mobilitePrevues,
}: {
  templateId: string
  principale: boolean
  mobiliteFaites: number
  mobilitePrevues: number
}) {
  const t = seance(templateId)
  if (!t) return null
  const couleur = COULEUR_PROGRAMME[t.programme]
  const series = seriesParProgramme(t, 'salle')
  const autres = Object.keys(series).filter((p) => p !== t.programme)

  const ouvrir = () => aller(t.demandeLieu ? `/seance/${t.id}` : `/seance/${t.id}/tapis`)

  if (!principale) {
    return (
      <button onClick={ouvrir} class="bloc-couleur" style={{ background: couleur, padding: '16px 18px', gap: '10px' }}>
        <span class="etiquette">{t.sousTitre}</span>
        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', width: '100%' }}>
          <span style={{ fontFamily: 'var(--titre)', fontWeight: 800, fontSize: '26px', letterSpacing: '-0.02em', lineHeight: 1 }}>{t.nom}</span>
          <span style={{ fontSize: '15px', whiteSpace: 'nowrap' }}>{t.minutes.tapis} min</span>
        </span>
        {t.programme === 'mobilite' && (
          <span style={{ fontSize: '14px' }}>
            {mobiliteFaites + 1}<sup></sup>e séance sur {mobilitePrevues} cette semaine · quand tu veux dans la journée
          </span>
        )}
      </button>
    )
  }

  return (
    <button onClick={ouvrir} class="bloc-couleur" style={{ background: couleur }}>
      <span class="etiquette" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {t.sousTitre}
        {autres.map((p) => (
          <span key={p} class="pastille" style={{ background: COULEUR_PROGRAMME[p] }} />
        ))}
      </span>
      <span style={{ fontFamily: 'var(--titre)', fontWeight: 800, fontSize: '40px', letterSpacing: '-0.025em', lineHeight: 0.95, textWrap: 'balance' }}>
        {t.nom}
      </span>
      <span style={{ fontSize: '15px', lineHeight: 1.4 }}>
        {t.slots.length} exercices · {t.slots.reduce((n, s) => n + s.series, 0)} séries efficaces
      </span>
      <span class="bloc-pied">
        <span>Commencer · {t.minutes.salle} min</span>
        <Fleche />
      </span>
    </button>
  )
}

function BandeSemaine({ jourActuel, faites }: { jourActuel: Jour; faites: { jour: Jour; id: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '6px' }}>
      {JOURS.map((j) => {
        const prevues = PLAN[j] ?? []
        const actuel = j === jourActuel
        return (
          <div key={j} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                textAlign: 'center',
                color: actuel ? 'var(--encre)' : 'var(--sourdine)',
                fontWeight: actuel ? 600 : 400,
              }}
            >
              {INITIALE_JOUR[j]}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {prevues.length === 0 && <div style={{ height: '10px', background: 'rgba(20,24,26,0.08)', borderRadius: '1px' }} />}
              {prevues.flatMap((id) => {
                const t = seance(id)
                if (!t) return []
                const programmes = Object.keys(seriesParProgramme(t, 'salle'))
                const fait = faites.some((f) => f.jour === j && f.id === id)
                return programmes.map((p) => (
                  <div
                    key={`${id}-${p}`}
                    style={{
                      height: '10px',
                      borderRadius: '1px',
                      background: fait ? COULEUR_PROGRAMME[p] : 'transparent',
                      border: fait ? 'none' : `1.5px solid ${COULEUR_PROGRAMME[p]}`,
                    }}
                  />
                ))
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function LienFiche({ id, label }: { id: string; label: string }) {
  return (
    <button
      onClick={() => aller(`/exercice/${id}`)}
      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, minHeight: 'var(--cible)' }}
    >
      <span>{label}</span>
      <Chevron taille={14} />
    </button>
  )
}
