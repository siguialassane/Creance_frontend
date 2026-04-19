export interface TypeSaisie {
  TYPSAIS_CODE: string;
  TYPSAIS_LIB: string;
}

export interface TypeSaisieApiResponse {
  data: TypeSaisie[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeSaisieCreateRequest {
  code: string;
  libelle: string;
}

export interface TypeSaisieUpdateRequest {
  libelle: string;
}
