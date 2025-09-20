export interface Exercice {
  EX_CODE: string;
  EX_LIB: string;
  EX_LIBLONG?: string;
  EX_ACTIF?: boolean;
  EX_ORDRE?: number;
}

export interface ExerciceApiResponse {
  data: Exercice[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface ExerciceCreateRequest {
  EX_LIB: string;
  EX_LIBLONG?: string;
  EX_ACTIF?: boolean;
  EX_ORDRE?: number;
}

export interface ExerciceUpdateRequest extends Partial<ExerciceCreateRequest> {
  EX_CODE: string;
}



