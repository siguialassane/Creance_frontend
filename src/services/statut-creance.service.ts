import { StatutCreance, StatutCreanceApiResponse, StatutCreanceCreateRequest, StatutCreanceUpdateRequest } from "@/types/statut-creance";

export class StatutCreanceService {
  private static readonly BASE_URL = "/statuts-creance";

  static async getAll(apiClient: any): Promise<StatutCreanceApiResponse> {
    const response = await apiClient.get<StatutCreanceApiResponse>(StatutCreanceService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<StatutCreance> {
    const response = await apiClient.get<StatutCreanceApiResponse>(`${StatutCreanceService.BASE_URL}/${code}`);
    const data = response.data.data;
    if (!data || Array.isArray(data)) {
      throw new Error("Statut créance non trouvé");
    }
    return data;
  }

  static async create(apiClient: any, statut: StatutCreanceCreateRequest): Promise<StatutCreanceApiResponse> {
    const response = await apiClient.post<StatutCreanceApiResponse>(StatutCreanceService.BASE_URL, statut);
    return response.data;
  }

  static async update(apiClient: any, code: string, statut: StatutCreanceUpdateRequest): Promise<StatutCreanceApiResponse> {
    const response = await apiClient.put<StatutCreanceApiResponse>(`${StatutCreanceService.BASE_URL}/${code}`, statut);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<StatutCreanceApiResponse> {
    const response = await apiClient.delete<StatutCreanceApiResponse>(`${StatutCreanceService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<StatutCreanceApiResponse> {
    const response = await apiClient.get<StatutCreanceApiResponse>(`${StatutCreanceService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}

