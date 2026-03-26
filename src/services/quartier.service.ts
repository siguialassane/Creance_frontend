import { Quartier, QuartierApiResponse, QuartierCreateRequest, QuartierUpdateRequest } from "@/types/quartier";

export class QuartierService {
  private static readonly BASE_URL = "/quartiers";

  static async getAll(apiClient: any): Promise<any> {
    const response = await apiClient.get(`${QuartierService.BASE_URL}`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Quartier> {
    const response = await apiClient.get(`${QuartierService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Quartier non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, quartier: QuartierCreateRequest): Promise<any> {
    const response = await apiClient.post(QuartierService.BASE_URL, quartier);
    return response.data;
  }

  static async update(apiClient: any, code: string, quartier: QuartierUpdateRequest): Promise<any> {
    const response = await apiClient.put(`${QuartierService.BASE_URL}/${code}`, quartier);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<any> {
    const response = await apiClient.delete(`${QuartierService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<any> {
    const response = await apiClient.get(`${QuartierService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

