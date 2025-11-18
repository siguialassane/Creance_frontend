export interface StatutSalarie {
  SS_CODE: string;
  SS_LIB: string;
  SS_LIBLONG?: string;
  SS_ACTIF?: boolean;
  SS_ORDRE?: number;
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
  SS_LIB: string;
  SS_LIBLONG?: string;
  SS_ACTIF?: boolean;
  SS_ORDRE?: number;
}

export interface StatutSalarieUpdateRequest extends Partial<StatutSalarieCreateRequest> {
  SS_CODE: string;
}

