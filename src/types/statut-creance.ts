export interface StatutCreance {
  STAT_CODE: string;
  STAT_LIB: string | null;
}

export interface StatutCreanceApiResponse {
  data: StatutCreance | StatutCreance[];
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
  STAT_CODE: string;
  STAT_LIB?: string | null;
}

export interface StatutCreanceUpdateRequest extends Partial<StatutCreanceCreateRequest> {}

