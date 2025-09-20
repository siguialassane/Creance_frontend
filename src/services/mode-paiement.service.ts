import { ModePaiement, ModePaiementApiResponse, ModePaiementCreateRequest, ModePaiementUpdateRequest } from "@/types/mode-paiement";

export class ModePaiementService {
  private static readonly BASE_URL = "/modes-paiement";

  static async getAll(apiClient: any): Promise<ModePaiementApiResponse> {
    const response = await apiClient.get<ModePaiementApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<ModePaiement> {
    const response = await apiClient.get<ModePaiementApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Mode de paiement non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, mode: ModePaiementCreateRequest): Promise<ModePaiementApiResponse> {
    const response = await apiClient.post<ModePaiementApiResponse>(this.BASE_URL, mode);
    return response.data;
  }

  static async update(apiClient: any, code: string, mode: ModePaiementUpdateRequest): Promise<ModePaiementApiResponse> {
    const response = await apiClient.put<ModePaiementApiResponse>(`${this.BASE_URL}/${code}`, mode);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<ModePaiementApiResponse> {
    const response = await apiClient.delete<ModePaiementApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<ModePaiementApiResponse> {
    const response = await apiClient.get<ModePaiementApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

