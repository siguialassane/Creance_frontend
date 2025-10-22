export interface Civilite {
  CIV_CODE: string;
  CIV_LIB: string;
}

export interface CiviliteApiResponse {
  data: Civilite[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface CiviliteCreateRequest {
  CIV_CODE: string;
  CIV_LIB: string;
}

export interface CiviliteUpdateRequest {
  CIV_LIB: string;
}
