export interface TypeRegularisation {
  REGUL_TYPE_CODE: string;
  REGUL_TYPE_LIB: string;
}

export interface TypeRegularisationApiResponse {
  data: TypeRegularisation[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeRegularisationCreateRequest {
  code: string;
  libelle: string;
}

export interface TypeRegularisationUpdateRequest {
  libelle: string;
}
