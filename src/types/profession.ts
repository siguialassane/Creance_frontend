export interface Profession {
  PROF_CODE: string;
  PROF_LIB: string;
  PROF_LIBLONG?: string;
  PROF_ACTIF?: boolean;
  PROF_ORDRE?: number;
}

export interface ProfessionApiResponse {
  data: Profession[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface ProfessionCreateRequest {
  PROF_LIB: string;
  PROF_LIBLONG?: string;
  PROF_ACTIF?: boolean;
  PROF_ORDRE?: number;
}

export interface ProfessionUpdateRequest extends Partial<ProfessionCreateRequest> {
  PROF_CODE: string;
}

