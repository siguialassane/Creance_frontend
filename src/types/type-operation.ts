export interface TypeOperation {
  TOP_CODE: string;
  TOP_LIB: string;
  TOP_LIBLONG?: string;
  TOP_ACTIF?: boolean;
  TOP_ORDRE?: number;
}

export interface TypeOperationApiResponse {
  data: TypeOperation[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeOperationCreateRequest {
  TOP_LIB: string;
  TOP_LIBLONG?: string;
  TOP_ACTIF?: boolean;
  TOP_ORDRE?: number;
}

export interface TypeOperationUpdateRequest extends Partial<TypeOperationCreateRequest> {
  TOP_CODE: string;
}

