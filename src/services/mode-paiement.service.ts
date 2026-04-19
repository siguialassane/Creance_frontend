import { ModePaiement, ModePaiementApiResponse, ModePaiementCreateRequest, ModePaiementUpdateRequest } from "@/types/mode-paiement";

export class ModePaiementService {
  private static readonly BASE_URL = "/mode-paiements";

  static async getAll(apiClient: any): Promise<ModePaiementApiResponse> {
    const response = await apiClient.get(`${ModePaiementService.BASE_URL}`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<ModePaiement> {
    const response = await apiClient.get(`${ModePaiementService.BASE_URL}/${code}`);
    const data = Array.isArray(response.data.data)
      ? response.data.data
      : response.data.data?.content || [];
    if (!data || data.length === 0) {
      throw new Error("Mode de paiement non trouvé");
    }
    return data[0];
  }

  static async create(apiClient: any, mode: ModePaiementCreateRequest): Promise<ModePaiementApiResponse> {
    const response = await apiClient.post(ModePaiementService.BASE_URL, mode);
    return response.data;
  }

  static async update(apiClient: any, code: string, mode: ModePaiementUpdateRequest): Promise<ModePaiementApiResponse> {
    const response = await apiClient.put(`${ModePaiementService.BASE_URL}/${code}`, mode);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<ModePaiementApiResponse> {
    const response = await apiClient.delete(`${ModePaiementService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<ModePaiementApiResponse> {
    const response = await apiClient.get(`${ModePaiementService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}
