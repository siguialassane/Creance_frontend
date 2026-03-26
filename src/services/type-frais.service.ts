import { TypeFrais, TypeFraisApiResponse, TypeFraisCreateRequest, TypeFraisUpdateRequest } from "@/types/type-frais";
import { ApiClient } from "@/lib/api";

export class TypeFraisService {
  private static readonly BASE_URL = "/types/AC_TYPE_FRAIS";

  static async getAll(apiClient: ApiClient): Promise<TypeFraisApiResponse> {
    const response = await apiClient.get<TypeFraisApiResponse>(TypeFraisService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeFrais> {
    const response = await apiClient.get<TypeFraisApiResponse>(`${TypeFraisService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("TypeFrais non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypeFraisCreateRequest): Promise<TypeFraisApiResponse> {
    const response = await apiClient.post<TypeFraisApiResponse>(TypeFraisService.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeFraisUpdateRequest): Promise<TypeFraisApiResponse> {
    const response = await apiClient.put<TypeFraisApiResponse>(`${TypeFraisService.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeFraisApiResponse> {
    const response = await apiClient.delete<TypeFraisApiResponse>(`${TypeFraisService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeFraisApiResponse> {
    const response = await apiClient.get<TypeFraisApiResponse>(`${TypeFraisService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
