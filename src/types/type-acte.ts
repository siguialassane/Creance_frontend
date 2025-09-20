export interface TypeActe {
  TA_CODE: string;
  TA_LIB: string;
  TA_LIBLONG?: string;
  TA_ACTIF?: boolean;
  TA_ORDRE?: number;
}

export interface TypeActeApiResponse {
  data: TypeActe[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeActeCreateRequest {
  TA_LIB: string;
  TA_LIBLONG?: string;
  TA_ACTIF?: boolean;
  TA_ORDRE?: number;
}

export interface TypeActeUpdateRequest extends Partial<TypeActeCreateRequest> {
  TA_CODE: string;
}

