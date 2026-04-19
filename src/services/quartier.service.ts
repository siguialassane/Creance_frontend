import { ApiClient } from "@/lib/api";
import { Quartier, QuartierApiResponse, QuartierCreateRequest, QuartierUpdateRequest } from "@/types/quartier";

export class QuartierService {
  private static readonly BASE_URL = "/quartiers";

  static async getAll(apiClient: ApiClient): Promise<QuartierApiResponse> {
    const response = await apiClient.get<QuartierApiResponse>(`${QuartierService.BASE_URL}/all`);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<Quartier> {
    const response = await apiClient.get<QuartierApiResponse>(`${QuartierService.BASE_URL}/${code}`);
    const data = response.data.data;
    const row = Array.isArray(data) ? data[0] : null;
    if (!row) throw new Error("Quartier non trouvé");
    return row;
  }

  static async create(apiClient: ApiClient, quartier: QuartierCreateRequest): Promise<QuartierApiResponse> {
    const response = await apiClient.post<QuartierApiResponse>(QuartierService.BASE_URL, quartier);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, quartier: QuartierUpdateRequest): Promise<QuartierApiResponse> {
    const response = await apiClient.put<QuartierApiResponse>(`${QuartierService.BASE_URL}/${code}`, quartier);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<QuartierApiResponse> {
    const response = await apiClient.delete<QuartierApiResponse>(`${QuartierService.BASE_URL}/${code}`);
    return response.data;
  }
}

