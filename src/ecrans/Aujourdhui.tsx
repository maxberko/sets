import { BarreOnglets, Titre } from '../composants/communs'
import { Chevron, Fleche, Reglages as IconeReglages } from '../composants/icones'
import { COULEUR_PROGRAMME, INITIALE_JOUR, JOURS, NOM_JOUR, NOM_PROGRAMME, SEMAINES_BLOC, blocsDeSeance, planDe, seance, seriesParProgramme } from '../data'
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

  const plan = planDe(d.reglages.formule)
  const prevues = plan[jour] ?? []
  const restantes = prevues.filter((id) => !faitesAujourdhui.some((s) => s.templateId === id))
  const mobiliteFaites = faitesCetteSemaine.filter((s) => s.templateId === 'mobilite').length
  const mobilitePrevues = JOURS.reduce((n, j) => n + (plan[j] ?? []).filter((x) => x === 'mobilite').length, 0)

  return (
    <div class="ecran" style={{ paddingTop: 'calc(var(--barre-haut) + 20px)' }}>
      <div class="contenu">
        <Titre
          titre={NOM_JOUR[jour]}
          apres={`${formatDateCourte(maintenant)} · semaine ${semaine} sur ${SEMAINES_BLOC}`}
          action={
            <button
              onClick={() => aller('/reglages')}
              aria-label="Réglages"
              style={{ minHeight: 'var(--cible)', minWidth: 'var(--cible)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
            >
              <IconeReglages />
            </button>
          }
        />

        <BandeSemaine plan={plan} jourActuel={jour} faites={faitesCetteSemaine.map((s) => ({ jour: jourDe(new Date(s.debut)), id: s.templateId }))} />

        {restantes.length === 0 && prevues.length > 0 && (
          <p style={{ padding: '18px 0', borderTop: '1.5px solid var(--encre)' }}>
            Tout est fait pour aujourd'hui. Prochaine séance {prochainJourAvecSeance(plan, jour)}.
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

        {d.enCours && (
          <button
            onClick={() => aller(`/seance/${d.enCours!.templateId}/${d.enCours!.venue}`)}
            class="bloc-couleur"
            style={{ background: 'transparent', border: `1.5px solid ${COULEUR_PROGRAMME[seance(d.enCours.templateId)?.programme ?? 'pecs']}`, padding: '16px 18px', gap: '8px' }}
          >
            <span class="etiquette discret">Séance interrompue</span>
            <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', width: '100%' }}>
              <span style={{ fontFamily: 'var(--titre)', fontWeight: 800, fontSize: '22px', lineHeight: 1 }}>
                {seance(d.enCours.templateId)?.nom}
              </span>
              <span style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
                {d.enCours.series.length} série{d.enCours.series.length > 1 ? 's' : ''} gardée{d.enCours.series.length > 1 ? 's' : ''}
              </span>
            </span>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Reprendre où tu en étais</span>
          </button>
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

function prochainJourAvecSeance(plan: Record<Jour, string[]>, jour: Jour): string {
  const i = JOURS.indexOf(jour)
  for (let n = 1; n <= 7; n++) {
    const j = JOURS[(i + n) % 7]!
    if ((plan[j] ?? []).length > 0) return NOM_JOUR[j].toLowerCase()
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

  // La carte se partage en autant de champs que la séance a de programmes : les
  // deux chapitres sont annoncés avant de commencer, et la couleur du lecteur ne
  // surprend plus puisqu'elle a déjà été vue ici. Les pastilles secondaires
  // n'ont plus lieu d'être, chaque bloc porte son propre champ.
  const blocs = blocsDeSeance(t, 'salle')

  return (
    <button
      onClick={ouvrir}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        textAlign: 'left',
        color: 'var(--sur-couleur)',
        borderRadius: 'var(--r)',
        overflow: 'hidden',
        // De la hauteur à distribuer, sinon les champs collent à leur contenu et
        // le second se réduit à deux lignes.
        minHeight: 'clamp(300px, 44vh, 440px)',
      }}
    >
      {blocs.map((b, i) => (
        <span
          key={b.programme}
          style={{
            background: COULEUR_PROGRAMME[b.programme],
            // Part égale du mou, pas proportionnelle aux séries : le premier champ
            // porte le titre, donc son contenu l'emporte de toute façon. Mesuré,
            // ça donnait 7 séries dans 214 px contre 8 dans 143 — l'inverse de ce
            // qu'une hauteur proportionnelle prétendrait dire. Le compte de séries
            // est écrit, c'est le canal fiable.
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '18px 18px 0',
          }}
        >
          {i === 0 && (
            <>
              <span class="etiquette">{t.sousTitre}</span>
              <span style={{ fontFamily: 'var(--titre)', fontWeight: 800, fontSize: '36px', letterSpacing: '-0.025em', lineHeight: 0.95, textWrap: 'balance' }}>
                {t.nom}
              </span>
            </>
          )}
          <span style={{ fontSize: '15px', lineHeight: 1.4 }}>
            <span style={{ fontWeight: 600 }}>{NOM_PROGRAMME[b.programme]}</span> · {b.exercices} exercices · {b.series} séries
          </span>
          {i === blocs.length - 1 && (
            <span class="bloc-pied" style={{ marginTop: 'auto' }}>
              <span>Commencer · {t.minutes.salle} min</span>
              <Fleche />
            </span>
          )}
        </span>
      ))}
    </button>
  )
}

function BandeSemaine({ plan, jourActuel, faites }: { plan: Record<Jour, string[]>; jourActuel: Jour; faites: { jour: Jour; id: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '6px' }}>
      {JOURS.map((j) => {
        const prevues = plan[j] ?? []
        const actuel = j === jourActuel
        return (
          <div key={j} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Le jour courant est encré en plein : à la taille d'une initiale, un
                changement de graisse seul ne se voit pas d'un coup d'œil. */}
            <div
              aria-current={actuel ? 'date' : undefined}
              style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                textAlign: 'center',
                lineHeight: 1,
                padding: '4px 0 3px',
                borderRadius: 'var(--r)',
                background: actuel ? 'var(--encre)' : 'transparent',
                color: actuel ? 'var(--papier)' : 'var(--sourdine)',
                fontWeight: actuel ? 700 : 400,
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
