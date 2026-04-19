export interface Profession {
  PROFES_CODE: string;
  PROFES_LIB: string | null;
  PROFES_LIB_LONG: string | null;
  PROFES_NUM: string | null;
}

export interface ProfessionApiResponse {
  data: Profession | Profession[] | {
    content?: Profession[];
    totalElements?: number;
    totalPages?: number;
    size?: number;
    number?: number;
  };
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
  PROFES_CODE: string;
  PROFES_LIB: string;
  PROFES_LIB_LONG?: string | null;
  PROFES_NUM?: string | null;
}

export interface ProfessionUpdateRequest extends Partial<ProfessionCreateRequest> {}

