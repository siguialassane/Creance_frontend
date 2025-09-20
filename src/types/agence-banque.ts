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
  AG_LIB: string;
  BQ_CODE: string;
  AG_RESPONS?: string;
  AG_ADRESS?: string;
  AG_CONTACT?: string;
  AG_LIBLONG?: string;
  AG_SIGLE?: string;
  AG_AUTLIB?: string;
}

export interface AgenceBanqueUpdateRequest extends Partial<AgenceBanqueCreateRequest> {
  AG_CODE: string;
}
