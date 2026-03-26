import { Zone, ZoneApiResponse, ZoneCreateRequest, ZoneUpdateRequest } from "@/types/zone";
import { ApiClient } from "@/lib/api";

export class ZoneService {
  private static readonly BASE_URL = "/zones";

  static async getAll(apiClient: ApiClient): Promise<ZoneApiResponse> {
    const response = await apiClient.get<ZoneApiResponse>(`${ZoneService.BASE_URL}`);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<Zone> {
    const response = await apiClient.get<ZoneApiResponse>(`${ZoneService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Zone non trouvée");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, zone: ZoneCreateRequest): Promise<ZoneApiResponse> {
    const response = await apiClient.post<ZoneApiResponse>(ZoneService.BASE_URL, zone);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, zone: ZoneUpdateRequest): Promise<ZoneApiResponse> {
    const response = await apiClient.put<ZoneApiResponse>(`${ZoneService.BASE_URL}/${code}`, zone);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<ZoneApiResponse> {
    const response = await apiClient.delete<ZoneApiResponse>(`${ZoneService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<ZoneApiResponse> {
    const response = await apiClient.get<ZoneApiResponse>(`${ZoneService.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

