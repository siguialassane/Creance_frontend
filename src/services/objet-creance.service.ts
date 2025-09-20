import { ObjetCreance, ObjetCreanceApiResponse, ObjetCreanceCreateRequest, ObjetCreanceUpdateRequest } from "@/types/objet-creance";

export class ObjetCreanceService {
  private static readonly BASE_URL = "/objets-creance";

  static async getAll(apiClient: any): Promise<ObjetCreanceApiResponse> {
    const response = await apiClient.get<ObjetCreanceApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<ObjetCreance> {
    const response = await apiClient.get<ObjetCreanceApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Objet créance non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, objet: ObjetCreanceCreateRequest): Promise<ObjetCreanceApiResponse> {
    const response = await apiClient.post<ObjetCreanceApiResponse>(this.BASE_URL, objet);
    return response.data;
  }

  static async update(apiClient: any, code: string, objet: ObjetCreanceUpdateRequest): Promise<ObjetCreanceApiResponse> {
    const response = await apiClient.put<ObjetCreanceApiResponse>(`${this.BASE_URL}/${code}`, objet);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<ObjetCreanceApiResponse> {
    const response = await apiClient.delete<ObjetCreanceApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<ObjetCreanceApiResponse> {
    const response = await apiClient.get<ObjetCreanceApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

