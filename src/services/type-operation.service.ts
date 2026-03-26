import { TypeOperation, TypeOperationApiResponse, TypeOperationCreateRequest, TypeOperationUpdateRequest } from "@/types/type-operation";
import { ApiClient } from "@/lib/api";

export class TypeOperationService {
  private static readonly BASE_URL = "/types/AC_TYPE_OPERATION";

  static async getAll(apiClient: ApiClient): Promise<TypeOperationApiResponse> {
    const response = await apiClient.get<TypeOperationApiResponse>(TypeOperationService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeOperation> {
    const response = await apiClient.get<TypeOperationApiResponse>(`${TypeOperationService.BASE_URL}/${code}`);
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Type d'opération non trouvé");
    }
    return response.data.data[0];
  }

  static async create(apiClient: ApiClient, type: TypeOperationCreateRequest): Promise<TypeOperationApiResponse> {
    const response = await apiClient.post<TypeOperationApiResponse>(TypeOperationService.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeOperationUpdateRequest): Promise<TypeOperationApiResponse> {
    const response = await apiClient.put<TypeOperationApiResponse>(`${TypeOperationService.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeOperationApiResponse> {
    const response = await apiClient.delete<TypeOperationApiResponse>(`${TypeOperationService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeOperationApiResponse> {
    const response = await apiClient.get<TypeOperationApiResponse>(`${TypeOperationService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
