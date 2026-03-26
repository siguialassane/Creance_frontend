export interface AgenceBanque {
  BQAG_NUM: string;
  BQAG_LIB: string;
  BQ_CODE: string;
  ANC_AG: string | null;
  ANC_BQAG_CODE: string | null;
}

export interface AgenceBanqueApiResponse {
  data: AgenceBanque[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface AgenceBanqueCreateRequest {
  BQ_CODE: string;
  BQAG_CODE: string;
  BQAG_LIB: string;
  // BQAG_NUM peut être absent (généré côté DB) selon le modèle.
  BQAG_NUM?: string | null;
  ANC_AG?: string | null;
  ANC_BQAG_CODE?: string | null;
}

export interface AgenceBanqueUpdateRequest extends Partial<AgenceBanqueCreateRequest> {}
