export interface TypeCharge {
  TYPCHARG_CODE: string;
  TYPCHARG_LIB: string;
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
  TYPCHARG_CODE: string;
  TYPCHARG_LIB: string;
}

export interface TypeChargeUpdateRequest {
  TYPCHARG_LIB: string;
}
