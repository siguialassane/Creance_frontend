export interface Zone {
  Z_CODE: string;
  Z_LIB: string;
  Z_LIBLONG?: string;
  Z_ACTIF?: boolean;
  Z_ORDRE?: number;
}

export interface ZoneApiResponse {
  data: Zone[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface ZoneCreateRequest {
  Z_LIB: string;
  Z_LIBLONG?: string;
  Z_ACTIF?: boolean;
  Z_ORDRE?: number;
}

export interface ZoneUpdateRequest extends Partial<ZoneCreateRequest> {
  Z_CODE: string;
}

