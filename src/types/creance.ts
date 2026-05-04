// Types pour la créance

export interface CreanceCreateRequest {
  // Identifiants
  debiteur: string;
  groupeCreance: string;
  objetCreance: string;
  objetDetail?: string;

  // Montants de base
  capitalInitial: string | number;
  montantDecaisse?: string | number;
  montantInteretConventionnel?: string | number;
  commissionBanque?: string | number;

  // Numéros de référence
  numeroPrecedent?: string;
  numeroAncien?: string;

  // Montants calculés/saisis
  montantDu?: string | number;
  montantRembourse?: string | number;
  montantInteretRetard?: string | number;
  frais?: string | number;
  encours?: string | number;

  // Dates
  dateDeblocage: string;
  dateEcheance: string;

  // Conditions
  periodicite?: string;
  duree?: string | number;
  tauxInteretConventionnel?: string | number;
  tauxInteretRetard?: string | number;

  // Administratif
  ordonnateur: string;
  statut: string;
  observations?: string;
}

export interface SuivieClientelOvp {
  OVP_CODE?: string | number;
  OVP_DEB_CODE?: string | number;
  OVP_EMP_CODE?: string;
  DOM_CODE?: string;
  CPTOPER_CODE?: string;
  SOU_CODE?: string;
  SOU_LIB?: string;
  PERIOD_CODE?: string;
  PERIOD_LIB?: string;
  ACTE_CODE?: string | number;
  ACTE_LIB?: string;
  TYPOVP_CODE?: string;
  TYPOVP_LIB?: string;
  GARPHYS_CODE?: string | number;
  GARANTIE_TIERS_LIB?: string;
  OVP_DATDEB?: string;
  OVP_DATFIN?: string;
  OVP_DATSIGNE?: string;
  OVP_MONT?: number;
  OVP_MONT_CREAN?: number;
  OVP_NB_VIRM?: number;
  MOTIF_CODE?: string | number;
  MOTIF_LIB?: string;
  MOTIF_DATE?: string;
  MOTIF_USER?: string;
  OVP_MODIF_DATE?: string;
  CPTOPER_BQAG_CODE?: string;
  CPTOPER_LIB?: string;
  CPTOPER_BANQUE_LIB?: string;
  EMP_CODE?: string;
  EMP_NOM?: string;
  EMP_PREN?: string;
  EMPLOYEUR_LIB?: string;
  domiciliation?: SuivieClientelDomiciliation;
  virements?: SuivieClientelVirement[];
  VIREMENTS_TOTAL_MONTANT?: number;
  [key: string]: unknown;
}

export interface SuivieClientelDomiciliation {
  DOM_CODE?: string;
  DOM_DEB_CODE?: string | number;
  DOM_LIB?: string;
  TYPDOM_CODE?: string;
  BQAG_CODE?: string;
  BQAG_LIB?: string;
  BQ_LIB?: string;
  [key: string]: unknown;
}

export interface SuivieClientelVirement {
  VIRM_CODE?: string | number;
  VIRM_DATE?: string;
  VIRM_MONT?: number;
  VIRM_VALIDE?: string;
  [key: string]: unknown;
}

export interface SuivieClientelOption {
  CODE?: string | number;
  LIBELLE?: string;
  [key: string]: unknown;
}

export interface SuivieClientelTierOption extends SuivieClientelOption {
  DOM_CODE?: string;
  DOM_LIB?: string;
  BQ_CODE?: string;
  BQ_LIB?: string;
  DOMICILIATION_LIBELLE?: string;
}

export interface SuivieClientelCreationOptions {
  sourcesOvp?: SuivieClientelOption[];
  periodicites?: SuivieClientelOption[];
  typesOvp?: SuivieClientelOption[];
  actes?: SuivieClientelOption[];
  comptesOperation?: SuivieClientelOption[];
  domiciliations?: SuivieClientelOption[];
  tiers?: SuivieClientelTierOption[];
  [key: string]: unknown;
}

export interface SuivieClientelModificationOptions {
  motifs?: SuivieClientelOption[];
  [key: string]: unknown;
}

export interface SuivieClientelCreanceSoldeRow {
  CREANCE: string;
  DEBITEUR?: string;
  CAPIT_INIT?: number;
  SOLDE_INIT?: number;
  SOLDE_EXIG?: number;
  [key: string]: unknown;
}

export interface SuivieClientelCreanceSoldePage {
  status: "IDLE" | "LOADING" | "READY" | "ERROR";
  offset: number;
  size: number;
  loaded: number;
  hasMore: boolean;
  afterCode?: string;
  nextCursor?: string | null;
  total?: number;
  search?: string;
  startedAt?: string;
  loadedAt?: string;
  errorMessage?: string;
  items: SuivieClientelCreanceSoldeRow[];
}

