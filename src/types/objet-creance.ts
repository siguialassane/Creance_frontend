export interface ObjetCreance {
  OC_CODE: string;
  OC_LIB: string;
  OC_LIBLONG?: string;
  OC_ACTIF?: boolean;
  OC_ORDRE?: number;
}

export interface ObjetCreanceApiResponse {
  data: ObjetCreance[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface ObjetCreanceCreateRequest {
  OC_LIB: string;
  OC_LIBLONG?: string;
  OC_ACTIF?: boolean;
  OC_ORDRE?: number;
}

export interface ObjetCreanceUpdateRequest extends Partial<ObjetCreanceCreateRequest> {
  OC_CODE: string;
}

