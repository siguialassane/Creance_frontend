export interface CategorieDebiteur {
  CATEG_DEB_CODE: string;
  CATEG_DEB_LIB: string;
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
  CATEG_DEB_CODE: string;
  CATEG_DEB_LIB: string;
}

export interface CategorieDebiteurUpdateRequest {
  CATEG_DEB_LIB: string;
}
