export interface Zone {
  ZONE_CODE: string;
  ZONE_LIB: string;
  ZONE_DESCRIPT?: string;
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
  ZONE_CODE: string;
  ZONE_LIB: string;
  ZONE_DESCRIPT?: string;
}

export interface ZoneUpdateRequest {
  ZONE_LIB: string;
  ZONE_DESCRIPT?: string;
}
