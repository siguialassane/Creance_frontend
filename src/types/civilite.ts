export interface Civilite {
  CV_CODE: string;
  CV_LIB: string;
  CV_DESC: string | null;
  CV_ACTIF: boolean;
  CV_ORDRE: number | null;
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
  CV_LIB: string;
  CV_DESC?: string;
  CV_ACTIF?: boolean;
  CV_ORDRE?: number;
}

export interface CiviliteUpdateRequest extends Partial<CiviliteCreateRequest> {
  CV_CODE: string;
}
