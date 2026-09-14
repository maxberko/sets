import { BoutonRetour, Entete } from '../composants/communs'
import { Fleche } from '../composants/icones'
import { seance } from '../data'
import { aller } from '../lib/routeur'

export function ChoixLieu({ templateId }: { templateId: string }) {
  const t = seance(templateId)
  if (!t) return <Introuvable />

  return (
    <div class="ecran">
      <Entete gauche={<BoutonRetour label={t.nom} />} />
      <div class="contenu">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{ fontSize: '40px', lineHeight: 0.95 }}>Tu t'entraînes où aujourd'hui ?</h1>
          <p class="discret" style={{ fontSize: '15px' }}>Même séance, même volume. Seuls les exercices changent.</p>
        </div>

        {/* Deux cartes identiques : le lieu ne hiérarchise rien, les deux séances
            comptent pareil. La couleur du programme a quitté cet écran — le rouge
            dit « pectoraux » partout ailleurs, il ne peut pas dire « salle » ici.
            Les listes d'exercices sont parties avec : on les lit une fois, et
            elles pesaient vingt mots chacune devant un choix binaire. */}
        <Lieu
          nom="En salle"
          detail={`${t.minutes.salle} min`}
          surClic={() => aller(`/seance/${t.id}/salle`)}
        />
        <Lieu
          nom="À la maison"
          detail={`${t.minutes.tapis} min`}
          surClic={() => aller(`/seance/${t.id}/tapis`)}
        />

        <div style={{ height: '12px' }} />
      </div>
    </div>
  )
}

function Lieu({ nom, detail, surClic }: { nom: string; detail: string; surClic: () => void }) {
  return (
    <button
      onClick={surClic}
      class="bloc-couleur"
      style={{ background: 'transparent', border: '1.5px solid var(--encre)', gap: '6px', padding: '18px' }}
    >
      {/* Le nom, la flèche, et le détail dessous : posé à côté du nom, « Rien
          d'autre · 35 min » repoussait « À la maison » sur deux lignes et les deux
          cartes n'avaient plus la même hauteur. La flèche remplace la ligne
          « Commencer en salle », qui répétait le titre. */}
      <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '12px' }}>
        <span style={{ fontFamily: 'var(--titre)', fontWeight: 800, fontSize: '30px', lineHeight: 1 }}>{nom}</span>
        <Fleche />
      </span>
      <span class="etiquette discret">{detail}</span>
    </button>
  )
}

export function Introuvable() {
  return (
    <div class="ecran">
      <Entete gauche={<BoutonRetour />} />
      <div class="contenu">
        <h1>Page introuvable</h1>
        <button class="secondaire" onClick={() => aller('/')}>
          Revenir à aujourd'hui
        </button>
      </div>
    </div>
  )
}
