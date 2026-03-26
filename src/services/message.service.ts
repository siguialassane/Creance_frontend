import { Message, MessageApiResponse, MessageCreateRequest, MessageUpdateRequest } from "@/types/message";

export class MessageService {
  private static readonly BASE_URL = "/messages";

  static async getAll(apiClient: any): Promise<MessageApiResponse> {
    const response = await apiClient.get<MessageApiResponse>(MessageService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Message> {
    const response = await apiClient.get<MessageApiResponse>(`${MessageService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Message non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, message: MessageCreateRequest): Promise<MessageApiResponse> {
    const response = await apiClient.post<MessageApiResponse>(MessageService.BASE_URL, message);
    return response.data;
  }

  static async update(apiClient: any, code: string, message: MessageUpdateRequest): Promise<MessageApiResponse> {
    const response = await apiClient.put<MessageApiResponse>(`${MessageService.BASE_URL}/${code}`, message);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<MessageApiResponse> {
    const response = await apiClient.delete<MessageApiResponse>(`${MessageService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<MessageApiResponse> {
    const response = await apiClient.get<MessageApiResponse>(`${MessageService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

