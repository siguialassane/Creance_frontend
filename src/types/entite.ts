export interface Entite {
  ENTITE_CODE: string;
  ENTITE_LIB: string;
  ENTITE_LIB_LONG?: string;
  ENTITE_RESP?: string;
  ENTITE_ASSIGN?: string;
  ENTITE_LIB_MINUSC?: string;
}

export interface EntiteApiResponse {
  data: Entite[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface EntiteCreateRequest {
  ENTITE_LIB: string;
  ENTITE_LIB_LONG?: string;
  ENTITE_RESP?: string;
  ENTITE_ASSIGN?: string;
}

export interface EntiteUpdateRequest extends Partial<EntiteCreateRequest> {
  ENTITE_CODE: string;
}






