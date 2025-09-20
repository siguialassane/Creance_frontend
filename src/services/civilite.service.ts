import { Civilite, CiviliteApiResponse, CiviliteCreateRequest, CiviliteUpdateRequest } from "@/types/civilite";

export class CiviliteService {
  private static readonly BASE_URL = "/civilites";

  static async getAll(apiClient: any): Promise<CiviliteApiResponse> {
    const response = await apiClient.get<CiviliteApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Civilite> {
    const response = await apiClient.get<CiviliteApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Civilité non trouvée");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, civilite: CiviliteCreateRequest): Promise<CiviliteApiResponse> {
    const response = await apiClient.post<CiviliteApiResponse>(this.BASE_URL, civilite);
    return response.data;
  }

  static async update(apiClient: any, code: string, civilite: CiviliteUpdateRequest): Promise<CiviliteApiResponse> {
    const response = await apiClient.put<CiviliteApiResponse>(`${this.BASE_URL}/${code}`, civilite);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<CiviliteApiResponse> {
    const response = await apiClient.delete<CiviliteApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<CiviliteApiResponse> {
    const response = await apiClient.get<CiviliteApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}
