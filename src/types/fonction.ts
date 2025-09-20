export interface Fonction {
  FON_CODE: string;
  FON_LIB: string;
  FON_LIBLONG?: string;
  FON_ACTIF?: boolean;
  FON_ORDRE?: number;
}

export interface FonctionApiResponse {
  data: Fonction[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface FonctionCreateRequest {
  FON_LIB: string;
  FON_LIBLONG?: string;
  FON_ACTIF?: boolean;
  FON_ORDRE?: number;
}

export interface FonctionUpdateRequest extends Partial<FonctionCreateRequest> {
  FON_CODE: string;
}



