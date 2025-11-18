export interface Quartier {
  Q_CODE: string;
  Q_LIB: string;
  Q_LIBLONG?: string;
  Q_ACTIF?: boolean;
  Q_ORDRE?: number;
}

export interface QuartierApiResponse {
  data: Quartier[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface QuartierCreateRequest {
  Q_LIB: string;
  Q_LIBLONG?: string;
  Q_ACTIF?: boolean;
  Q_ORDRE?: number;
}

export interface QuartierUpdateRequest extends Partial<QuartierCreateRequest> {
  Q_CODE: string;
}

