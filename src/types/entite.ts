export interface Entite {
  ENT_CODE: string;
  ENT_LIB: string;
  ENT_LIBLONG?: string;
  ENT_ACTIF?: boolean;
  ENT_ORDRE?: number;
}

export interface EntiteApiResponse {
  data: Entite[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface EntiteCreateRequest {
  ENT_LIB: string;
  ENT_LIBLONG?: string;
  ENT_ACTIF?: boolean;
  ENT_ORDRE?: number;
}

export interface EntiteUpdateRequest extends Partial<EntiteCreateRequest> {
  ENT_CODE: string;
}






