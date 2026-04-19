export interface Quartier {
  QUART_CODE: string;
  ZONE_CODE?: string;
  VILLE_CODE: string;
  QUART_LIB?: string;
  QUART_LIB_LONG?: string;
  QUART_NUM?: string;
}

export interface QuartierApiResponse {
  data: Quartier[] | { content: Quartier[]; totalElements: number; totalPages: number };
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface QuartierCreateRequest {
  QUART_CODE: string;
  VILLE_CODE: string;
  QUART_LIB: string;
  ZONE_CODE?: string;
  QUART_LIB_LONG?: string;
  QUART_NUM?: string;
}

export interface QuartierUpdateRequest {
  VILLE_CODE: string;
  QUART_LIB: string;
  ZONE_CODE?: string;
  QUART_LIB_LONG?: string;
  QUART_NUM?: string;
}

