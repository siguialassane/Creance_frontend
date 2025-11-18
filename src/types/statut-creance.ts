export interface StatutCreance {
  SC_CODE: string;
  SC_LIB: string;
  SC_LIBLONG?: string;
  SC_ACTIF?: boolean;
  SC_ORDRE?: number;
}

export interface StatutCreanceApiResponse {
  data: StatutCreance[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface StatutCreanceCreateRequest {
  SC_LIB: string;
  SC_LIBLONG?: string;
  SC_ACTIF?: boolean;
  SC_ORDRE?: number;
}

export interface StatutCreanceUpdateRequest extends Partial<StatutCreanceCreateRequest> {
  SC_CODE: string;
}

