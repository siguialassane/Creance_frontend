import { Nationalite, NationaliteApiResponse, NationaliteCreateRequest, NationaliteUpdateRequest } from "@/types/nationalite";

export class NationaliteService {
  private static readonly BASE_URL = "/nationalites";

  static async getAll(apiClient: any): Promise<NationaliteApiResponse> {
    const response = await apiClient.get<NationaliteApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Nationalite> {
    const response = await apiClient.get<NationaliteApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Nationalité non trouvée");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, nationalite: NationaliteCreateRequest): Promise<NationaliteApiResponse> {
    const response = await apiClient.post<NationaliteApiResponse>(this.BASE_URL, nationalite);
    return response.data;
  }

  static async update(apiClient: any, code: string, nationalite: NationaliteUpdateRequest): Promise<NationaliteApiResponse> {
    const response = await apiClient.put<NationaliteApiResponse>(`${this.BASE_URL}/${code}`, nationalite);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<NationaliteApiResponse> {
    const response = await apiClient.delete<NationaliteApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<NationaliteApiResponse> {
    const response = await apiClient.get<NationaliteApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

