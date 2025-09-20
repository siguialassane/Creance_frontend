export interface ModePaiement {
  MP_CODE: string;
  MP_LIB: string;
  MP_LIBLONG?: string;
  MP_ACTIF?: boolean;
  MP_ORDRE?: number;
}

export interface ModePaiementApiResponse {
  data: ModePaiement[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface ModePaiementCreateRequest {
  MP_LIB: string;
  MP_LIBLONG?: string;
  MP_ACTIF?: boolean;
  MP_ORDRE?: number;
}

export interface ModePaiementUpdateRequest extends Partial<ModePaiementCreateRequest> {
  MP_CODE: string;
}

