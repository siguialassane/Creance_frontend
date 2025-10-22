export interface Classe {
  CLAS_CODE: string;
  CLAS_LIB: string;

}

export interface ClasseApiResponse {
  data: Classe[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface ClasseCreateRequest {
  CLAS_CODE: string;
  CLAS_LIB: string;
}

export interface ClasseUpdateRequest {
  CLAS_LIB: string;
}
