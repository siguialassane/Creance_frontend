export interface Exercice {
  NUM_EXE: number;
  EXO_LIB: string;
  EXO_DATEDEB?: string;
  EXO_DATEFIN?: string;
  EXO_CLOS?: string;
  EXO_ENCOURS?: string | null;
  DATE_ADOPTION_BUD?: string;
  // Anciens champs pour compatibilité
  EXO_CODE?: string;
  EXO_LIBLONG?: string;
  EXO_ACTIF?: boolean;
  EXO_ORDRE?: number;
}

export interface ExerciceApiResponse {
  data: {
    content?: Exercice[];
    totalElements?: number;
    totalPages?: number;
    size?: number;
    number?: number;
    first?: boolean;
    last?: boolean;
  } | Exercice[];
  message?: string;
  status?: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp?: string;
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






