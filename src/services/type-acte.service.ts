import { TypeActe, TypeActeApiResponse, TypeActeCreateRequest, TypeActeUpdateRequest } from "@/types/type-acte";
import { ApiClient } from "@/lib/api";

export class TypeActeService {
  private static readonly BASE_URL = "/types/AC_TYPE_ACTE";

  static async getAll(apiClient: ApiClient): Promise<TypeActeApiResponse> {
    const response = await apiClient.get<TypeActeApiResponse>(TypeActeService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeActe> {
    const response = await apiClient.get<TypeActeApiResponse>(`${TypeActeService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Type d'acte non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypeActeCreateRequest): Promise<TypeActeApiResponse> {
    const response = await apiClient.post<TypeActeApiResponse>(TypeActeService.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeActeUpdateRequest): Promise<TypeActeApiResponse> {
    const response = await apiClient.put<TypeActeApiResponse>(`${TypeActeService.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeActeApiResponse> {
    const response = await apiClient.delete<TypeActeApiResponse>(`${TypeActeService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeActeApiResponse> {
    const response = await apiClient.get<TypeActeApiResponse>(`${TypeActeService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
