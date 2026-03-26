import { Journal, JournalApiResponse, JournalCreateRequest, JournalUpdateRequest } from "@/types/journal";

export class JournalService {
  private static readonly BASE_URL = "/journaux";

  static async getAll(apiClient: any): Promise<JournalApiResponse> {
    const response = await apiClient.get<JournalApiResponse>(JournalService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Journal> {
    const response = await apiClient.get<JournalApiResponse>(`${JournalService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Journal non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, journal: JournalCreateRequest): Promise<JournalApiResponse> {
    const response = await apiClient.post<JournalApiResponse>(JournalService.BASE_URL, journal);
    return response.data;
  }

  static async update(apiClient: any, code: string, journal: JournalUpdateRequest): Promise<JournalApiResponse> {
    const response = await apiClient.put<JournalApiResponse>(`${JournalService.BASE_URL}/${code}`, journal);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<JournalApiResponse> {
    const response = await apiClient.delete<JournalApiResponse>(`${JournalService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<JournalApiResponse> {
    const response = await apiClient.get<JournalApiResponse>(`${JournalService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

