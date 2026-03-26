import { CompteOperation, CompteOperationApiResponse, CompteOperationCreateRequest, CompteOperationUpdateRequest } from "@/types/compte-operation";

export class CompteOperationService {
  private static readonly BASE_URL = "/comptes-operation";

  static async getAll(apiClient: any, params?: { page?: number; size?: number }): Promise<CompteOperationApiResponse> {
    const response = await apiClient.get(`${CompteOperationService.BASE_URL}`, {
      params: params || { page: 0, size: 1000 }, // Pagination côté client, charger tous les éléments
      timeout: 30000,
    });
    return response.data;
  }

  static async getByCode(apiClient: any, code: string | number): Promise<CompteOperation> {
    const response = await apiClient.get(`${CompteOperationService.BASE_URL}/${code}`);
    // Gérer les deux formats de réponse
    const data = Array.isArray(response.data.data) 
      ? response.data.data 
      : response.data.data?.content || [];
    if (!data || data.length === 0) {
      throw new Error("Compte d'opération non trouvé");
    }
    return data[0];
  }

  static async create(apiClient: any, compte: CompteOperationCreateRequest): Promise<CompteOperationApiResponse> {
    const response = await apiClient.post(CompteOperationService.BASE_URL, compte);
    return response.data;
  }

  static async update(apiClient: any, code: string, compte: CompteOperationUpdateRequest): Promise<CompteOperationApiResponse> {
    const response = await apiClient.put(`${CompteOperationService.BASE_URL}/${code}`, compte);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<CompteOperationApiResponse> {
    const response = await apiClient.delete(`${CompteOperationService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<CompteOperationApiResponse> {
    const response = await apiClient.get(`${CompteOperationService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

