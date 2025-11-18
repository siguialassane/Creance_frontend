export interface Operation {
  OP_CODE: string;
  OP_LIB: string;
  OP_LIBLONG?: string;
  OP_ACTIF?: boolean;
  OP_ORDRE?: number;
}

export interface OperationApiResponse {
  data: Operation[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface OperationCreateRequest {
  OP_LIB: string;
  OP_LIBLONG?: string;
  OP_ACTIF?: boolean;
  OP_ORDRE?: number;
}

export interface OperationUpdateRequest extends Partial<OperationCreateRequest> {
  OP_CODE: string;
}

