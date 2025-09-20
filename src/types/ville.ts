export interface Ville {
  V_CODE: string;
  V_LIB: string;
  V_LIBLONG?: string;
  V_ACTIF?: boolean;
  V_ORDRE?: number;
}

export interface VilleApiResponse {
  data: Ville[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface VilleCreateRequest {
  V_LIB: string;
  V_LIBLONG?: string;
  V_ACTIF?: boolean;
  V_ORDRE?: number;
}

export interface VilleUpdateRequest extends Partial<VilleCreateRequest> {
  V_CODE: string;
}

