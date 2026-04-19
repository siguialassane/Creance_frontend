export interface AgenceBanque {
  BQ_CODE: string;
  BQAG_CODE: string;
  BQAG_LIB: string;
  BQAG_NUM: string | null;
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
  BQAG_NUM?: string | null;
  ANC_AG?: string | null;
  ANC_BQAG_CODE?: string | null;
}

export interface AgenceBanqueUpdateRequest extends Partial<AgenceBanqueCreateRequest> {
  AG_CODE?: string | null;
}
