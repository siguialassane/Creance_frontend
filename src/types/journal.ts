export interface Journal {
  J_CODE: string;
  J_LIB: string;
  J_LIBLONG?: string;
  J_ACTIF?: boolean;
  J_ORDRE?: number;
}

export interface JournalApiResponse {
  data: Journal[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface JournalCreateRequest {
  J_LIB: string;
  J_LIBLONG?: string;
  J_ACTIF?: boolean;
  J_ORDRE?: number;
}

export interface JournalUpdateRequest extends Partial<JournalCreateRequest> {
  J_CODE: string;
}



