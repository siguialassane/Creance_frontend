export interface Etape {
  ET_CODE: string;
  ET_LIB: string;
  ET_LIBLONG?: string;
  ET_ACTIF?: boolean;
  ET_ORDRE?: number;
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
  ET_LIB: string;
  ET_LIBLONG?: string;
  ET_ACTIF?: boolean;
  ET_ORDRE?: number;
}

export interface EtapeUpdateRequest extends Partial<EtapeCreateRequest> {
  ET_CODE: string;
}






