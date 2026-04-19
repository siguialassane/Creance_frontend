export interface Banque {
  BQ_CODE: string;
  BQ_LIB: string;
  CPTOPER_CODE: string | null;
  BQAG: string | null;
  BQ_RESPONS: string | null;
  BQ_ADRESS: string | null;
  BQ_CONTACT: string | null;
  BQ_LIBLONG: string | null;
  BQ_SIGLE: string | null;
  BQ_AUTLIB: string | null;
}

export interface BanqueApiResponse {
  data: Banque[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface BanqueCreateRequest {
  BQ_CODE: string;
  BQ_LIB: string;
  CPTOPER_CODE?: string | null;
  BQAG?: string | null;
  BQ_RESPONS?: string | null;
  BQ_ADRESS?: string | null;
  BQ_CONTACT?: string | null;
  BQ_LIBLONG?: string | null;
  BQ_SIGLE?: string | null;
  BQ_AUTLIB?: string | null;
}

export interface BanqueUpdateRequest extends Partial<BanqueCreateRequest> {}


