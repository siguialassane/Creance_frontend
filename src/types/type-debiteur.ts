export interface TypeDebiteur {
  TYPDEB_CODE: string;
  TYPDEB_LIB: string;
  TYPDEB_LIBLONG?: string;
  TYPDEB_ACTIF?: boolean;
  TYPDEB_ORDRE?: number;
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
  TYPDEB_LIB: string;
  TYPDEB_LIBLONG?: string;
  TYPDEB_ACTIF?: boolean;
  TYPDEB_ORDRE?: number;
}

export interface TypeDebiteurUpdateRequest extends Partial<TypeDebiteurCreateRequest> {
  TYPDEB_CODE: string;
}

