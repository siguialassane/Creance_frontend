import { Journal, JournalApiResponse, JournalCreateRequest, JournalUpdateRequest } from "@/types/journal";

export class JournalService {
  private static readonly BASE_URL = "/journaux";

  static async getAll(apiClient: any): Promise<JournalApiResponse> {
    const response = await apiClient.get(`${JournalService.BASE_URL}`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Journal> {
    const response = await apiClient.get(`${JournalService.BASE_URL}/${code}`);
    // Gérer les deux formats de réponse
    const data = Array.isArray(response.data.data)
      ? response.data.data
      : response.data.data?.content || [];
    if (!data || data.length === 0) {
      throw new Error("Journal non trouvé");
    }
    return data[0];
  }

  static async create(apiClient: any, journal: JournalCreateRequest): Promise<JournalApiResponse> {
    const response = await apiClient.post(JournalService.BASE_URL, journal);
    return response.data;
  }

  static async update(apiClient: any, code: string, journal: JournalUpdateRequest): Promise<JournalApiResponse> {
    const response = await apiClient.put(`${JournalService.BASE_URL}/${code}`, journal);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<JournalApiResponse> {
    const response = await apiClient.delete(`${JournalService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<JournalApiResponse> {
    const response = await apiClient.get(`${JournalService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}
