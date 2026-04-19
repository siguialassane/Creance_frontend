export interface TypeCharge {
  TYPCHARG_CODE: string;
  TYPCHARG_LIB: string;
  TYPCHARG_SENS?: string;
  code?: string;
  libelle?: string;
  sens?: string;
}

export interface TypeChargeApiResponse {
  data: TypeCharge[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeChargeCreateRequest {
  code: string;
  libelle: string;
  TYPCHARG_SENS?: string;
}

export interface TypeChargeUpdateRequest {
  libelle: string;
  TYPCHARG_SENS?: string;
}
