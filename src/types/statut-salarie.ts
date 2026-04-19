export interface StatutSalarie {
  STATSAL_CODE: string;
  STATSAL_LIB: string;
}

export interface StatutSalarieApiResponse {
  data: StatutSalarie[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface StatutSalarieCreateRequest {
  STATSAL_CODE: string;
  STATSAL_LIB: string;
}

export interface StatutSalarieUpdateRequest extends Partial<StatutSalarieCreateRequest> {
  STATSAL_CODE: string;
}

