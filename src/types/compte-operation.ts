export interface CompteOperation {
  CPT_OPER_NUM: number;
  TYPOPER_CODE?: string;
  PLAN_CPTA_NUM?: number;
  CODE_JOURNAL?: string;
  CPT_OPER_SENS?: string;
  GRP_CREAN_CODE?: string;
  GRP_SONAR?: string | null;
  USAGE_CODE?: string;
  // Anciens champs pour compatibilité
  CO_CODE?: string;
  CO_LIB?: string;
  CO_LIBLONG?: string;
  CO_ACTIF?: boolean;
  CO_ORDRE?: number;
}

export interface CompteOperationApiResponse {
  data: {
    content?: CompteOperation[];
    totalElements?: number;
    totalPages?: number;
    size?: number;
    number?: number;
    first?: boolean;
    last?: boolean;
  } | CompteOperation[];
  message?: string;
  status?: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp?: string;
}

export interface CompteOperationCreateRequest {
  CO_LIB: string;
  CO_LIBLONG?: string;
  CO_ACTIF?: boolean;
  CO_ORDRE?: number;
}

export interface CompteOperationUpdateRequest extends Partial<CompteOperationCreateRequest> {
  CO_CODE: string;
}






