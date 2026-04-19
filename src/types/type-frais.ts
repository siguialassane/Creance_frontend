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
  code: string;
  libelle: string;
}

export interface TypeFraisUpdateRequest {
  libelle: string;
}