export interface SuivieClientelCreanceSoldeCount {
  total: number;
  search?: string;
}

export interface SuivieClientelOvpMensuelBankOption extends SuivieClientelOption {
  BANQ_CODE: string;
  BANQ_LIB: string;
  CPT_BQ: string;
  CPT_BQ_VAL: string;
  CPTOPER_CODE: string;
  AGBANQ_CODE: string;
  DEBUG_REQUESTED_CPTOPER_CODE?: string;
}

export interface SuivieClientelOvpMensuelFilters {
  ENTITE_CODE: string;
  ENTITE_LIB?: string;
  BANQ_CODE: string;
  BANQ_LIB?: string;
  CPT_BQ: string;
  CPT_BQ_VAL: string;
  CPTOPER_CODE: string;
  AGBANQ_CODE: string;
  DATE_DEBUT_PERIODE: string;
  DATE_FIN_PERIODE: string;
  DATE_TRAITE: string;
}

export interface SuivieClientelOvpMensuelRow {
  NUM_ORD: number;
  OVP_CODE: string | number;
  CREAN_CODE: string;
  NOM_DEBITEUR: string;
  BANQ: string;
  COMPTE: string | number;
  COMPTE_LONG: string | number;
  MONT: number;
  DATE_CREA: string;
  DATE_SIGNE: string;
  VIRM_CODE: string | number;
  DATE_VIRM: string;
  [key: string]: unknown;
}

export interface SuivieClientelOvpMensuelTotals {
  TT_CPTE: number;
  TOT_CPTE: number;
  TOT_MONT: number;
  TOTAL_LIGNES: number;
}

export interface SuivieClientelOvpMensuelContext {
  entites: SuivieClientelOption[];
  banques: SuivieClientelOvpMensuelBankOption[];
  defaultFilters: SuivieClientelOvpMensuelFilters;
}

export interface SuivieClientelOvpMensuelResponse {
  filters: SuivieClientelOvpMensuelFilters;
  items: SuivieClientelOvpMensuelRow[];
  totals: SuivieClientelOvpMensuelTotals;
}

export interface EtudeCreanceAffectationCurrent {
  AFFECT_NO?: string | number;
  GEST_CODE?: string;
  CREAN_CODE?: string;
  STAT_CODE?: string;
  STATUT_LIB?: string;
  AFFECT_DATEDEB?: string;
  AFFECT_DATEFIN?: string;
  AFFECT_MOTIF?: string;
  AFFECT_DATE_CTL?: string;
  GEST_NOM?: string;
  GEST_PRENOM?: string;
  GEST_POSTE?: string;
  GESTIONNAIRE_LIB?: string;
  [key: string]: unknown;
}

export interface EtudeCreanceAffectationGestionnaireOption extends SuivieClientelOption {
  GEST_CODE?: string;
  GEST_NOM?: string;
  GEST_PRENOM?: string;
  GEST_POSTE?: string;
  STAT_CODE?: string;
  STATUT_LIB?: string;
  ENTITE_CODE?: string;
}

export interface EtudeCreanceAffectationOptions {
  gestionnaires?: EtudeCreanceAffectationGestionnaireOption[];
  [key: string]: unknown;
}

export interface EtudeCreanceAffectationResponse extends Partial<CreanceResponse> {
  CREAN_CODE: string;
  PC_CODE?: string;
  POSTE_COMPTABLE_LIB?: string;
  CREAN_USER_CPTE?: string;
  CREAN_DATE_CPTE?: string;
  CODGEST?: string;
  NOMGEST?: string;
  AFFECT_NO?: string | number;
  AFFECTATION_ACTIVE_COUNT?: number;
  affectationCurrent?: EtudeCreanceAffectationCurrent;
  affectationOptions?: EtudeCreanceAffectationOptions;
  closedRows?: number;
  message?: string;
}

export interface EtudeCreanceAffectationLotRow {
  AFFECT_NO?: string | number | null;
  CREAN_CODE?: string;
  DATE_AFFECTATION?: string;
  GRP_CREAN_CODE?: string | null;
  GROUPE_CREANCE_LIB?: string | null;
  DEB_CODE?: string | null;
  DEBITEUR_NOM?: string | null;
  ETAT?: string;
  CURRENT_GEST_CODE?: string | null;
  CURRENT_GESTIONNAIRE_LIB?: string | null;
  CURRENT_GEST_POSTE?: string | null;
  AFFECTATION_ACTIVE_COUNT?: number;
  HAS_ACTIVE_AFFECTATION?: boolean;
  IS_VALID?: boolean;
  RESULT_STATUS?: string;
  MESSAGE?: string;
  ERROR?: string;
  [key: string]: unknown;
}

