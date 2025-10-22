export interface TypeEcheancier {
  TYPECH_CODE: string;
  TYPECH_LIB: string;
}

export interface TypeEcheancierApiResponse {
  data: TypeEcheancier[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeEcheancierCreateRequest {
  TYPECH_CODE: string;
  TYPECH_LIB: string;
}

export interface TypeEcheancierUpdateRequest {
  TYPECH_LIB: string;
}
