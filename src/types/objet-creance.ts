export interface ObjetCreance {
  OBJ_CREAN_CODE: string;
  OBJ_CREAN_LIB: string;
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
  OBJ_CREAN_CODE: string;
  OBJ_CREAN_LIB: string;
}

export interface ObjetCreanceUpdateRequest extends Partial<ObjetCreanceCreateRequest> {
  // OBJ_CREAN_CODE is used in the URL path, not in the body
}