export interface EtudeCreanceAffectationLotContext {
  affectationOptions?: EtudeCreanceAffectationOptions;
  dateAffectation?: string;
  emptyRowCount?: number;
  [key: string]: unknown;
}

export interface EtudeCreanceAffectationLotResolveResponse {
  rows: EtudeCreanceAffectationLotRow[];
  resolvedCount?: number;
  dateAffectation?: string;
  [key: string]: unknown;
}

export interface EtudeCreanceAffectationLotSaveResponse extends EtudeCreanceAffectationLotContext {
  selectedGestionnaire?: EtudeCreanceAffectationGestionnaireOption;
  rows: EtudeCreanceAffectationLotRow[];
  totalRequested?: number;
  createdCount?: number;
  reassignedCount?: number;
  unchangedCount?: number;
  errorCount?: number;
  message?: string;
}

export interface EtudeCreanceAffectationConsultationRow {
  AFFECT_NO?: string | number;
  CREAN_CODE?: string;
  GEST_CODE?: string;
  GESTIONNAIRE_LIB?: string;
  GEST_POSTE?: string;
  STAT_CODE?: string;
  STATUT_LIB?: string;
  AFFECT_DATEDEB?: string;
  AFFECT_DATEFIN?: string;
  GRP_CREAN_CODE?: string;
  GROUPE_CREANCE_LIB?: string;
  DEBITEUR_NOM?: string;
  AFFECTATION_ETAT?: string;
  IS_ACTIVE?: number | boolean;
  [key: string]: unknown;
}

export interface EtudeCreanceAffectationConsultationContext {
  affectationOptions?: EtudeCreanceAffectationOptions;
  [key: string]: unknown;
}

export interface EtudeCreanceAffectationConsultationByCreanceResponse extends EtudeCreanceAffectationConsultationContext {
  mode?: string;
  creanCode?: string;
  items: EtudeCreanceAffectationConsultationRow[];
  totalCount?: number;
  activeCount?: number;
  currentAffectation?: EtudeCreanceAffectationConsultationRow;
}

export interface EtudeCreanceAffectationConsultationByGestionnaireResponse extends EtudeCreanceAffectationConsultationContext {
  mode?: string;
  selectedGestionnaire?: EtudeCreanceAffectationGestionnaireOption;
  gestCode?: string;
  activeOnly?: boolean;
  items: EtudeCreanceAffectationConsultationRow[];
  totalCount?: number;
  activeCount?: number;
}

export interface CreanceResponse {
  CREAN_CODE: string;
  DEB_CODE: string;
  GRP_CREAN_CODE?: string; // Nouveau nom de colonne selon la doc
  GC_CODE?: string; // Ancien nom (pour compatibilité)
  OBJ_CREAN_CODE?: string; // Nouveau nom de colonne selon la doc
  OC_CODE?: string; // Ancien nom (pour compatibilité)
  PERIOD_CODE?: string;
  CREAN_OBJET?: string;

  // Informations débiteur (depuis JOIN)
  DEB_NOM?: string;
  DEB_PREN?: string;
  DEB_RAIS_SOCIALE?: string;
  TYPDEB_CODE?: string; // 'P' pour personne physique, 'M' pour personne morale

  // Informations groupe et objet (depuis JOIN)
  GROUPE_CREANCE_LIB?: string;
  OBJET_CREANCE_LIB?: string;
  PERIOD_LIB?: string;
  ENTITE_LIB?: string;
  DEBITEUR_NOM?: string;
  CPT_CODE?: string;

  // Informations ordonnateur (depuis JOIN)
  ORDO_CODE: string;
  ORDO_NOM?: string;
  ORDO_PREN?: string;

  // Informations complémentaires pour l'extrait de compte
  CREAN_USER_CODE?: string;
  GESTIONNAIRE_NOM?: string;
  USER_NOM?: string;
  USER_PREN?: string;
  PRODUIT_LIB?: string;
  PRODUIT_GROUPE_LIB?: string;
  POSTE_COMPTABLE_LIB?: string;
  TYPE_TITRE_LIB?: string;
  SOL_EXIG?: number;
  SOLDE_PRINC?: number;
  SOLDE_PENALITE?: number;
  SOLDE_AUT_FRAIS?: number;
  TOT_PAIEMENT?: number;
  ECH_IMP?: number;
  ECH_ENCOURS?: number;
  SOLDE_EXIGIBLE?: number;
  PC_CODE?: string;
  TYPE_TITRE_CODE?: number;
  CPTE_CLI_NUM?: number;

  // Montants de base
  CREAN_CAPIT_INIT: number;
  CREAN_MONT_DECAISSE?: number;
  CREAN_MONT_IC?: number;
  CREAN_COMM_BANQ?: number;
  CREAN_DEJ_REMB?: number;

