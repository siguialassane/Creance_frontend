export interface TypeDebiteur {
  TD_CODE: string;
  TD_LIB: string;
  TD_LIBLONG?: string;
  TD_ACTIF?: boolean;
  TD_ORDRE?: number;
}

export interface TypeDebiteurApiResponse {
  data: TypeDebiteur[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeDebiteurCreateRequest {
  TD_LIB: string;
  TD_LIBLONG?: string;
  TD_ACTIF?: boolean;
  TD_ORDRE?: number;
}

export interface TypeDebiteurUpdateRequest extends Partial<TypeDebiteurCreateRequest> {
  TD_CODE: string;
}

