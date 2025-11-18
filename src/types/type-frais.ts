export interface TypeFrais {
  TYPFRAIS_CODE: string;
  TYPFRAIS_LIB: string;
}

export interface TypeFraisApiResponse {
  data: TypeFrais[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeFraisCreateRequest {
  TYPFRAIS_CODE: string;
  TYPFRAIS_LIB: string;
}

export interface TypeFraisUpdateRequest {
  TYPFRAIS_LIB: string;
}
