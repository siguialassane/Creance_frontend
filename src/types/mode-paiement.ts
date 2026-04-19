export interface ModePaiement {
  MODE_PAIE_CODE: string;
  MODE_PAIE_LIB: string;
}

export interface ModePaiementApiResponse {
  data: {
    content?: ModePaiement[];
    totalElements?: number;
    totalPages?: number;
    size?: number;
    number?: number;
    first?: boolean;
    last?: boolean;
  } | ModePaiement[];
  message?: string;
  status?: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp?: string;
}

export interface ModePaiementCreateRequest {
  MODE_PAIE_CODE: string;
  MODE_PAIE_LIB: string;
}

export interface ModePaiementUpdateRequest {
  MODE_PAIE_LIB: string;
}
