import { Civilite, CiviliteApiResponse, CiviliteCreateRequest, CiviliteUpdateRequest } from "@/types/civilite";
import { ApiClient } from "@/lib/api";

export class CiviliteService {
  private static readonly BASE_URL = "/civilites";

  static async getAll(apiClient: ApiClient): Promise<CiviliteApiResponse> {
    const response = await apiClient.get<CiviliteApiResponse>(CiviliteService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<Civilite> {
    const response = await apiClient.get<CiviliteApiResponse>(`${CiviliteService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Civilité non trouvée");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, civilite: CiviliteCreateRequest): Promise<CiviliteApiResponse> {
    const response = await apiClient.post<CiviliteApiResponse>(CiviliteService.BASE_URL, civilite);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, civilite: CiviliteUpdateRequest): Promise<CiviliteApiResponse> {
    const response = await apiClient.put<CiviliteApiResponse>(`${CiviliteService.BASE_URL}/${code}`, civilite);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<CiviliteApiResponse> {
    const response = await apiClient.delete<CiviliteApiResponse>(`${CiviliteService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<CiviliteApiResponse> {
    const response = await apiClient.get<CiviliteApiResponse>(`${CiviliteService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}
