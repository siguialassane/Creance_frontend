export interface TypeEmployeur {
  TYPEMP_CODE: string;
  TYPEMP_LIB: string;
}

export interface TypeEmployeurApiResponse {
  data: TypeEmployeur[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeEmployeurCreateRequest {
  TYPEMP_CODE: string;
  TYPEMP_LIB: string;
}

export interface TypeEmployeurUpdateRequest {
  TYPEMP_LIB: string;
}
