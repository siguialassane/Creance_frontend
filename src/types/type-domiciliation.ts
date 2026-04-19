export interface TypeDomiciliation {
  TYPDOM_CODE: string;
  TYPDOM_LIB: string;
}

export interface TypeDomiciliationApiResponse {
  data: TypeDomiciliation[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeDomiciliationCreateRequest {
  code: string;
  libelle: string;
}

export interface TypeDomiciliationUpdateRequest {
  libelle: string;
}
