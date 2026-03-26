import { Fonction, FonctionApiResponse, FonctionCreateRequest, FonctionUpdateRequest } from "@/types/fonction";

export class FonctionService {
  private static readonly BASE_URL = "/fonctions";

  static async getAll(apiClient: any, params?: { page?: number; size?: number; search?: string }): Promise<FonctionApiResponse> {
    const response = await apiClient.get(`${FonctionService.BASE_URL}`, {
      params: params || { page: 0, size: 1000 }, // Pagination côté client, charger tous les éléments par défaut
      timeout: 30000,
    });
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Fonction> {
    const response = await apiClient.get(`${FonctionService.BASE_URL}/${code}`);
    // Gérer les deux formats de réponse
    const data = Array.isArray(response.data.data) 
      ? response.data.data 
      : response.data.data?.content || [];
    if (!data || data.length === 0) {
      throw new Error("Fonction non trouvée");
    }
    return data[0];
  }

  static async create(apiClient: any, fonction: FonctionCreateRequest): Promise<FonctionApiResponse> {
    const response = await apiClient.post(FonctionService.BASE_URL, fonction);
    return response.data;
  }

  static async update(apiClient: any, code: string, fonction: FonctionUpdateRequest): Promise<FonctionApiResponse> {
    const response = await apiClient.put(`${FonctionService.BASE_URL}/${code}`, fonction);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<FonctionApiResponse> {
    const response = await apiClient.delete(`${FonctionService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<FonctionApiResponse> {
    const response = await apiClient.get(`${FonctionService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

