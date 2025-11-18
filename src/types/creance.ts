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

  // Informations ordonnateur (depuis JOIN)
  ORDO_CODE: string;
  ORDO_NOM?: string;
  ORDO_PREN?: string;

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
    [key: string]: any;
  }>;

  // Garanties personnelles (array selon la doc)
  garantiesPersonnelles?: Array<{
    CREAN_CODE: string;
    DEB_CODE?: string;
    GARPHYS_TYPGAR?: string;
    DEB_NOM?: string;
    DEB_PREN?: string;
    DEB_RAIS_SOCIALE?: string;
    [key: string]: any;
  }>;

  // Pièces (array selon la doc)
  pieces?: Array<{
    CREAN_CODE: string;
    PIECE_TYPE?: string;
    PIECE_NUM?: string;
    PIECE_DATEDEP?: string;
    [key: string]: any;
  }>;

  [key: string]: any;
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
