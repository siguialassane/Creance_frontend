export interface Operation {
  OPERAT_CODE: string;
  QUART_CODE?: string;
  OPERAT_LIB?: string;
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
  OPERAT_CODE: string;
  QUART_CODE?: string;
  OPERAT_LIB?: string;
}

export interface OperationUpdateRequest extends Partial<OperationCreateRequest> {
  // OPERAT_CODE is the primary key, sent in URL path
}
