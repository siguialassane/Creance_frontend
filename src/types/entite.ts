export interface Entite {
  ENT_CODE: string;
  ENT_LIB: string;
  ENT_LIB_LONG?: string;
  ENT_RESP?: string;
  ENT_ASSIGN?: string;
  ENT_LIB_MINUSC?: string;
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
  ENT_LIB: string;
  ENT_LIB_LONG?: string;
  ENT_RESP?: string;
  ENT_ASSIGN?: string;
}

export interface EntiteUpdateRequest extends Partial<EntiteCreateRequest> {
  ENT_CODE: string;
}






