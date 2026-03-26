import { ModePaiement, ModePaiementApiResponse, ModePaiementCreateRequest, ModePaiementUpdateRequest } from "@/types/mode-paiement";
import { ApiClient } from "@/lib/api";

export class ModePaiementService {
  private static readonly BASE_URL = "/types/AC_TYPE_PAIEMENT";

  static async getAll(apiClient: ApiClient): Promise<ModePaiementApiResponse> {
    const response = await apiClient.get<ModePaiementApiResponse>(ModePaiementService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<ModePaiement> {
    const response = await apiClient.get<ModePaiementApiResponse>(`${ModePaiementService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Mode de paiement non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, mode: ModePaiementCreateRequest): Promise<ModePaiementApiResponse> {
    const response = await apiClient.post<ModePaiementApiResponse>(ModePaiementService.BASE_URL, mode);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, mode: ModePaiementUpdateRequest): Promise<ModePaiementApiResponse> {
    const response = await apiClient.put<ModePaiementApiResponse>(`${ModePaiementService.BASE_URL}/${code}`, mode);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<ModePaiementApiResponse> {
    const response = await apiClient.delete<ModePaiementApiResponse>(`${ModePaiementService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<ModePaiementApiResponse> {
    const response = await apiClient.get<ModePaiementApiResponse>(`${ModePaiementService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
