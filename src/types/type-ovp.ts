export interface TypeOvp {
  TYPOVP_CODE: string;
  TYPOVP_LIB: string;
}

export interface TypeOvpApiResponse {
  data: TypeOvp[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeOvpCreateRequest {
  TYPOVP_CODE: string;
  TYPOVP_LIB: string;
}

export interface TypeOvpUpdateRequest {
  TYPOVP_LIB: string;
}
