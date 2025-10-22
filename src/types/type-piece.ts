export interface TypePiece {
  TYPE_PIECE_CODE: string;
  TYPE_PIECE_LIB: string;
}

export interface TypePieceApiResponse {
  data: TypePiece[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface TypePieceCreateRequest {
  TYPE_PIECE_CODE: string;
  TYPE_PIECE_LIB: string;
}

export interface TypePieceUpdateRequest {
  TYPE_PIECE_LIB: string;
}
