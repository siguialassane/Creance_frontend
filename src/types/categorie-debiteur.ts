export interface CategorieDebiteur {
  CATEG_DEB_CODE: string;
  CATEG_DEB_LIB: string;
  CATEG_DEB_DESC: string | null;
  CATEG_DEB_ACTIF: boolean;
  CATEG_DEB_ORDRE: number | null;
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
  CATEG_DEB_LIB: string;
  CATEG_DEB_DESC?: string;
  CATEG_DEB_ACTIF?: boolean;
  CATEG_DEB_ORDRE?: number;
}

export interface CategorieDebiteurUpdateRequest extends Partial<CategorieDebiteurCreateRequest> {
  CATEG_DEB_CODE: string;
}
