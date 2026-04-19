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
  code: string;
  libelle: string;
}

export interface TypeEmployeurUpdateRequest {
  libelle: string;
}
