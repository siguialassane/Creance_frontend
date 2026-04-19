export interface Periodicite {
  PERIOD_CODE: string;
  PERIOD_LIB: string;
  PERIOD_LIBLONG?: string;
  PERIOD_ACTIF?: boolean;
  PERIOD_ORDRE?: number;
}

export interface PeriodiciteApiResponse {
  data: Periodicite[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface PeriodiciteCreateRequest {
  PERIOD_CODE: string;
  PERIOD_LIB: string;
  PERIOD_LIBLONG?: string;
  PERIOD_ACTIF?: boolean;
  PERIOD_ORDRE?: number;
}

export interface PeriodiciteUpdateRequest extends Partial<PeriodiciteCreateRequest> {
  // PERIOD_CODE is used in the URL path, not in the body
}

