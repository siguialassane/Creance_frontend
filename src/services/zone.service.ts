import { Zone, ZoneApiResponse, ZoneCreateRequest, ZoneUpdateRequest } from "@/types/zone";

export class ZoneService {
  private static readonly BASE_URL = "/zones";

  static async getAll(apiClient: any): Promise<ZoneApiResponse> {
    const response = await apiClient.get<ZoneApiResponse>(this.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: any, code: string): Promise<Zone> {
    const response = await apiClient.get<ZoneApiResponse>(`${this.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Zone non trouvée");
    }
    return response.data.data[0];
  }

  static async create(apiClient: any, zone: ZoneCreateRequest): Promise<ZoneApiResponse> {
    const response = await apiClient.post<ZoneApiResponse>(this.BASE_URL, zone);
    return response.data;
  }

  static async update(apiClient: any, code: string, zone: ZoneUpdateRequest): Promise<ZoneApiResponse> {
    const response = await apiClient.put<ZoneApiResponse>(`${this.BASE_URL}/${code}`, zone);
    return response.data;
  }

  static async delete(apiClient: any, code: string): Promise<ZoneApiResponse> {
    const response = await apiClient.delete<ZoneApiResponse>(`${this.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: any, searchTerm: string): Promise<ZoneApiResponse> {
    const response = await apiClient.get<ZoneApiResponse>(`${this.BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }
}

