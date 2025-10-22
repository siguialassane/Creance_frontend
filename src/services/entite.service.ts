import { Entite, EntiteApiResponse, EntiteCreateRequest, EntiteUpdateRequest } from "@/types/entite";

export class EntiteService {
  private static readonly BASE_URL = "/entites";

  static async getAll(apiClient: any): Promise<EntiteApiResponse> {
    const response = await apiClient.get<EntiteApiResponse>(`${this.BASE_URL}/all`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Entite> {
    const response = await apiClient.get<EntiteApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Entité non trouvée");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, entite: EntiteCreateRequest): Promise<EntiteApiResponse> {
    const response = await apiClient.post<EntiteApiResponse>(this.BASE_URL, entite);
    return response.data;
  }

  static async update(apiClient: any, code: string, entite: EntiteUpdateRequest): Promise<EntiteApiResponse> {
    const response = await apiClient.put<EntiteApiResponse>(`${this.BASE_URL}/${code}`, entite);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<EntiteApiResponse> {
    const response = await apiClient.delete<EntiteApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<EntiteApiResponse> {
    const response = await apiClient.get<EntiteApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

