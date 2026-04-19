export interface TypeLogement {
  TYPE_LOGE_CODE: string;
  TYPE_LOGE_LIB: string;
  TYPE_LOGE_LIB_LONG?: string | null;
  TYPE_LOGE_NUM?: string | null;
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
  code: string;
  libelle: string;
  TYPE_LOGE_LIB_LONG?: string;
  TYPE_LOGE_NUM?: string;
}

export interface TypeLogementUpdateRequest {
  libelle: string;
  TYPE_LOGE_LIB_LONG?: string;
  TYPE_LOGE_NUM?: string;
}
