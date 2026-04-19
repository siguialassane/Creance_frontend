export interface TypeGarantieReelle {
  TYPGAR_REEL_CODE: string;
  TYPGAR_REEL_LIB: string;
}

export interface TypeGarantieReelleApiResponse {
  data: TypeGarantieReelle[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeGarantieReelleCreateRequest {
  code: string;
  libelle: string;
}

export interface TypeGarantieReelleUpdateRequest {
  libelle: string;
}
