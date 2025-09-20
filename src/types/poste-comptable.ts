export interface PosteComptable {
  PC_CODE: string;
  PC_LIB: string;
  PC_LIBLONG?: string;
  PC_ACTIF?: boolean;
  PC_ORDRE?: number;
}

export interface PosteComptableApiResponse {
  data: PosteComptable[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface PosteComptableCreateRequest {
  PC_LIB: string;
  PC_LIBLONG?: string;
  PC_ACTIF?: boolean;
  PC_ORDRE?: number;
}

export interface PosteComptableUpdateRequest extends Partial<PosteComptableCreateRequest> {
  PC_CODE: string;
}

