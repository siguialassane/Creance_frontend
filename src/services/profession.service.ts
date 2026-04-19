import { Profession, ProfessionApiResponse, ProfessionCreateRequest, ProfessionUpdateRequest } from "@/types/profession";

export class ProfessionService {
  private static readonly BASE_URL = "/professions";

  static async getAll(apiClient: any): Promise<ProfessionApiResponse> {
    const response = await apiClient.get(`${ProfessionService.BASE_URL}/all`);
    return response.data;
  }

  static async getAllPaginated(apiClient: any, params: {
    page?: number;
    size?: number;
    search?: string;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<ProfessionApiResponse> {
    const response = await apiClient.get(`${ProfessionService.BASE_URL}`, {
      params: {
        page: params.page || 0,
        size: params.size || 50,
        ...(params.search && { search: params.search }),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
      },
    });
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Profession> {
    const response = await apiClient.get(`${ProfessionService.BASE_URL}/${code}`);
    if (!response.data.data || Array.isArray(response.data.data)) {
      throw new Error("Profession non trouvée");
    }
    return response.data.data;
  }

  static async create(apiClient: any, profession: ProfessionCreateRequest): Promise<any> {
    const response = await apiClient.post(ProfessionService.BASE_URL, profession);
    return response.data;
  }

  static async update(apiClient: any, code: string, profession: ProfessionUpdateRequest): Promise<any> {
    const response = await apiClient.put(`${ProfessionService.BASE_URL}/${code}`, profession);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<any> {
    const response = await apiClient.delete(`${ProfessionService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<any> {
    const response = await apiClient.get(`${ProfessionService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}

