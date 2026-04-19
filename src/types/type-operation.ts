export interface TypeOperation {
  TYPOPER_CODE: string;
  TYPOPER_LIB: string;
  MODE_PAIE_CODE?: string;
  TYPAIE_CODE?: string;
  LIB_COURT?: string | null;
  code?: string;
  libelle?: string;
  modePaiement?: string;
  typePaiement?: string;
  libelleCourt?: string | null;
  typoper_code?: string;
  typoper_lib?: string;
}

export interface TypeOperationApiResponse {
  data: TypeOperation[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeOperationCreateRequest {
  code: string;
  libelle: string;
  MODE_PAIE_CODE?: string;
  TYPAIE_CODE?: string;
  LIB_COURT?: string;
}

export interface TypeOperationUpdateRequest {
  libelle: string;
  MODE_PAIE_CODE?: string;
  TYPAIE_CODE?: string;
  LIB_COURT?: string;
}
