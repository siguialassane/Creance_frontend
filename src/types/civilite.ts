export interface Civilite {
  CIV_CODE: string;
  CIV_LIB: string;
  CIV_DESC: string | null;
  CIV_ACTIF: boolean;
  CIV_ORDRE: number | null;
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
  CIV_LIB: string;
  CIV_DESC?: string;
  CIV_ACTIF?: boolean;
  CIV_ORDRE?: number;
}

export interface CiviliteUpdateRequest extends Partial<CiviliteCreateRequest> {
  CIV_CODE: string;
}
