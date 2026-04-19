export interface TypeActe {
  TYPACTE_CODE: string;
  TYPACTE_LIB: string;
  TYPACTE_CODE_PREC?: string | null;
  TYPACTE_DELAI?: number | null;
  TYPACTE_SERV?: number | null;
  TYPACTE_ORD_EMIS?: number | null;
  code?: string;
  libelle?: string;
  precedent?: string | null;
  delai?: number | null;
  service?: number | null;
  ordreEmission?: number | null;
}

export interface TypeActeApiResponse {
  data: TypeActe[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeActeCreateRequest {
  code: string;
  libelle: string;
  TYPACTE_CODE_PREC?: string | null;
  TYPACTE_DELAI?: number | null;
  TYPACTE_SERV?: number | null;
  TYPACTE_ORD_EMIS?: number | null;
}

export interface TypeActeUpdateRequest {
  libelle: string;
  TYPACTE_CODE_PREC?: string | null;
  TYPACTE_DELAI?: number | null;
  TYPACTE_SERV?: number | null;
  TYPACTE_ORD_EMIS?: number | null;
}
