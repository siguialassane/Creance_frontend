import { TypeEmployeur, TypeEmployeurApiResponse, TypeEmployeurCreateRequest, TypeEmployeurUpdateRequest } from "@/types/type-employeur";
import { ApiClient } from "@/lib/api";

export class TypeEmployeurService {
  private static readonly BASE_URL = "/types/AC_TYPE_EMPLOYEUR";

  static async getAll(apiClient: ApiClient): Promise<TypeEmployeurApiResponse> {
    const response = await apiClient.get<TypeEmployeurApiResponse>(TypeEmployeurService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeEmployeur> {
    const response = await apiClient.get<TypeEmployeurApiResponse>(`${TypeEmployeurService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("TypeEmployeur non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypeEmployeurCreateRequest): Promise<TypeEmployeurApiResponse> {
    const response = await apiClient.post<TypeEmployeurApiResponse>(TypeEmployeurService.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeEmployeurUpdateRequest): Promise<TypeEmployeurApiResponse> {
    const response = await apiClient.put<TypeEmployeurApiResponse>(`${TypeEmployeurService.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeEmployeurApiResponse> {
    const response = await apiClient.delete<TypeEmployeurApiResponse>(`${TypeEmployeurService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeEmployeurApiResponse> {
    const response = await apiClient.get<TypeEmployeurApiResponse>(`${TypeEmployeurService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
