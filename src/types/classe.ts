export interface Classe {
  CL_CODE: string;
  CL_LIB: string;
  CL_DESC: string | null;
  CL_ACTIF: boolean;
  CL_ORDRE: number | null;
}

export interface ClasseApiResponse {
  data: Classe[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface ClasseCreateRequest {
  CL_LIB: string;
  CL_DESC?: string;
  CL_ACTIF?: boolean;
  CL_ORDRE?: number;
}

export interface ClasseUpdateRequest extends Partial<ClasseCreateRequest> {
  CL_CODE: string;
}
