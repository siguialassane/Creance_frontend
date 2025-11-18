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
  TYPDOM_CODE: string;
  TYPDOM_LIB: string;
}

export interface TypeDomiciliationUpdateRequest {
  TYPDOM_LIB: string;
}
