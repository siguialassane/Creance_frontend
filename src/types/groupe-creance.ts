export interface GroupeCreance {
  GRP_CREAN_CODE: string;
  ENTITE_CODE: string;
  GRP_CREAN_LIB: string;
  GRP_CREAN_LIB_LONG?: string;
  HIERACHIE?: number;
}

export interface GroupeCreanceApiResponse {
  data: GroupeCreance[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface GroupeCreanceCreateRequest {
  GRP_CREAN_CODE: string;
  ENTITE_CODE: string;
  GRP_CREAN_LIB: string;
  GRP_CREAN_LIB_LONG?: string;
  HIERACHIE?: number;
}

export interface GroupeCreanceUpdateRequest extends Partial<GroupeCreanceCreateRequest> {
  // GRP_CREAN_CODE is used in the URL path, not in the body
}






