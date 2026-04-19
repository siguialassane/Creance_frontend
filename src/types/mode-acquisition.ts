export interface ModeAcquisition {
  MODAC_CODE: string;
  MODAC_LIB: string;
}

export interface ModeAcquisitionApiResponse {
  data: ModeAcquisition | ModeAcquisition[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface ModeAcquisitionCreateRequest {
  MODAC_CODE: string;
  MODAC_LIB: string;
}

export interface ModeAcquisitionUpdateRequest extends Partial<ModeAcquisitionCreateRequest> {
  // MODAC_CODE is used in the URL path, not in the body
}
