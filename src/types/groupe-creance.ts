export interface GroupeCreance {
  GC_CODE: string;
  GC_LIB: string;
  GC_LIBLONG?: string;
  GC_ACTIF?: boolean;
  GC_ORDRE?: number;
}

export interface GroupeCreanceApiResponse {
  data: GroupeCreance[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface GroupeCreanceCreateRequest {
  GC_LIB: string;
  GC_LIBLONG?: string;
  GC_ACTIF?: boolean;
  GC_ORDRE?: number;
}

export interface GroupeCreanceUpdateRequest extends Partial<GroupeCreanceCreateRequest> {
  GC_CODE: string;
}



