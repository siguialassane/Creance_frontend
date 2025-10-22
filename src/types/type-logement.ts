export interface TypeLogement {
  TYPE_LOGE_CODE: string;
  TYPE_LOGE_LIB: string;
}

export interface TypeLogementApiResponse {
  data: TypeLogement[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeLogementCreateRequest {
  TYPE_LOGE_CODE: string;
  TYPE_LOGE_LIB: string;
}

export interface TypeLogementUpdateRequest {
  TYPE_LOGE_LIB: string;
}
