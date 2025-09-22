export interface CompteOperation {
  CO_CODE: string;
  CO_LIB: string;
  CO_LIBLONG?: string;
  CO_ACTIF?: boolean;
  CO_ORDRE?: number;
}

export interface CompteOperationApiResponse {
  data: CompteOperation[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface CompteOperationCreateRequest {
  CO_LIB: string;
  CO_LIBLONG?: string;
  CO_ACTIF?: boolean;
  CO_ORDRE?: number;
}

export interface CompteOperationUpdateRequest extends Partial<CompteOperationCreateRequest> {
  CO_CODE: string;
}




