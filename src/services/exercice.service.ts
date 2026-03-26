import { Exercice, ExerciceApiResponse, ExerciceCreateRequest, ExerciceUpdateRequest } from "@/types/exercice";

export class ExerciceService {
  private static readonly BASE_URL = "/exercices";

  static async getAll(apiClient: any, params?: { page?: number; size?: number }): Promise<ExerciceApiResponse> {
    const response = await apiClient.get(`${ExerciceService.BASE_URL}`, {
      params: params || { page: 0, size: 1000 }, // Pagination côté client, charger tous les éléments
      timeout: 30000,
    });
    return response.data;
  }

  static async getByCode(apiClient: any, code: string | number): Promise<Exercice> {
    const response = await apiClient.get(`${ExerciceService.BASE_URL}/${code}`);
    // Gérer les deux formats de réponse
    const data = Array.isArray(response.data.data) 
      ? response.data.data 
      : response.data.data?.content || [];
    if (!data || data.length === 0) {
      throw new Error("Exercice non trouvé");
    }
    return data[0];
  }

  static async create(apiClient: any, exercice: ExerciceCreateRequest): Promise<ExerciceApiResponse> {
    const response = await apiClient.post(ExerciceService.BASE_URL, exercice);
    return response.data;
  }

  static async update(apiClient: any, code: string, exercice: ExerciceUpdateRequest): Promise<ExerciceApiResponse> {
    const response = await apiClient.put(`${ExerciceService.BASE_URL}/${code}`, exercice);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<ExerciceApiResponse> {
    const response = await apiClient.delete(`${ExerciceService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<ExerciceApiResponse> {
    const response = await apiClient.get(`${ExerciceService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

