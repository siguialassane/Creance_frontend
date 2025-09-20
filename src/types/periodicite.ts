export interface Periodicite {
  PER_CODE: string;
  PER_LIB: string;
  PER_LIBLONG?: string;
  PER_ACTIF?: boolean;
  PER_ORDRE?: number;
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
  PER_LIB: string;
  PER_LIBLONG?: string;
  PER_ACTIF?: boolean;
  PER_ORDRE?: number;
}

export interface PeriodiciteUpdateRequest extends Partial<PeriodiciteCreateRequest> {
  PER_CODE: string;
}

