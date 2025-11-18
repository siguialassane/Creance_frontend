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
  TYPGAR_PHYS_CODE: string;
  TYPGAR_PHYS_LIB: string;
}

export interface TypeGarantiePersonnelleUpdateRequest {
  TYPGAR_PHYS_LIB: string;
}
