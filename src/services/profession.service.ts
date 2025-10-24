import { Profession, ProfessionApiResponse, ProfessionCreateRequest, ProfessionUpdateRequest } from "@/types/profession";

export class ProfessionService {
  private static readonly BASE_URL = "/professions";

  static async getAll(apiClient: any): Promise<any> {
    const response = await apiClient.get(`${this.BASE_URL}`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Profession> {
    const response = await apiClient.get(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Profession non trouvée");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, profession: ProfessionCreateRequest): Promise<any> {
    const response = await apiClient.post(this.BASE_URL, profession);
    return response.data;
  }

  static async update(apiClient: any, code: string, profession: ProfessionUpdateRequest): Promise<any> {
    const response = await apiClient.put(`${this.BASE_URL}/${code}`, profession);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<any> {
    const response = await apiClient.delete(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<any> {
    const response = await apiClient.get(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

