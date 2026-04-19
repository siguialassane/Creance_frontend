export interface Exercice {
  NUM_EXE: number;
  EXO_LIB: string;
  EXO_DATEDEB: string | null;
  EXO_DATEFIN: string | null;
  EXO_CLOS: string | null;
  DATE_ADOPTION_BUD: string | null;
  EXO_ENCOURS: string | null;
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
  NUM_EXE: number;
  EXO_LIB: string;
  EXO_DATEDEB?: string | null;
  EXO_DATEFIN?: string | null;
  EXO_CLOS?: string | null;
  DATE_ADOPTION_BUD?: string | null;
  EXO_ENCOURS?: string | null;
}

export interface ExerciceUpdateRequest {
  EXO_LIB: string;
  EXO_DATEDEB?: string | null;
  EXO_DATEFIN?: string | null;
  EXO_CLOS?: string | null;
  DATE_ADOPTION_BUD?: string | null;
  EXO_ENCOURS?: string | null;
}






