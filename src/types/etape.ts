export interface Etape {
  ETAP_CODE: string;
  ETAP_LIB: string;
  ETAP_LIBLONG?: string;
  ETAP_ACTIF?: boolean;
  ETAP_ORDRE?: number;
}

export interface EtapeApiResponse {
  data: Etape[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface EtapeCreateRequest {
  ETAP_LIB: string;
  ETAP_LIBLONG?: string;
  ETAP_ACTIF?: boolean;
  ETAP_ORDRE?: number;
}

export interface EtapeUpdateRequest extends Partial<EtapeCreateRequest> {
  ETAP_CODE: string;
}






