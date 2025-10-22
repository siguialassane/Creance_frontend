export interface Exercice {
  EXO_CODE: string;
  EXO_LIB: string;
  EXO_LIBLONG?: string;
  EXO_ACTIF?: boolean;
  EXO_ORDRE?: number;
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
  EXO_LIB: string;
  EXO_LIBLONG?: string;
  EXO_ACTIF?: boolean;
  EXO_ORDRE?: number;
}

export interface ExerciceUpdateRequest extends Partial<ExerciceCreateRequest> {
  EXO_CODE: string;
}






