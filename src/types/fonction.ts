export interface Fonction {
  FONCT_CODE: string;
  FONCT_LIB: string;
  FONCT_LIB_LONG?: string | null;
  FONCT_NUM?: number | null;
  // Anciens champs pour compatibilité
  FONCT_LIBLONG?: string;
  FONCT_ACTIF?: boolean;
  FONCT_ORDRE?: number;
}

export interface FonctionApiResponse {
  data: {
    content?: Fonction[];
    totalElements?: number;
    totalPages?: number;
    size?: number;
    number?: number;
    first?: boolean;
    last?: boolean;
  } | Fonction[];
  message?: string;
  status?: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp?: string;
}

export interface FonctionCreateRequest {
  FONCT_LIB: string;
  FONCT_LIBLONG?: string;
  FONCT_ACTIF?: boolean;
  FONCT_ORDRE?: number;
}

export interface FonctionUpdateRequest extends Partial<FonctionCreateRequest> {
  FONCT_CODE: string;
}






