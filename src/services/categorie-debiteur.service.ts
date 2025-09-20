import { CategorieDebiteur, CategorieDebiteurApiResponse, CategorieDebiteurCreateRequest, CategorieDebiteurUpdateRequest } from "@/types/categorie-debiteur";

export class CategorieDebiteurService {
  private static readonly BASE_URL = "/categories-debiteur";

  static async getAll(apiClient: any): Promise<CategorieDebiteurApiResponse> {
    const response = await apiClient.get<CategorieDebiteurApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<CategorieDebiteur> {
    const response = await apiClient.get<CategorieDebiteurApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Catégorie débiteur non trouvée");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, categorie: CategorieDebiteurCreateRequest): Promise<CategorieDebiteurApiResponse> {
    const response = await apiClient.post<CategorieDebiteurApiResponse>(this.BASE_URL, categorie);
    return response.data;
  }

  static async update(apiClient: any, code: string, categorie: CategorieDebiteurUpdateRequest): Promise<CategorieDebiteurApiResponse> {
    const response = await apiClient.put<CategorieDebiteurApiResponse>(`${this.BASE_URL}/${code}`, categorie);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<CategorieDebiteurApiResponse> {
    const response = await apiClient.delete<CategorieDebiteurApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<CategorieDebiteurApiResponse> {
    const response = await apiClient.get<CategorieDebiteurApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}
