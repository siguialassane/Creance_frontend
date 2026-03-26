import { TypeOvp, TypeOvpApiResponse, TypeOvpCreateRequest, TypeOvpUpdateRequest } from "@/types/type-ovp";
import { ApiClient } from "@/lib/api";

export class TypeOvpService {
  private static readonly BASE_URL = "/types/AC_TYPE_OVP";

  static async getAll(apiClient: ApiClient): Promise<TypeOvpApiResponse> {
    const response = await apiClient.get<TypeOvpApiResponse>(TypeOvpService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeOvp> {
    const response = await apiClient.get<TypeOvpApiResponse>(`${TypeOvpService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("TypeOvp non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypeOvpCreateRequest): Promise<TypeOvpApiResponse> {
    const response = await apiClient.post<TypeOvpApiResponse>(TypeOvpService.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeOvpUpdateRequest): Promise<TypeOvpApiResponse> {
    const response = await apiClient.put<TypeOvpApiResponse>(`${TypeOvpService.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeOvpApiResponse> {
    const response = await apiClient.delete<TypeOvpApiResponse>(`${TypeOvpService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeOvpApiResponse> {
    const response = await apiClient.get<TypeOvpApiResponse>(`${TypeOvpService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
