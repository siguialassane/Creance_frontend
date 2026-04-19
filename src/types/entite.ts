export interface Entite {
  ENTITE_CODE: string;
  ENTITE_LIB: string;
  ENTITE_LIB_LONG: string | null;
  ENTITE_RESP: string | null;
  ENTITE_ASSIGN: string | null;
  ENTITE_LIB_MINUSC: string | null;
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
  ENTITE_LIB_LONG?: string | null;
  ENTITE_RESP?: string | null;
  ENTITE_ASSIGN?: string | null;
  ENTITE_LIB_MINUSC?: string | null;
}

export interface EntiteUpdateRequest extends Partial<EntiteCreateRequest> {}






