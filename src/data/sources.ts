import type { Source } from './types'

/**
 * Every reference cited by an exercise sheet or by the Science tab.
 * All were opened or seen in search results during the research pass; none invented.
 */
export const SOURCES: Source[] = [
  { id: 'vispute2011', texte: "Vispute et al. 2011. L'entrainement abdominal ne réduit pas la graisse abdominale.", url: 'https://journals.lww.com/nsca-jscr/Fulltext/2011/09000/The_Effect_of_Abdominal_Exercise_on_Abdominal_Fat.27.aspx' },
  { id: 'ramirez2013', texte: 'Ramirez-Campillo et al. 2013. La perte de gras ne se fait pas dans le segment entraîné.', url: 'https://journals.lww.com/nsca-jscr/Fulltext/2013/08000/Regional_Fat_Changes_Induced_by_Localized_Muscle.23.aspx' },
  { id: 'ramirez2022', texte: 'Ramirez-Campillo et al. 2022. Méta-analyse, 13 études : effet nul de la réduction localisée.', url: 'https://hummov.awf.wroc.pl/A-proposed-model-to-test-the-hypothesis-of-exercise-induced-localized-fat-reduction,143162,0,2.html' },
  { id: 'issn-diete', texte: 'Aragon et al. 2017. Prise de position ISSN sur les régimes et la composition corporelle.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5470183/' },
  { id: 'helms2014', texte: 'Helms, Aragon, Fitschen 2014. Recommandations pour la préparation naturelle.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4033492/' },
  { id: 'issn-proteines', texte: 'Jager et al. 2017. Prise de position ISSN sur les protéines.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5477153/' },
  { id: 'morton2018', texte: 'Morton et al. 2018. Méta-analyse : le plateau se situe vers 1,6 g/kg/jour.', url: 'https://pubmed.ncbi.nlm.nih.gov/28698222/' },
  { id: 'schoenfeld2017vol', texte: 'Schoenfeld, Ogborn, Krieger 2017. Relation dose-réponse entre volume hebdomadaire et hypertrophie.', url: 'https://pubmed.ncbi.nlm.nih.gov/27433992/' },
  { id: 'schoenfeld2016freq', texte: 'Schoenfeld, Ogborn, Krieger 2016. Deux séances par semaine valent mieux qu\'une.', url: 'https://link.springer.com/article/10.1007/s40279-016-0543-8' },
  { id: 'schoenfeld2019freq', texte: 'Schoenfeld, Grgic, Krieger 2019. A volume egal, la fréquence ne change rien.', url: 'https://pubmed.ncbi.nlm.nih.gov/30558493/' },
  { id: 'bazvalle2022', texte: 'Baz-Valle et al. 2022. 12 à 20 séries par muscle et par semaine chez l\'homme entraine.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8884877/' },
  { id: 'acsm2026', texte: 'Currier et al. 2026. Prise de position ACSM : environ 10 séries par muscle, deux séances minimum.', url: 'https://acsm.org/resistance-training-guidelines-update-2026/' },
  { id: 'schoenfeld2017charge', texte: 'Schoenfeld, Grgic, Ogborn, Krieger 2017. Charges légères et lourdes : hypertrophie comparable près de l\'echec.', url: 'https://pubmed.ncbi.nlm.nih.gov/28834797/' },
  { id: 'robinson2024', texte: 'Robinson et al. 2024. Plus la série finit près de l\'echec, plus l\'hypertrophie augmente.', url: 'https://pubmed.ncbi.nlm.nih.gov/38970765/' },
  { id: 'singer2024', texte: 'Singer et al. 2024. Au-delà de 90 s de repos, le bénéfice devient négligeable.', url: 'https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2024.1429789/full' },
  { id: 'rodriguez2020', texte: "Rodriguez-Ridao et al. 2020. L'activation du haut du pectoral culmine a 30 degrés.", url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7579505/' },
  { id: 'chaves2020', texte: "Chaves et al. 2020. L'incliné épaissit davantage le haut du pectoral que le banc plat.", url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7449336' },
  { id: 'ace2012pecs', texte: 'ACE 2012, Schanke et Porcari. Classement EMG des exercices de pectoraux.', url: 'https://www.acefitness.org/certifiednewsarticle/2884/ace-sponsored-research-top-3-most-effective-chest-exercises/' },
  { id: 'ebben2011', texte: 'Ebben et al. 2011. Charge en pourcentage du poids de corps selon la variante de pompe.', url: 'https://journals.lww.com/nsca-jscr/fulltext/2011/10000/kinetic_analysis_of_several_variations_of_push_ups.31.aspx' },
  { id: 'kotarsky2018', texte: 'Kotarsky et al. 2018. Les pompes progressives egalent le développé couché.', url: 'https://pubmed.ncbi.nlm.nih.gov/29466268/' },
  { id: 'kikuchi2017', texte: 'Kikuchi et Nakazato 2017. Pompes à faible charge jusqu\'a l\'echec : gains comparables.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5812864/' },
  { id: 'noteboom2024', texte: 'Noteboom et al. 2024. Prise inférieure à 1,5 largeur d\'epaules et omoplates serrees : contraintes minimales.', url: 'https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2024.1393235/full' },
  { id: 'ace2001abdos', texte: 'ACE et San Diego State 2001, Francis. Classement EMG des exercices abdominaux.', url: 'https://www.acefitness.org/about-ace/press-room/press-releases/246/american-council-on-exercise-ace-sponsored-study' },
  { id: 'ace2014abdos', texte: 'ACE et UW-La Crosse 2014. Aucun appareil abdominal ne bat le crunch.', url: 'https://www.acefitness.org/about-ace/press-room/press-releases/4828/new-study-proves-traditional-crunch-still-more-effective-than-popular-abdominal-equipment-exercise-trends/' },
  { id: 'escamilla2006', texte: 'Escamilla et al. 2006. EMG des exercices abdominaux traditionnels et non traditionnels.', url: 'https://pubmed.ncbi.nlm.nih.gov/16649890/' },
  { id: 'escamilla2010', texte: 'Escamilla et al. 2010. Roulades et pikes : forte activation, faible charge lombaire.', url: 'https://www.jospt.org/doi/abs/10.2519/jospt.2010.3073' },
  { id: 'gomirato2023', texte: 'Gomirato et Grenier 2023. Le recrutement se fait près de la charge : crunch en haut, relevé en bas.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10824285/' },
  { id: 'sbs-core', texte: 'Stronger by Science, Cameron Gill. Les squats et soulevés de terre ne suffisent pas aux abdominaux.', url: 'https://www.strongerbyscience.com/core-training/' },
  { id: 'contreras2011', texte: 'Contreras et Schoenfeld 2011. Le crunch n\'abîme pas un rachis sain à ces charges.', url: 'https://journals.lww.com/nsca-scj/fulltext/2011/08000/to_crunch_or_not_to_crunch__an_evidence_based.2.aspx' },
  { id: 'furness2015', texte: 'Furness et al. 2015. Blessures aiguës chez les surfeurs.', url: 'https://pubmed.ncbi.nlm.nih.gov/25646362/' },
  { id: 'hanchard2021', texte: 'Hanchard et al. 2021. Blessures chroniques du surf : dos, épaule, genou.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7911480/' },
  { id: 'hohn2018', texte: 'Hohn et al. 2018. Chez les professionnels, le genou est la première articulation blessée.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12435862/' },
  { id: 'surf-genou-hanche', texte: 'Evaluation physique du surfeur, quadrant inférieur. Genou 10 à 28 %, conflit de hanche deux tiers des blessures de hanche.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12435862/' },
  { id: 'langenberg2021', texte: "Langenberg et al. 2021. L'épaule du surfeur : rotateurs externes faibles, mobilité thoracique à travailler.", url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7788157/' },
  { id: 'furness2018', texte: 'Furness et al. 2018. Deficit de rotation externe chez les surfeurs de compétition.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6027550/' },
  { id: 'halabchi2025', texte: 'Halabchi et al. 2025. Renforcer la hanche en plus du genou bat le genou seul.', url: 'https://onlinelibrary.wiley.com/doi/10.1002/msc.70059' },
  { id: 'jospt2018', texte: 'JOSPT 2018. 14 essais : hanche plus genou supérieur au genou seul.', url: 'https://www.jospt.org/doi/10.2519/jospt.2018.7365' },
  { id: 'cheville-genou', texte: 'Dorsiflexion de cheville et biomecanique a la réception : 10 % de dorsiflexion en moins, 3,2 degrés d\'abduction de genou en plus.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9112706/' },
  { id: 'fifa11plus', texte: 'FIFA 11+. Vingt minutes, au moins deux fois par semaine, 30 à 46 % de blessures en moins.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12856364/' },
  { id: 'pep', texte: 'Programme PEP. Réduction proche de 88 % des ruptures du LCA sur une saison.', url: 'https://pubmed.ncbi.nlm.nih.gov/28222578/' },
  { id: 'nordic', texte: 'Nordic : environ moitié moins de blessures aux ischio-jambiers, avec une réserve méthodologique en 2021.', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6942028/' },
  { id: 'lauersen2014', texte: "Lauersen et al. 2014. L'etirement ne prévient pas les blessures, la force les divise par trois.", url: 'https://www.ncbi.nlm.nih.gov/books/NBK169555/' },
  { id: 'behm2016', texte: 'Behm et al. 2016. Plus de 60 s d\'étirement statique avant un effort explosif dégrade la performance.', url: 'https://cdnsciencepub.com/doi/10.1139/apnm-2015-0235' },
  { id: 'delphi2025', texte: 'Warneke et al. 2025. Consensus Delphi sur les étirements.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12305623/' },
  { id: 'thomas2018', texte: 'Thomas et al. 2018. Le volume hebdomadaire, au moins 5 min par muscle, prédit les gains d\'amplitude.', url: 'https://pubmed.ncbi.nlm.nih.gov/29506306/' },
  { id: 'cochrane2011', texte: 'Herbert, de Noronha, Kamper 2011. Les étirements ne réduisent pas les courbatures.', url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD004577.pub3/abstract' },
  { id: 'femoro-patellaire', texte: 'Charge fémoro-patellaire sur 35 exercices. Base de la limite a 90 degrés de flexion.', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10315869/' },
  { id: 'fai-squat', texte: 'Biomécanique du squat après traitement d\'un conflit femoro-acetabulaire. Base de l\'evitement de la flexion profonde.', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11210460/' },
  { id: 'mcgill', texte: 'McGill. Flexion lombaire : mythes, vérités et précautions.', url: 'https://www.backfitpro.com/spine-flexion-exercise-myths-truths-issues-affecting-health-performance/' },
  { id: 'tsaklis2015', texte: 'Tsaklis et al. 2015. Le curl glissé dépasse 90 % de la contraction maximale sur les deux chefs des ischio-jambiers.', url: 'https://www.tandfonline.com/doi/full/10.2147/OAJSM.S79189' },
  { id: 'impellizzeri2021', texte: 'Impellizzeri et al. 2021. Réanalyse du Nordic : 5 essais sur 15 le randomisaient, effet non concluant.', url: 'https://pubmed.ncbi.nlm.nih.gov/34520846/' },
  { id: 'observance2026', texte: "Méta-analyse 2026, 15 essais, 7 465 joueurs. Aucun programme ne se distingue ; c'est l'observance qui porte l'effet.", url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13059038/' },
  { id: 'schoenfeld2014gainage', texte: 'Schoenfeld et al. 2014. Levier long et bassin rétroversé : le grand droit passe de 27 à 110 % de la contraction maximale.', url: 'https://www.tandfonline.com/doi/abs/10.1080/14763141.2014.942355' },
  { id: 'suprak2011', texte: 'Suprak, Dawes, Stephenson 2011. La charge de la pompe est la plus élevée en bas du mouvement.', url: 'https://pubmed.ncbi.nlm.nih.gov/20179649/' },
  { id: 'sl-rdl2024', texte: 'Cohorte en athlétisme. Soulevé de terre roumain une jambe au poids du corps : lésions légères à modérées divisées par trois.', url: 'https://ijspt.scholasticahq.com/article/136803-the-effect-of-single-leg-romanian-deadlift-on-the-risk-of-hamstring-strain-injuries-in-track-and-field-athletes-a-cohort-study' },
  { id: 'basicfit-appareils', texte: 'Basic-Fit. ABC des appareils de fitness, noms français officiels des machines.', url: 'https://www.basic-fit.com/fr-fr/blog/abc-des-appareils-de-fitness' },
]

const INDEX = new Map(SOURCES.map((s) => [s.id, s]))

export function source(id: string): Source | undefined {
  return INDEX.get(id)
}

export function sourcesFor(ids: string[]): Source[] {
  return ids.map((id) => INDEX.get(id)).filter((s): s is Source => Boolean(s))
}
