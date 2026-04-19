export interface PosteComptable {
  PC_CODE: string;
  PC_LIB?: string | null;
  TYPE_PC_NUM?: number | null;
  PC_SITGEO?: string | null;
  PC_VILLE?: string | null;
  PC_REM?: string | null;
}

export interface PosteComptableApiResponse {
  data: PosteComptable | PosteComptable[];
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
  PC_CODE: string;
  PC_LIB?: string | null;
  TYPE_PC_NUM?: number | null;
  PC_SITGEO?: string | null;
  PC_VILLE?: string | null;
  PC_REM?: string | null;
}

export interface PosteComptableUpdateRequest extends Partial<PosteComptableCreateRequest> {}

