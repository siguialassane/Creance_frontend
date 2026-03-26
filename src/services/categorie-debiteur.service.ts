import { CategorieDebiteur, CategorieDebiteurApiResponse, CategorieDebiteurCreateRequest, CategorieDebiteurUpdateRequest } from "@/types/categorie-debiteur";
import { ApiClient } from "@/lib/api";

export class CategorieDebiteurService {
  private static readonly BASE_URL = "/categories-debiteur";

  static async getAll(apiClient: ApiClient): Promise<CategorieDebiteurApiResponse> {
    const response = await apiClient.get<CategorieDebiteurApiResponse>(CategorieDebiteurService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<CategorieDebiteur> {
    const response = await apiClient.get<CategorieDebiteurApiResponse>(`${CategorieDebiteurService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Catégorie débiteur non trouvée");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, categorie: CategorieDebiteurCreateRequest): Promise<CategorieDebiteurApiResponse> {
    const response = await apiClient.post<CategorieDebiteurApiResponse>(CategorieDebiteurService.BASE_URL, categorie);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, categorie: CategorieDebiteurUpdateRequest): Promise<CategorieDebiteurApiResponse> {
    const response = await apiClient.put<CategorieDebiteurApiResponse>(`${CategorieDebiteurService.BASE_URL}/${code}`, categorie);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<CategorieDebiteurApiResponse> {
    const response = await apiClient.delete<CategorieDebiteurApiResponse>(`${CategorieDebiteurService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<CategorieDebiteurApiResponse> {
    const response = await apiClient.get<CategorieDebiteurApiResponse>(`${CategorieDebiteurService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}
