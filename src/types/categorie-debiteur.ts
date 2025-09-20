export interface CategorieDebiteur {
  CD_CODE: string;
  CD_LIB: string;
  CD_DESC: string | null;
  CD_ACTIF: boolean;
  CD_ORDRE: number | null;
}

export interface CategorieDebiteurApiResponse {
  data: CategorieDebiteur[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface CategorieDebiteurCreateRequest {
  CD_LIB: string;
  CD_DESC?: string;
  CD_ACTIF?: boolean;
  CD_ORDRE?: number;
}

export interface CategorieDebiteurUpdateRequest extends Partial<CategorieDebiteurCreateRequest> {
  CD_CODE: string;
}
