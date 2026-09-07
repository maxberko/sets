import type { Source } from './types'

/**
 * Every reference cited by an exercise sheet or by the Science tab.
 * All were opened or seen in search results during the research pass; none invented.
 */
export const SOURCES: Source[] = [
  { id: 'vispute2011', texte: "Vispute et al. 2011. L'entrainement abdominal ne reduit pas la graisse abdominale.", url: 'https://journals.lww.com/nsca-jscr/Fulltext/2011/09000/The_Effect_of_Abdominal_Exercise_on_Abdominal_Fat.27.aspx' },
  { id: 'ramirez2013', texte: 'Ramirez-Campillo et al. 2013. La perte de gras ne se fait pas dans le segment entraine.', url: 'https://journals.lww.com/nsca-jscr/Fulltext/2013/08000/Regional_Fat_Changes_Induced_by_Localized_Muscle.23.aspx' },
  { id: 'ramirez2022', texte: 'Ramirez-Campillo et al. 2022. Meta-analyse, 13 etudes : effet nul de la reduction localisee.', url: 'https://hummov.awf.wroc.pl/A-proposed-model-to-test-the-hypothesis-of-exercise-induced-localized-fat-reduction,143162,0,2.html' },
  { id: 'issn-diete', texte: 'Aragon et al. 2017. Prise de position ISSN sur les regimes et la composition corporelle.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5470183/' },
  { id: 'helms2014', texte: 'Helms, Aragon, Fitschen 2014. Recommandations pour la preparation naturelle.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4033492/' },
  { id: 'issn-proteines', texte: 'Jager et al. 2017. Prise de position ISSN sur les proteines.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5477153/' },
  { id: 'morton2018', texte: 'Morton et al. 2018. Meta-analyse : le plateau se situe vers 1,6 g/kg/jour.', url: 'https://pubmed.ncbi.nlm.nih.gov/28698222/' },
  { id: 'schoenfeld2017vol', texte: 'Schoenfeld, Ogborn, Krieger 2017. Relation dose-reponse entre volume hebdomadaire et hypertrophie.', url: 'https://pubmed.ncbi.nlm.nih.gov/27433992/' },
  { id: 'schoenfeld2016freq', texte: 'Schoenfeld, Ogborn, Krieger 2016. Deux seances par semaine valent mieux qu\'une.', url: 'https://link.springer.com/article/10.1007/s40279-016-0543-8' },
  { id: 'schoenfeld2019freq', texte: 'Schoenfeld, Grgic, Krieger 2019. A volume egal, la frequence ne change rien.', url: 'https://pubmed.ncbi.nlm.nih.gov/30558493/' },
  { id: 'bazvalle2022', texte: 'Baz-Valle et al. 2022. 12 a 20 series par muscle et par semaine chez l\'homme entraine.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8884877/' },
  { id: 'acsm2026', texte: 'Currier et al. 2026. Prise de position ACSM : environ 10 series par muscle, deux seances minimum.', url: 'https://acsm.org/resistance-training-guidelines-update-2026/' },
  { id: 'schoenfeld2017charge', texte: 'Schoenfeld, Grgic, Ogborn, Krieger 2017. Charges legeres et lourdes : hypertrophie comparable pres de l\'echec.', url: 'https://pubmed.ncbi.nlm.nih.gov/28834797/' },
  { id: 'robinson2024', texte: 'Robinson et al. 2024. Plus la serie finit pres de l\'echec, plus l\'hypertrophie augmente.', url: 'https://pubmed.ncbi.nlm.nih.gov/38970765/' },
  { id: 'singer2024', texte: 'Singer et al. 2024. Au-dela de 90 s de repos, le benefice devient negligeable.', url: 'https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2024.1429789/full' },
  { id: 'rodriguez2020', texte: "Rodriguez-Ridao et al. 2020. L'activation du haut du pectoral culmine a 30 degres.", url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7579505/' },
  { id: 'chaves2020', texte: "Chaves et al. 2020. L'incline epaissit davantage le haut du pectoral que le banc plat.", url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7449336' },
  { id: 'ace2012pecs', texte: 'ACE 2012, Schanke et Porcari. Classement EMG des exercices de pectoraux.', url: 'https://www.acefitness.org/certifiednewsarticle/2884/ace-sponsored-research-top-3-most-effective-chest-exercises/' },
  { id: 'ebben2011', texte: 'Ebben et al. 2011. Charge en pourcentage du poids de corps selon la variante de pompe.', url: 'https://journals.lww.com/nsca-jscr/fulltext/2011/10000/kinetic_analysis_of_several_variations_of_push_ups.31.aspx' },
  { id: 'kotarsky2018', texte: 'Kotarsky et al. 2018. Les pompes progressives egalent le developpe couche.', url: 'https://pubmed.ncbi.nlm.nih.gov/29466268/' },
  { id: 'kikuchi2017', texte: 'Kikuchi et Nakazato 2017. Pompes a faible charge jusqu\'a l\'echec : gains comparables.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5812864/' },
  { id: 'noteboom2024', texte: 'Noteboom et al. 2024. Prise inferieure a 1,5 largeur d\'epaules et omoplates serrees : contraintes minimales.', url: 'https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2024.1393235/full' },
  { id: 'ace2001abdos', texte: 'ACE et San Diego State 2001, Francis. Classement EMG des exercices abdominaux.', url: 'https://www.acefitness.org/about-ace/press-room/press-releases/246/american-council-on-exercise-ace-sponsored-study' },
  { id: 'ace2014abdos', texte: 'ACE et UW-La Crosse 2014. Aucun appareil abdominal ne bat le crunch.', url: 'https://www.acefitness.org/about-ace/press-room/press-releases/4828/new-study-proves-traditional-crunch-still-more-effective-than-popular-abdominal-equipment-exercise-trends/' },
  { id: 'escamilla2006', texte: 'Escamilla et al. 2006. EMG des exercices abdominaux traditionnels et non traditionnels.', url: 'https://pubmed.ncbi.nlm.nih.gov/16649890/' },
  { id: 'escamilla2010', texte: 'Escamilla et al. 2010. Roulades et pikes : forte activation, faible charge lombaire.', url: 'https://www.jospt.org/doi/abs/10.2519/jospt.2010.3073' },
  { id: 'gomirato2023', texte: 'Gomirato et Grenier 2023. Le recrutement se fait pres de la charge : crunch en haut, releve en bas.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10824285/' },
  { id: 'sbs-core', texte: 'Stronger by Science, Cameron Gill. Les squats et souleves de terre ne suffisent pas aux abdominaux.', url: 'https://www.strongerbyscience.com/core-training/' },
  { id: 'contreras2011', texte: 'Contreras et Schoenfeld 2011. Le crunch n\'abime pas un rachis sain a ces charges.', url: 'https://journals.lww.com/nsca-scj/fulltext/2011/08000/to_crunch_or_not_to_crunch__an_evidence_based.2.aspx' },
  { id: 'furness2015', texte: 'Furness et al. 2015. Blessures aigues chez les surfeurs.', url: 'https://pubmed.ncbi.nlm.nih.gov/25646362/' },
  { id: 'hanchard2021', texte: 'Hanchard et al. 2021. Blessures chroniques du surf : dos, epaule, genou.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7911480/' },
  { id: 'hohn2018', texte: 'Hohn et al. 2018. Chez les professionnels, le genou est la premiere articulation blessee.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12435862/' },
  { id: 'surf-genou-hanche', texte: 'Evaluation physique du surfeur, quadrant inferieur. Genou 10 a 28 %, conflit de hanche deux tiers des blessures de hanche.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12435862/' },
  { id: 'langenberg2021', texte: "Langenberg et al. 2021. L'epaule du surfeur : rotateurs externes faibles, mobilite thoracique a travailler.", url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7788157/' },
  { id: 'furness2018', texte: 'Furness et al. 2018. Deficit de rotation externe chez les surfeurs de competition.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6027550/' },
  { id: 'halabchi2025', texte: 'Halabchi et al. 2025. Renforcer la hanche en plus du genou bat le genou seul.', url: 'https://onlinelibrary.wiley.com/doi/10.1002/msc.70059' },
  { id: 'jospt2018', texte: 'JOSPT 2018. 14 essais : hanche plus genou superieur au genou seul.', url: 'https://www.jospt.org/doi/10.2519/jospt.2018.7365' },
  { id: 'cheville-genou', texte: 'Dorsiflexion de cheville et biomecanique a la reception : 10 % de dorsiflexion en moins, 3,2 degres d\'abduction de genou en plus.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9112706/' },
  { id: 'fifa11plus', texte: 'FIFA 11+. Vingt minutes, au moins deux fois par semaine, 30 a 46 % de blessures en moins.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12856364/' },
  { id: 'pep', texte: 'Programme PEP. Reduction proche de 88 % des ruptures du LCA sur une saison.', url: 'https://pubmed.ncbi.nlm.nih.gov/28222578/' },
  { id: 'nordic', texte: 'Nordic : environ moitie moins de blessures aux ischio-jambiers, avec une reserve methodologique en 2021.', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6942028/' },
  { id: 'lauersen2014', texte: "Lauersen et al. 2014. L'etirement ne previent pas les blessures, la force les divise par trois.", url: 'https://www.ncbi.nlm.nih.gov/books/NBK169555/' },
  { id: 'behm2016', texte: 'Behm et al. 2016. Plus de 60 s d\'etirement statique avant un effort explosif degrade la performance.', url: 'https://cdnsciencepub.com/doi/10.1139/apnm-2015-0235' },
  { id: 'delphi2025', texte: 'Warneke et al. 2025. Consensus Delphi sur les etirements.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12305623/' },
  { id: 'thomas2018', texte: 'Thomas et al. 2018. Le volume hebdomadaire, au moins 5 min par muscle, predit les gains d\'amplitude.', url: 'https://pubmed.ncbi.nlm.nih.gov/29506306/' },
  { id: 'cochrane2011', texte: 'Herbert, de Noronha, Kamper 2011. Les etirements ne reduisent pas les courbatures.', url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD004577.pub3/abstract' },
  { id: 'femoro-patellaire', texte: 'Charge femoro-patellaire sur 35 exercices. Base de la limite a 90 degres de flexion.', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10315869/' },
  { id: 'fai-squat', texte: 'Biomecanique du squat apres traitement d\'un conflit femoro-acetabulaire. Base de l\'evitement de la flexion profonde.', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11210460/' },
  { id: 'mcgill', texte: 'McGill. Flexion lombaire : mythes, verites et precautions.', url: 'https://www.backfitpro.com/spine-flexion-exercise-myths-truths-issues-affecting-health-performance/' },
  { id: 'basicfit-appareils', texte: 'Basic-Fit. ABC des appareils de fitness, noms francais officiels des machines.', url: 'https://www.basic-fit.com/fr-fr/blog/abc-des-appareils-de-fitness' },
]

const INDEX = new Map(SOURCES.map((s) => [s.id, s]))

export function source(id: string): Source | undefined {
  return INDEX.get(id)
}

export function sourcesFor(ids: string[]): Source[] {
  return ids.map((id) => INDEX.get(id)).filter((s): s is Source => Boolean(s))
}
