export interface Message {
  CODE_MESSAGE: string;
  LIBELLE_MESSAGE: string;
}

export interface MessageApiResponse {
  data: Message[];
  message: string;
  status: string;
  error?: {
    code: string;
    details: string;
    path: string;
  };
  timestamp: string;
}

export interface MessageCreateRequest {
  CODE_MESSAGE: string;
  LIBELLE_MESSAGE: string;
}

export interface MessageUpdateRequest extends Partial<MessageCreateRequest> {
  // CODE_MESSAGE is used in the URL path, not in the body
}