  // Numéros de référence
  CREAN_NUM_PREC?: string;
  CREAN_CODE_PREC?: string; // Nouveau nom selon la doc
  CREAN_NUM_ANC?: string;
  CREAN_CODE_ANC?: string; // Nouveau nom selon la doc

  // Montants calculés
  CREAN_MONT_A_REMB: number;
  CREAN_MONT_DU?: number;
  CREAN_MONT_REMB?: number;
  CREAN_MONT_IMPAYE: number;
  CREAN_MONT_IR?: number;
  CREAN_FRAIS?: number;
  CREAN_TOTAL_DU: number;
  CREAN_ENCOURS?: number;
  CREAN_PENALITE: number;
  CREAN_TOT_SOLDE: number;
  CREAN_SOLDE_INIT?: number; // Solde à recouvrer selon la doc

  // Dates
  CREAN_DATE_CREAT: string;
  CREAN_DATE_DEBLOCAGE: string;
  CREAN_DATEFT?: string; // Nouveau nom selon la doc
  CREAN_DATE_ECHEANCE: string;
  CREAN_DATECH?: string; // Nouveau nom selon la doc
  CREAN_DATE_MODIF?: string;

  // Conditions
  CREAN_PERIODICITE?: string;
  CREAN_NBECH?: number; // Nombre d'échéances selon la doc
  CREAN_DUREE?: number;
  CREAN_TAUX_IC?: number;
  CREAN_TAUXIC?: number; // Nouveau nom selon la doc
  CREAN_TAUX_IR?: number;
  CREAN_TAUXIR?: number; // Nouveau nom selon la doc

  // Administratif
  CREAN_STATUT?: string; // Ancien champ
  CREAN_STATRECOUV?: string; // Statut de recouvrement (VARCHAR2(2)) selon la doc

  // Observations
  CREAN_OBS?: string;

  // Garanties réelles (array selon la doc)
  garantiesReelles?: Array<{
    CREAN_CODE: string;
    GAREEL_TYPGAR?: string;
    GAREEL_REFGAR?: string;
    GAREEL_VALEST?: number;
    GAREEL_DATEVAL?: string;
    [key: string]: unknown;
  }>;

  // Garanties personnelles (array selon la doc)
  garantiesPersonnelles?: Array<{
    CREAN_CODE: string;
    DEB_CODE?: string;
    GARPHYS_TYPGAR?: string;
    DEB_NOM?: string;
    DEB_PREN?: string;
    DEB_RAIS_SOCIALE?: string;
    [key: string]: unknown;
  }>;

  // Pièces (array selon la doc)
  pieces?: Array<{
    CREAN_CODE: string;
    PIECE_TYPE?: string;
    PIECE_NUM?: string;
    PIECE_DATEDEP?: string;
    [key: string]: unknown;
  }>;

  regularisations?: Array<{
    CREAN_CODE: string;
    REGUL_DATE?: string;
    REGUL_DATE_CTL?: string;
    REGUL_MONT?: number;
    PAIEMENT?: number;
    SOLDE?: number;
    REGUL_MOTIF?: string;
    REGUL_TYPE_CODE?: string;
    REGUL_USER_CODE?: string;
    AFFECTATION?: string | null;
    [key: string]: unknown;
  }>;

  ovp?: SuivieClientelOvp;
  ovps?: SuivieClientelOvp[];
  domiciliation?: SuivieClientelDomiciliation;
  virements?: SuivieClientelVirement[];
  VIREMENTS_TOTAL_MONTANT?: number;
  OVP_COUNT?: number;
  HAS_OVP?: boolean;
  HAS_DOMICILIATION?: boolean;
  CAN_CREATE_OVP?: boolean;
  CREATION_BLOCK_REASON?: string;
  creationOptions?: SuivieClientelCreationOptions;
  modificationOptions?: SuivieClientelModificationOptions;

  [key: string]: unknown;
}

export interface CreanceApiResponse {
  success: boolean;
  data: CreanceResponse | CreanceResponse[];
  message?: string;
  error?: {
    code: string;
    message: string;
    path: string;
  };
}

// Types pour les listes déroulantes
export interface GroupeCreance {
  GC_CODE: string;
  GC_LIB: string;
}

export interface ObjetCreance {
  OC_CODE: string;
  OC_LIB: string;
}

export interface Ordonnateur {
  ORDO_CODE: string;
  ORDO_LIB: string;
}

// Statuts possibles pour une créance
export type CreanceStatut =
  | "EN_COURS"
  | "SOLDEE"
  | "CONTENTIEUX"
  | "ABANDON"
  | "PRESCRITE";

// Périodicités possibles
export type CreancePeriodicite =
  | "MENSUELLE"
  | "TRIMESTRIELLE"
  | "SEMESTRIELLE"
  | "ANNUELLE"
  | "IN_FINE";
