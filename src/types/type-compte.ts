export interface TypeCompte {
  TYPCPT_CODE: string;
  TYPCPT_LIB: string;
}

export interface TypeCompteApiResponse {
  data: TypeCompte[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeCompteCreateRequest {
  code: string;
  libelle: string;
}

export interface TypeCompteUpdateRequest {
  libelle: string;
}
