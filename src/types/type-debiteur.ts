export interface TypeDebiteur {
  TYPDEB_CODE: string;
  TYPDEB_LIB: string;
  code?: string;
  libelle?: string;
  typdeb_code?: string;
  typdeb_lib?: string;
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
  code: string;
  libelle: string;
}

export interface TypeDebiteurUpdateRequest {
  libelle: string;
}

