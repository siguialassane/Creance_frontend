export interface ModePaiement {
  TYP_PAIE_CODE: string;
  TYP_PAIE_LIB: string;
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
  TYP_PAIE_CODE: string;
  TYP_PAIE_LIB: string;
}

export interface ModePaiementUpdateRequest {
  TYP_PAIE_LIB: string;
}
