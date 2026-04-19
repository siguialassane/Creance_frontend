export interface Journal {
  CODE_JOURNAL: number;
  LIB_JOURNAL: string;
}

export interface JournalApiResponse {
  data: {
    content?: Journal[];
    totalElements?: number;
    totalPages?: number;
    size?: number;
    number?: number;
    first?: boolean;
    last?: boolean;
  } | Journal[];
  message?: string;
  status?: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp?: string;
}

export interface JournalCreateRequest {
  CODE_JOURNAL: number;
  LIB_JOURNAL: string;
}

export interface JournalUpdateRequest {
  LIB_JOURNAL: string;
}
