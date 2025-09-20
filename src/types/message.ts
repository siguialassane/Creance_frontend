export interface Message {
  MSG_CODE: string;
  MSG_LIB: string;
  MSG_LIBLONG?: string;
  MSG_ACTIF?: boolean;
  MSG_ORDRE?: number;
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
  MSG_LIB: string;
  MSG_LIBLONG?: string;
  MSG_ACTIF?: boolean;
  MSG_ORDRE?: number;
}

export interface MessageUpdateRequest extends Partial<MessageCreateRequest> {
  MSG_CODE: string;
}

