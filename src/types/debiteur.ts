// Types pour le débiteur

export interface DebiteurPersonnePhysique {
  // Informations générales (Étape 1)
  typeDebiteur: "P" | "physique";
  categorieDebiteur: string;
  adressePostale: string;
  email: string;

  // Personne physique (Étape 2A)
  civilite: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  quartier: string;
  nationalite: string;
  fonction: string;
  profession: string;
  employeur: string;
  statutSalarie: string;
  matricule?: string;
  sexe: "M" | "F";
  dateDeces?: string;

  // Pièce d'identité
  naturePieceIdentite?: string;
  numeroPieceIdentite?: string;
  dateEtablie?: string;
  lieuEtablie?: string;

  // Situation familiale
  statutMatrimonial?: string;
  regimeMariage?: string;
  nombreEnfant?: string;

  // Conjoint
  nomConjoint?: string;
  prenomsConjoint?: string;
  dateNaissanceConjoint?: string;
  adresseConjoint?: string;
  telConjoint?: string;
  numeroPieceConjoint?: string;

  // Parents
  nomPere?: string;
  prenomsPere?: string;
  nomMere?: string;
  prenomsMere?: string;
  rue?: string;

  // Domiciliation (Étape 3)
  type: string;
  numeroCompte: string;
  libelle: string;
  banque: string;
  banqueAgence: string;
}

export interface DebiteurPersonneMorale {
  // Informations générales (Étape 1)
  typeDebiteur: "M" | "moral";
  categorieDebiteur: string;
  adressePostale: string;
  email: string;

  // Personne morale (Étape 2B)
  registreCommerce: string;
  raisonSociale: string;
  capitalSocial?: string;
  formeJuridique: string;
  domaineActivite: string;
  siegeSocial: string;
  nomGerant: string;

  // Domiciliation (Étape 3)
  type: string;
  numeroCompte: string;
  libelle: string;
  banque: string;
  banqueAgence: string;
}

export type DebiteurCreateRequest = DebiteurPersonnePhysique | DebiteurPersonneMorale;

export interface DebiteurResponse {
  DEB_CODE: string;
  DEB_TYPE: string;
  DEB_CATEG_CODE: string;
  DEB_EMAIL: string;
  DEB_ADRESSE_POSTALE: string;
  [key: string]: any; // Pour les autres champs spécifiques
}

export interface DebiteurApiResponse {
  status: "SUCCESS" | "ERROR";
  data?: DebiteurResponse | DebiteurResponse[] | any;
  message?: string;
  timestamp?: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
}
