import { Periodicite, PeriodiciteApiResponse, PeriodiciteCreateRequest, PeriodiciteUpdateRequest } from "@/types/periodicite";

export class PeriodiciteService {
  private static readonly BASE_URL = "/periodicites";

  static async getAll(apiClient: any): Promise<PeriodiciteApiResponse> {
    // Utiliser /all pour obtenir une liste simple sans pagination
    const response = await apiClient.get<PeriodiciteApiResponse>(`${PeriodiciteService.BASE_URL}/all`);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Periodicite> {
    const response = await apiClient.get<PeriodiciteApiResponse>(`${PeriodiciteService.BASE_URL}/${code}`);
    if (!response.data.data) {
      throw new Error("Périodicité non trouvée");
    }
    return response.data.data;
  }

  static async create(apiClient: any, periodicite: PeriodiciteCreateRequest): Promise<PeriodiciteApiResponse> {
    const response = await apiClient.post<PeriodiciteApiResponse>(PeriodiciteService.BASE_URL, periodicite);
    return response.data;
  }

  static async update(apiClient: any, code: string, periodicite: PeriodiciteUpdateRequest): Promise<PeriodiciteApiResponse> {
    const response = await apiClient.put<PeriodiciteApiResponse>(`${PeriodiciteService.BASE_URL}/${code}`, periodicite);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<PeriodiciteApiResponse> {
    const response = await apiClient.delete<PeriodiciteApiResponse>(`${PeriodiciteService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<PeriodiciteApiResponse> {
    const response = await apiClient.get<PeriodiciteApiResponse>(`${PeriodiciteService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

