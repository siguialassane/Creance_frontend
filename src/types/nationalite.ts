export interface Nationalite {
  NAT_CODE: string | number;
  NAT_LIB: string;
  NAT_DEF?: string;
  NAT_IND?: string;
}

export interface NationaliteApiResponse {
  data: Nationalite[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface NationaliteCreateRequest {
  NAT_CODE?: string | number;
  NAT_LIB: string;
  NAT_DEF?: string;
  NAT_IND?: string;
}

export interface NationaliteUpdateRequest {
  NAT_LIB: string;
  NAT_DEF?: string;
  NAT_IND?: string;
}

