export interface TypeAuxiliaire {
  TAUX_CODE: string;
  TAUX_LIB: string;
  TAUX_LIBLONG?: string;
  TAUX_ACTIF?: boolean;
  TAUX_ORDRE?: number;
}

export interface TypeAuxiliaireApiResponse {
  data: TypeAuxiliaire[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeAuxiliaireCreateRequest {
  TAUX_LIB: string;
  TAUX_LIBLONG?: string;
  TAUX_ACTIF?: boolean;
  TAUX_ORDRE?: number;
}

export interface TypeAuxiliaireUpdateRequest extends Partial<TypeAuxiliaireCreateRequest> {
  TAUX_CODE: string;
}

