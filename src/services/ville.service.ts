import { Ville, VilleApiResponse, VilleCreateRequest, VilleUpdateRequest } from "@/types/ville";

export class VilleService {
  private static readonly BASE_URL = "/villes";

  static async getAll(apiClient: any): Promise<VilleApiResponse> {
    const response = await apiClient.get<VilleApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Ville> {
    const response = await apiClient.get<VilleApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Ville non trouvée");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, ville: VilleCreateRequest): Promise<VilleApiResponse> {
    const response = await apiClient.post<VilleApiResponse>(this.BASE_URL, ville);
    return response.data;
  }

  static async update(apiClient: any, code: string, ville: VilleUpdateRequest): Promise<VilleApiResponse> {
    const response = await apiClient.put<VilleApiResponse>(`${this.BASE_URL}/${code}`, ville);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<VilleApiResponse> {
    const response = await apiClient.delete<VilleApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<VilleApiResponse> {
    const response = await apiClient.get<VilleApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

