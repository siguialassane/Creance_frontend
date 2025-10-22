import { Classe, ClasseApiResponse, ClasseCreateRequest, ClasseUpdateRequest } from "@/types/classe";
import { ApiClient } from "@/lib/api";

export class ClasseService {
  private static readonly BASE_URL = "/classes";

  static async getAll(apiClient: ApiClient): Promise<ClasseApiResponse> {
    // Utiliser l'endpoint /all pour récupérer toutes les classes sans pagination
    const response = await apiClient.get<ClasseApiResponse>(`${this.BASE_URL}/all`);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<Classe> {
    const response = await apiClient.get<ClasseApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Classe non trouvée");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, classe: ClasseCreateRequest): Promise<ClasseApiResponse> {
    const response = await apiClient.post<ClasseApiResponse>(this.BASE_URL, classe);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, classe: ClasseUpdateRequest): Promise<ClasseApiResponse> {
    const response = await apiClient.put<ClasseApiResponse>(`${this.BASE_URL}/${code}`, classe);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<ClasseApiResponse> {
    const response = await apiClient.delete<ClasseApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<ClasseApiResponse> {
    const response = await apiClient.get<ClasseApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}
