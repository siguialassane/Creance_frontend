import { Nationalite, NationaliteApiResponse, NationaliteCreateRequest, NationaliteUpdateRequest } from "@/types/nationalite";

export class NationaliteService {
  private static readonly BASE_URL = "/nationalites";

  static async getAll(apiClient: any): Promise<any> {
    const response = await apiClient.get(`${NationaliteService.BASE_URL}`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Nationalite> {
    const response = await apiClient.get(`${NationaliteService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Nationalité non trouvée");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, nationalite: NationaliteCreateRequest): Promise<any> {
    const response = await apiClient.post(NationaliteService.BASE_URL, nationalite);
    return response.data;
  }

  static async update(apiClient: any, code: string, nationalite: NationaliteUpdateRequest): Promise<any> {
    const response = await apiClient.put(`${NationaliteService.BASE_URL}/${code}`, nationalite);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<any> {
    const response = await apiClient.delete(`${NationaliteService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<any> {
    const response = await apiClient.get(`${NationaliteService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

