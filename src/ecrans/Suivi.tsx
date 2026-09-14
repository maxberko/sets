import { CIBLES_HEBDO, COULEUR_PROGRAMME, NOM_PROGRAMME, planDe } from '../data'
import { JOURS } from '../data/seances'
import { useDonnees } from '../lib/etat'
import { lundiDe, volumeParSemaine } from '../lib/semaine'

/**
 * Le suivi, tel qu'il s'affiche sous la séance du jour sur l'écran d'accueil.
 * Il avait son propre onglet ; on ne l'ouvrait qu'en y pensant.
 *
 * Il ne parle que de la semaine en cours, et rien que d'elle : trois lignes de
 * même forme, ce qui est fait sur ce qu'il y a à faire d'ici dimanche. Le titre
 * annonçait « Ta semaine » au-dessus d'un graphique de huit semaines, alors que
 * la ligne Mobilité juste en dessous, elle, ne comptait que la semaine : deux
 * échelles de temps sous un seul titre.
 *
 * L'historique du bloc n'a pas trouvé sa place ici : on ouvre l'accueil tous les
 * jours pour savoir ce qu'il reste à faire, pas pour relire huit semaines.
 */
export function SuiviAccueil() {
  const d = useDonnees()
  const maintenant = new Date()
  const volumes = volumeParSemaine(d.seances)
  const cle = lundiDe(maintenant)
  const cette = volumes.find((v) => v.semaine === cle)?.parProgramme ?? {}

  const plan = planDe(d.reglages.formule)
  const mobilitePrevues = JOURS.reduce((n, j) => n + (plan[j] ?? []).filter((x) => x === 'mobilite').length, 0)
  const mobiliteFaites = d.seances.filter((s) => s.fin && s.templateId === 'mobilite' && lundiDe(new Date(s.debut)) === cle).length

  const rubrique = { borderTop: '1.5px solid var(--encre)', paddingTop: '18px', display: 'flex', flexDirection: 'column' as const, gap: '12px' }

  return (
    <>
      <section style={rubrique}>
        <h3>Ta semaine</h3>
        {(['pecs', 'abdos'] as const).map((p) => (
          <Jauge key={p} programme={p} actuel={cette[p] ?? 0} />
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', fontSize: '14px' }}>
            <span class="pastille" style={{ background: COULEUR_PROGRAMME.mobilite }} />
            <strong>Mobilité</strong>
            <span class="discret num">
              {mobiliteFaites} séance{mobiliteFaites > 1 ? 's' : ''} sur {mobilitePrevues}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mobilitePrevues}, minmax(0, 1fr))`, gap: '4px' }}>
            {Array.from({ length: mobilitePrevues }, (_, i) => (
              <div
                key={i}
                style={{
                  height: '12px',
                  borderRadius: '1px',
                  background: i < mobiliteFaites
                    ? COULEUR_PROGRAMME.mobilite
                    : `color-mix(in srgb, ${COULEUR_PROGRAMME.mobilite} 20%, var(--filet))`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

    </>
  )
}

export function Champ({ label, valeur, onChange, type = 'decimal' }: { label: string; valeur: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
      <span class="discret">{label}</span>
      <input
        value={valeur}
        inputMode={type as never}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        style={{
          font: 'inherit',
          fontSize: '17px',
          padding: '12px 14px',
          border: '1.5px solid var(--encre)',
          borderRadius: 'var(--r)',
          background: 'transparent',
          color: 'var(--encre)',
          minHeight: 'var(--cible)',
          width: '100%',
        }}
      />
    </label>
  )
}

/**
 * Une semaine, une ligne : ce qui est fait, et la fourchette à atteindre d'ici
 * dimanche. Remplace un graphique de huit semaines qui répondait à une autre
 * question — « comment s'est passé le bloc » — sous un titre qui promettait la
 * semaine, et qui restait vide les sept premiers jours.
 */
function Jauge({ programme, actuel }: { programme: 'pecs' | 'abdos'; actuel: number }) {
  const cible = CIBLES_HEBDO[programme]!
  // L'échelle s'arrête à la cible haute, sauf si la semaine la dépasse : le
  // dépassement se voit alors, sans écraser la lecture des semaines normales.
  const echelle = Math.max(cible[1], actuel)
  const part = (v: number) => `${(Math.min(v, echelle) / echelle) * 100}%`
  const atteint = actuel >= cible[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', fontSize: '14px' }}>
        <span class="pastille" style={{ background: COULEUR_PROGRAMME[programme] }} />
        <strong>{NOM_PROGRAMME[programme]}</strong>
        <span class="discret num">
          {actuel} série{actuel > 1 ? 's' : ''} sur {cible[0]}–{cible[1]}
        </span>
      </div>
      {/* Le chemin restant garde la couleur du programme, mais éteinte dans le
          filet : la ligne reste identifiable d'un coup d'œil sans que le rempli
          s'y confonde. À pleine teinte, la barre paraissait finie alors qu'il
          restait huit séries. Les repères d'encre marquent la fourchette ; quand
          la semaine ne la dépasse pas, le bout de la barre est la cible haute. */}
      <div style={{ position: 'relative', height: '12px', background: 'var(--filet)', borderRadius: '1px' }}>
        {/* La teinte éteinte est posée par-dessus le filet : un navigateur qui
            ignorerait color-mix garderait la piste grise plutôt que rien. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '1px',
            background: `color-mix(in srgb, ${COULEUR_PROGRAMME[programme]} 20%, var(--filet))`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: part(actuel),
            background: COULEUR_PROGRAMME[programme],
            borderRadius: '1px',
            opacity: atteint ? 1 : 0.8,
          }}
        />
        <div style={{ position: 'absolute', left: part(cible[0]), top: '-3px', bottom: '-3px', width: '1.5px', background: 'var(--encre)' }} />
        {actuel > cible[1] && (
          <div style={{ position: 'absolute', left: part(cible[1]), top: '-3px', bottom: '-3px', width: '1.5px', background: 'var(--encre)' }} />
        )}
      </div>
    </div>
  )
}

