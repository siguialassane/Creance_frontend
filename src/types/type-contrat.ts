export interface TypeContrat {
  TYPCONT_CODE: string;
  TYPCONT_LIB: string;
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
  TYPCONT_CODE: string;
  TYPCONT_LIB: string;
}

export interface TypeContratUpdateRequest {
  TYPCONT_LIB: string;
}
