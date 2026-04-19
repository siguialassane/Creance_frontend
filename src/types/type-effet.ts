export interface TypeEffet {
  TYPEFT_CODE: string;
  TYPEFT_LIB: string;
}

export interface TypeEffetApiResponse {
  data: TypeEffet[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypeEffetCreateRequest {
  code: string;
  libelle: string;
}

export interface TypeEffetUpdateRequest {
  libelle: string;
}
