export interface TypeAuxiliaire {
  TYPAUXI_CODE: string;
  TYPAUXI_LIB: string;
}

export interface TypeAuxiliaireApiResponse {
  data: TypeAuxiliaire[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeAuxiliaireCreateRequest {
  code: string;
  libelle: string;
}

export interface TypeAuxiliaireUpdateRequest {
  libelle: string;
}
