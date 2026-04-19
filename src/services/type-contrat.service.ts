import { TypeContrat, TypeContratApiResponse, TypeContratCreateRequest, TypeContratUpdateRequest } from "@/types/type-contrat";
import { ApiClient } from "@/lib/api";

export class TypeContratService {
  private static readonly BASE_URL = "/types/AC_TYPE_CONTRAT";

  static async getAll(apiClient: ApiClient): Promise<TypeContratApiResponse> {
    const response = await apiClient.get<TypeContratApiResponse>(TypeContratService.BASE_URL);
    return response.data;
  }

  static async getByCode(apiClient: ApiClient, code: string): Promise<TypeContrat> {
    const response = await apiClient.get<TypeContratApiResponse>(`${TypeContratService.BASE_URL}/${code}`);
    const item = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
    if (!item) {
      throw new Error("TypeContrat non trouvé");
    }
    return item;
  }

  static async create(apiClient: ApiClient, type: TypeContratCreateRequest): Promise<TypeContratApiResponse> {
    const response = await apiClient.post<TypeContratApiResponse>(TypeContratService.BASE_URL, type);
    return response.data;
  }

  static async update(apiClient: ApiClient, code: string, type: TypeContratUpdateRequest): Promise<TypeContratApiResponse> {
    const response = await apiClient.put<TypeContratApiResponse>(`${TypeContratService.BASE_URL}/${code}`, type);
    return response.data;
  }

  static async delete(apiClient: ApiClient, code: string): Promise<TypeContratApiResponse> {
    const response = await apiClient.delete<TypeContratApiResponse>(`${TypeContratService.BASE_URL}/${code}`);
    return response.data;
  }

  static async search(apiClient: ApiClient, searchTerm: string): Promise<TypeContratApiResponse> {
    const response = await apiClient.get<TypeContratApiResponse>(`${TypeContratService.BASE_URL}/search`, {
      params: { libelle: searchTerm }
    });
    return response.data;
  }
}
