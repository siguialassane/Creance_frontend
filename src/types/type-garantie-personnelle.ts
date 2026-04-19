export interface TypeGarantiePersonnelle {
  TYPGAR_PHYS_CODE: string;
  TYPGAR_PHYS_LIB: string;
}

export interface TypeGarantiePersonnelleApiResponse {
  data: TypeGarantiePersonnelle[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeGarantiePersonnelleCreateRequest {
  code: string;
  libelle: string;
}

export interface TypeGarantiePersonnelleUpdateRequest {
  libelle: string;
}
