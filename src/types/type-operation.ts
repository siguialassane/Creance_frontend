export interface TypeOperation {
  TYPOPER_CODE: string;
  TYPOPER_LIB: string;
  MODE_PAIE_CODE?: string;
  TYPAIE_CODE?: string;
  LIB_COURT?: string | null;
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
  TYPOPER_CODE: string;
  TYPOPER_LIB: string;
}

export interface TypeOperationUpdateRequest {
  TYPOPER_LIB: string;
}
