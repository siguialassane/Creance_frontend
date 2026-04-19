export interface Fonction {
  FONCT_CODE: string;
  FONCT_LIB: string;
  FONCT_LIB_LONG: string | null;
  FONCT_NUM: string | null;
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
  FONCT_CODE: string;
  FONCT_LIB: string;
  FONCT_LIB_LONG?: string | null;
  FONCT_NUM?: string | null;
}

export interface FonctionUpdateRequest {
  FONCT_LIB: string;
  FONCT_LIB_LONG?: string | null;
  FONCT_NUM?: string | null;
}






