export interface ModeAcquisition {
  MA_CODE: string;
  MA_LIB: string;
  MA_LIBLONG?: string;
  MA_ACTIF?: boolean;
  MA_ORDRE?: number;
}

export interface ModeAcquisitionApiResponse {
  data: ModeAcquisition[];
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
  MA_LIB: string;
  MA_LIBLONG?: string;
  MA_ACTIF?: boolean;
  MA_ORDRE?: number;
}

export interface ModeAcquisitionUpdateRequest extends Partial<ModeAcquisitionCreateRequest> {
  MA_CODE: string;
}

