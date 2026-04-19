export interface TypeContrat {
  TYPCONT_CODE: string;
  TYPCONT_LIB: string;
  code?: string;
  libelle?: string;
}

export interface TypeContratApiResponse {
  data: TypeContrat[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeContratCreateRequest {
  code: string;
  libelle: string;
}

export interface TypeContratUpdateRequest {
  libelle: string;
}
