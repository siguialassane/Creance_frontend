import { StatutSalarie, StatutSalarieApiResponse, StatutSalarieCreateRequest, StatutSalarieUpdateRequest } from "@/types/statut-salarie";

export class StatutSalarieService {
  private static readonly BASE_URL = "/statut-salaries";

  static async getAll(apiClient: any): Promise<any> {
    const response = await apiClient.get(`${StatutSalarieService.BASE_URL}`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<StatutSalarie> {
    const response = await apiClient.get(`${StatutSalarieService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Statut salarié non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, statut: StatutSalarieCreateRequest): Promise<any> {
    const response = await apiClient.post(StatutSalarieService.BASE_URL, statut);
    return response.data;
  }

  static async update(apiClient: any, code: string, statut: StatutSalarieUpdateRequest): Promise<any> {
    const response = await apiClient.put(`${StatutSalarieService.BASE_URL}/${code}`, statut);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<any> {
    const response = await apiClient.delete(`${StatutSalarieService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<any> {
    const response = await apiClient.get(`${StatutSalarieService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

