export interface Nationalite {
  NAT_CODE: string;
  NAT_LIB: string;
  NAT_LIBLONG?: string;
  NAT_ACTIF?: boolean;
  NAT_ORDRE?: number;
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
  NAT_LIB: string;
  NAT_LIBLONG?: string;
  NAT_ACTIF?: boolean;
  NAT_ORDRE?: number;
}

export interface NationaliteUpdateRequest extends Partial<NationaliteCreateRequest> {
  NAT_CODE: string;
}

