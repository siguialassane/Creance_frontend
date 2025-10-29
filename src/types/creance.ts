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
  GC_CODE: string;
  OC_CODE: string;
  CREAN_OBJET?: string;

  // Informations débiteur (depuis JOIN)
  DEB_NOM?: string;
  DEB_PREN?: string;
  DEB_RAIS_SOCIALE?: string;
  TYPDEB_CODE?: string;

  // Informations groupe et objet (depuis JOIN)
  GROUPE_CREANCE_LIB?: string;
  OBJET_CREANCE_LIB?: string;

  // Montants de base
  CREAN_CAPIT_INIT: number;
  CREAN_MONT_DECAISSE?: number;
  CREAN_MONT_IC?: number;
  CREAN_COMM_BANQ?: number;

  // Numéros de référence
  CREAN_NUM_PREC?: string;
  CREAN_NUM_ANC?: string;

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

  // Dates
  CREAN_DATE_CREAT: string;
  CREAN_DATE_DEBLOCAGE: string;
  CREAN_DATE_ECHEANCE: string;
  CREAN_DATE_MODIF?: string;

  // Conditions
  CREAN_PERIODICITE?: string;
  CREAN_DUREE?: number;
  CREAN_TAUX_IC?: number;
  CREAN_TAUX_IR?: number;

  // Administratif
  ORDO_CODE: string;
  CREAN_STATUT: string;
  CREAN_OBS?: string;

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
