import { Fonction, FonctionApiResponse, FonctionCreateRequest, FonctionUpdateRequest } from "@/types/fonction";

export class FonctionService {
  private static readonly BASE_URL = "/fonctions";

  static async getAll(apiClient: any): Promise<FonctionApiResponse> {
    const response = await apiClient.get<FonctionApiResponse>(`${this.BASE_URL}/all`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Fonction> {
    const response = await apiClient.get<FonctionApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Fonction non trouvée");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, fonction: FonctionCreateRequest): Promise<FonctionApiResponse> {
    const response = await apiClient.post<FonctionApiResponse>(this.BASE_URL, fonction);
    return response.data;
  }

  static async update(apiClient: any, code: string, fonction: FonctionUpdateRequest): Promise<FonctionApiResponse> {
    const response = await apiClient.put<FonctionApiResponse>(`${this.BASE_URL}/${code}`, fonction);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<FonctionApiResponse> {
    const response = await apiClient.delete<FonctionApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<FonctionApiResponse> {
    const response = await apiClient.get<FonctionApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

